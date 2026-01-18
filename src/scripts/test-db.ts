import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../lib/db';
import Feedback from '../models/Feedback';

async function testDB() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Try to fetch feedback count
    const count = await Feedback.countDocuments();
    console.log(`📊 Found ${count} feedback entries in the database`);
    
    // Try to fetch all feedback
    const feedback = await Feedback.find().limit(5);
    console.log(`📋 Sample feedback entries:`, feedback.map(f => ({
      id: f._id,
      name: f.name,
      approved: f.approved,
      createdAt: f.createdAt
    })));
    
    console.log('✅ Database test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDB();