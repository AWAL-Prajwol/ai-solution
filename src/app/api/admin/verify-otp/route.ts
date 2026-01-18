import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import OTPToken from '@/models/OTPToken';
import argon2 from 'argon2';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { otp } = await request.json();

    if (!otp) {
      return NextResponse.json(
        { error: 'OTP is required' },
        { status: 400 }
      );
    }

    // Find the OTP token (assuming it's stored with the user's session or in a temporary store)
    // In a real implementation, you might need to pass an identifier for which OTP to verify
    const otpToken = await OTPToken.findOne({
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpToken) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify the OTP
    const isValidOTP = await argon2.verify(otpToken.otpHash, otp);
    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please check and try again.' },
        { status: 400 }
      );
    }

    // In a more secure implementation, you might want to mark this OTP as "verified but not used"
    // and store a session identifier for the next step
    
    return NextResponse.json({
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}