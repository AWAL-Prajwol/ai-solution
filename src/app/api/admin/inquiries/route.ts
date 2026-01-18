import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
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
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const company = searchParams.get('company');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build filter query
    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (company) {
      filter.companyName = { $regex: company, $options: 'i' };
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Build sort query
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get inquiries with pagination
    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Inquiry.countDocuments(filter),
    ]);

    // Get metrics for the filtered data
    const [totalAll, pending, inProgress, completed, rejected] =
      await Promise.all([
        Inquiry.countDocuments({}),
        Inquiry.countDocuments({ status: 'pending' }),
        Inquiry.countDocuments({ status: 'in-progress' }),
        Inquiry.countDocuments({ status: 'completed' }),
        Inquiry.countDocuments({ status: 'rejected' }),
      ]);

    // Return inquiries with metadata
    return NextResponse.json({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      metrics: {
        total: totalAll,
        pending,
        inProgress,
        completed,
        rejected,
      },
    });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
