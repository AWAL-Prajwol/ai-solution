import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import jwt from 'jsonwebtoken';
import { inquirySchema } from '@/lib/validation';

// Middleware to verify admin token
async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Add status to the validation schema temporarily
    const extendedBody = {
      ...body,
      // Remove status from validation as it's optional
    };

    // Validate input data (excluding status)
    const { status, ...inquiryData } = body;
    const validationResult = inquirySchema.safeParse(inquiryData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Validate status separately
    const validStatuses = ['pending', 'in-progress', 'completed', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Create inquiry
    const inquiry = new Inquiry({
      ...validationResult.data,
      status: status || 'pending',
    });

    await inquiry.save();

    // Return created inquiry
    return NextResponse.json(
      {
        message: 'Inquiry created successfully',
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create inquiry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
