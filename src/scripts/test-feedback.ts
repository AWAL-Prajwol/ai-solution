import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../lib/db';
import Feedback from '../models/Feedback';

async function testFeedback() {
  try {
    console.log('Testing feedback database connection...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Try to fetch feedback count
    const count = await Feedback.countDocuments();
    console.log(`📊 Found ${count} feedback entries in the database`);
    
    // Try to fetch all feedback
    const feedback = await Feedback.find().sort({ createdAt: -1 }).limit(5);
    console.log(`📋 Recent feedback entries:`, feedback.map(f => ({
      id: f._id,
      name: f.name,
      company: f.company,
      rating: f.rating,
      approved: f.approved,
      createdAt: f.createdAt
    })));
    
    console.log('✅ Feedback test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Feedback test failed:', error);
    process.exit(1);
  }
}

testFeedback();