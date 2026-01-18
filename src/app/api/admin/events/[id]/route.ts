import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // For public events endpoint, no authentication required
    const publicAccess = request.headers.get('x-public-access') === 'true';
    
    // Verify admin token only for admin access
    if (!publicAccess) {
      const decoded = await verifyAdminToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Connect to database
    await connectDB();

    // Find event by ID
    const event = await Event.findById(params.id).lean();
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // For public access, only return published events
    if (publicAccess && !(event as any).published) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Return event
    return NextResponse.json(event);
  } catch (error) {
    console.error('Fetch event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Find event by ID and update
    const event = await Event.findByIdAndUpdate(
      params.id,
      { 
        ...body,
        date: body.date ? new Date(body.date) : undefined
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Return updated event
    return NextResponse.json({
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Find event by ID and delete
    const event = await Event.findByIdAndDelete(params.id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}