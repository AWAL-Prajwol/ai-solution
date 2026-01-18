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

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const published = searchParams.get('published');
    const upcoming = searchParams.get('upcoming');

    // Build filter query
    const filter: Record<string, any> = {};

    if (published && !publicAccess) {
      filter.published = published === 'true';
    } else if (publicAccess) {
      // For public access, only show published events
      filter.published = true;
    }

    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }

    // Get events with pagination
    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip(skip).limit(limit).lean(),
      Event.countDocuments(filter),
    ]);

    // Return events with metadata
    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    // Create new event
    const event = new Event({
      ...body,
      date: body.date ? new Date(body.date) : new Date(),
    });

    // Save to database
    await event.save();

    // Return success response
    return NextResponse.json(
      {
        message: 'Event created successfully',
        event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}