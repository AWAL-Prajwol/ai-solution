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

    // Build filter query
    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status;
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

    // Get all inquiries matching the filter
    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).lean();

    // Convert to CSV format
    const csvHeaders = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Country',
      'Job Title',
      'Job Description',
      'Status',
      'Admin Notes',
      'Created At',
      'Updated At',
    ];

    const csvRows = inquiries.map((inquiry) => [
      inquiry._id,
      `"${inquiry.name}"`,
      inquiry.email,
      inquiry.phone,
      `"${inquiry.companyName}"`,
      `"${inquiry.country}"`,
      `"${inquiry.jobTitle}"`,
      `"${inquiry.jobDescription}"`,
      inquiry.status,
      `"${inquiry.adminNotes || ''}"`,
      new Date(inquiry.createdAt).toISOString(),
      new Date(inquiry.updatedAt).toISOString(),
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.join(',')),
    ].join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `inquiries-export-${timestamp}.csv`;

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
