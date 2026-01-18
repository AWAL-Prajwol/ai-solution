import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Try to connect to the database
    await connectDB();
    
    return NextResponse.json({
      status: 'ok',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}