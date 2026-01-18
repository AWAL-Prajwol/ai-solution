import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Event from '@/models/Event';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const upcoming = searchParams.get('upcoming');

    // Build filter query - only published events
    const filter: Record<string, any> = { published: true };

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