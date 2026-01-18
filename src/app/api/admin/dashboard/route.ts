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

    // Get metrics
    const [total, pending, inProgress, completed, rejected] = await Promise.all(
      [
        Inquiry.countDocuments({}),
        Inquiry.countDocuments({ status: 'pending' }),
        Inquiry.countDocuments({ status: 'in-progress' }),
        Inquiry.countDocuments({ status: 'completed' }),
        Inquiry.countDocuments({ status: 'rejected' }),
      ]
    );

    // Get recent activity (last 10 inquiries)
    const recentActivity = await Inquiry.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Return dashboard data
    return NextResponse.json({
      metrics: {
        total,
        pending,
        inProgress,
        completed,
        rejected,
      },
      recentActivity,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
