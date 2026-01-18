import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { inquirySchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate input data
    const validationResult = inquirySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Create new inquiry
    const inquiry = new Inquiry({
      ...validatedData,
      status: 'pending',
    });

    // Save to database
    await inquiry.save();

    // Return success response
    return NextResponse.json(
      {
        message: 'Inquiry submitted successfully',
        inquiryId: inquiry._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);

    // Check if it's a validation error
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    // Check if it's a duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'An inquiry with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API endpoint' },
    { status: 200 }
  );
}
