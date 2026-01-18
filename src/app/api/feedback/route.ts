import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Feedback from '@/models/Feedback';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// Validation schema for feedback submission
const feedbackSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  company: z.string().min(2).max(150),
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10).max(1000),
  industry: z.string().min(2).max(100),
});

// Create email transporter using existing SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send feedback notification to admin
const sendFeedbackNotification = async (feedback: any) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"AI-Solutions Notifications" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'admin@ai-solutions.com',
      subject: `New Customer Feedback from ${feedback.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Feedback Received</h1>
            <p style="color: #e8eaf6; margin: 10px 0 0 0;">AI-Solutions Customer Feedback</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-top: 0;">Customer Details</h2>
            <p><strong>Name:</strong> ${feedback.name}</p>
            <p><strong>Email:</strong> ${feedback.email}</p>
            <p><strong>Company:</strong> ${feedback.company}</p>
            <p><strong>Industry:</strong> ${feedback.industry}</p>
            <p><strong>Rating:</strong> ${feedback.rating}/5 stars</p>
            
            <h2 style="color: #333;">Feedback</h2>
            <p style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px;">
              ${feedback.feedback}
            </p>
            
            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #666; font-size: 14px;">
                Please review this feedback in the admin panel and approve it for public display.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>This is an automated message from AI-Solutions. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Feedback notification sent to admin for ${feedback.name}`);
  } catch (error) {
    console.error('📧 Failed to send feedback notification:', error);
  }
};

// Send feedback confirmation to customer
const sendFeedbackConfirmation = async (feedback: any) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"AI-Solutions Team" <${process.env.SMTP_USER}>`,
      to: feedback.email,
      subject: 'Thank You for Your Feedback!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Your Feedback!</h1>
            <p style="color: #e8eaf6; margin: 10px 0 0 0;">AI-Solutions Customer Experience</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-top: 0;">Dear ${feedback.name},</h2>
            
            <p>Thank you for taking the time to share your experience with AI-Solutions. Your feedback is incredibly valuable to us and helps us improve our services.</p>
            
            <p>We've received your ${feedback.rating}-star rating and the following feedback:</p>
            
            <p style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px; font-style: italic;">
              "${feedback.feedback}"
            </p>
            
            <p>Your feedback will be reviewed by our team and, once approved, will be featured on our website to help other potential customers learn about our services.</p>
            
            <p>If you have any additional questions or concerns, please don't hesitate to reach out to us at support@ai-solutions.com.</p>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://ai-solutions.com" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit Our Website</a>
            </div>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>© 2024 AI-Solutions. All rights reserved.</p>
            <p>This is an automated message from AI-Solutions. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Feedback confirmation sent to customer ${feedback.name}`);
  } catch (error) {
    console.error('📧 Failed to send feedback confirmation:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const showAll = searchParams.get('showAll') === 'true'; // New parameter to show all feedback

    // Build filter query - by default only approved feedback, but can show all for testing
    const filter: any = showAll ? {} : { approved: true };

    // Get feedback with pagination
    const [feedback, total] = await Promise.all([
      Feedback.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Feedback.countDocuments(filter),
    ]);

    // Return feedback with metadata
    return NextResponse.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate request body
    const validatedData = feedbackSchema.parse(body);

    // Create new feedback entry
    const newFeedback = new Feedback({
      ...validatedData,
      approved: false, // Feedback needs approval before being displayed
    });

    // Save feedback
    const savedFeedback = await newFeedback.save();

    // Send notifications (don't wait for them to complete)
    sendFeedbackNotification(savedFeedback.toObject());
    sendFeedbackConfirmation(savedFeedback.toObject());

    // Return success response with the saved feedback
    return NextResponse.json(
      { 
        message: 'Feedback submitted successfully. It will be reviewed and published shortly.',
        feedback: savedFeedback.toObject()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submit feedback error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
