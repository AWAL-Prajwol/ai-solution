import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CaseStudy from '@/models/CaseStudy';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const industry = searchParams.get('industry');

    // Build filter query - only published case studies
    const filter: Record<string, any> = { published: true };

    if (industry && industry !== 'All Industries') {
      filter.industry = industry;
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