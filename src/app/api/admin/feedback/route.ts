import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Feedback from '@/models/Feedback';

// GET /api/admin/feedback - Get all feedback with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const approved = searchParams.get('approved');
    const search = searchParams.get('search');

    // Build filter query
    const filter: Record<string, any> = {};

    if (approved === 'true') {
      filter.approved = true;
    } else if (approved === 'false') {
      filter.approved = false;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { feedback: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
      ];
    }

    // Get feedback with pagination
    const [feedback, total] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Feedback.countDocuments(filter),
    ]);

    // Return feedback with metadata
    return NextResponse.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/feedback/:id - Update feedback approval status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { approved } = body;

    // Validate input
    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Approved field is required and must be a boolean' },
        { status: 400 }
      );
    }

    // Find and update feedback
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      params.id,
      { approved },
      { new: true }
    );

    if (!updatedFeedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Return updated feedback
    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error('Update feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/feedback/:id - Delete feedback
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to database
    await connectDB();

    // Find and delete feedback
    const deletedFeedback = await Feedback.findByIdAndDelete(params.id);

    if (!deletedFeedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}