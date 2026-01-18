import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to database
    await connectDB();

    // Find blog by ID - only published blogs
    const blog = await Blog.findOne({ _id: params.id, published: true }).lean();
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Return blog
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Fetch blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}