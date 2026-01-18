import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const category = searchParams.get('category');

    // Build filter query - only published blogs
    const filter: Record<string, any> = { published: true };

    if (category && category !== 'All Posts') {
      filter.category = category;
    }

    // Get blogs with pagination
    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);

    // Return blogs with metadata
    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}