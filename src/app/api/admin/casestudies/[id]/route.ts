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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Find case study by ID
    const caseStudy = await CaseStudy.findById(params.id).lean();
    if (!caseStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    // Return case study
    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error('Fetch case study error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Find case study by ID and update
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!caseStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    // Return updated case study
    return NextResponse.json({
      message: 'Case study updated successfully',
      caseStudy,
    });
  } catch (error) {
    console.error('Update case study error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Find case study by ID and delete
    const caseStudy = await CaseStudy.findByIdAndDelete(params.id);
    if (!caseStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({
      message: 'Case study deleted successfully',
    });
  } catch (error) {
    console.error('Delete case study error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}