import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdminUser from '@/models/AdminUser';
import OTPToken from '@/models/OTPToken';
import argon2 from 'argon2';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { newPassword, confirmPassword } = await request.json();

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation are required' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // In a real implementation, you would retrieve the user's email from the session
    // For this example, we'll assume it's stored in a temporary way
    // You might want to use a more secure method like session storage or JWT tokens
    
    // Find the most recent unused OTP token to get the user's email
    const otpToken = await OTPToken.findOne({
      used: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpToken) {
      return NextResponse.json(
        { error: 'Session expired. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Find the admin user
    const adminUser = await AdminUser.findOne({ email: otpToken.email });
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update the admin user's password
    adminUser.password = hashedPassword;
    await adminUser.save();

    // Mark the OTP token as used
    otpToken.used = true;
    await otpToken.save();

    // Send password reset confirmation email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: `"AI-Solutions Admin" <${process.env.SMTP_USER}>`,
        to: adminUser.email,
        subject: 'Password Reset Confirmation - AI-Solutions Admin',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">AI-Solutions</h1>
              <p style="color: #e8eaf6; margin: 10px 0 0 0;">Password Reset Confirmation</p>
            </div>

            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333; margin-top: 0;">Hello ${adminUser.firstName || 'Admin User'},</h2>
              
              <p>Your password has been successfully reset. You can now log in to your admin account with your new password.</p>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #155724; margin: 0; font-weight: bold;">
                  Security Notice: If you didn't request this password reset, please contact our support team immediately.
                </p>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="http://localhost:3000/admin/login" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Login to Admin Panel</a>
              </div>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
              <p>© 2024 AI-Solutions. All rights reserved.</p>
              <p>This is an automated message from AI-Solutions. Please do not reply to this email.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Password reset confirmation email sent to ${adminUser.email}`);
    } catch (emailError) {
      console.error('Failed to send password reset confirmation email:', emailError);
    }

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}