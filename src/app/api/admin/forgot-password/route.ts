import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdminUser from '@/models/AdminUser';
import OTPToken from '@/models/OTPToken';
import argon2 from 'argon2';
import nodemailer from 'nodemailer';
import { otpEmailTemplate } from '@/lib/emailTemplates';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if admin user exists
    const adminUser = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!adminUser) {
      return NextResponse.json(
        { error: 'No admin account found with this email address' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP
    const otpHash = await argon2.hash(otp);

    // Set expiration (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Delete any existing OTP tokens for this email
    await OTPToken.deleteMany({ email: email.toLowerCase() });

    // Save the new OTP token
    const otpToken = new OTPToken({
      email: email.toLowerCase(),
      otpHash,
      expiresAt,
      used: false,
    });

    await otpToken.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Gmail specific settings
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });

    // Email content using our template
    const mailOptions = {
      from: `"AI-Solutions Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset OTP - AI-Solutions Admin',
      html: otpEmailTemplate(otp, adminUser.firstName || 'Admin User'),
    };

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent successfully to ${email}`);

      return NextResponse.json({
        message: 'OTP sent successfully to your email',
        // Remove this in production - only for development
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}