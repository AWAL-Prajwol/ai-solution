import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdminUser from '@/models/AdminUser';
import { loginSchema } from '@/lib/validation';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'Server misconfiguration: JWT_SECRET not set' },
        { status: 500 }
      );
    }

    // Connect to database
    await connectDB();

    // Bootstrap: create default admin if none exists
    const existingCount = await AdminUser.countDocuments({});
    if (existingCount === 0) {
      const hashed = await argon2.hash('admin123', { type: argon2.argon2id });
      await AdminUser.create({
        email: 'admin@ai-solutions.com',
        password: hashed,
        firstName: 'Admin',
        lastName: 'User',
        role: 'super-admin',
        isActive: true,
      });
    }

    // Parse request body
    const body = await request.json();

    // Validate input data
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Find admin user by email (include password)
    const adminUser = await AdminUser.findOne({ email }).select('+password');
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!adminUser.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Verify password using Argon2id
    const isPasswordValid = await argon2.verify(adminUser.password, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    adminUser.lastLogin = new Date();
    await adminUser.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Return success response with token
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: adminUser._id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Admin login endpoint' },
    { status: 200 }
  );
}
