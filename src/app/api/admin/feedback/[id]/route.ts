import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Feedback from '@/models/Feedback';

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