import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog';
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
    // Verify admin token
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');

    // Build filter query
    const filter: Record<string, any> = {};

    if (category) {
      filter.category = category;
    }

    if (published) {
      filter.published = published === 'true';
    }

    if (featured) {
      filter.featured = featured === 'true';
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

    // Create new blog
    const blog = new Blog({
      ...body,
      date: body.date ? new Date(body.date) : new Date(),
    });

    // Save to database
    await blog.save();

    // Return success response
    return NextResponse.json(
      {
        message: 'Blog created successfully',
        blog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}