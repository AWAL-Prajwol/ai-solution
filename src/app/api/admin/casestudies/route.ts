import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CaseStudy from '@/models/CaseStudy';
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
    const industry = searchParams.get('industry');
    const published = searchParams.get('published');

    // Build filter query
    const filter: Record<string, any> = {};

    if (industry) {
      filter.industry = industry;
    }

    if (published) {
      filter.published = published === 'true';
    }

    // Get case studies with pagination
    const [caseStudies, total] = await Promise.all([
      CaseStudy.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CaseStudy.countDocuments(filter),
    ]);

    // Return case studies with metadata
    return NextResponse.json({
      caseStudies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch case studies error:', error);
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

    // Create new case study
    const caseStudy = new CaseStudy(body);

    // Save to database
    await caseStudy.save();

    // Return success response
    return NextResponse.json(
      {
        message: 'Case study created successfully',
        caseStudy,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create case study error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}