import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../lib/db';
import Event from '../models/Event';

async function testEvents() {
  try {
    console.log('Testing events database connection...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Try to fetch events count
    const count = await Event.countDocuments({ published: true });
    console.log(`📊 Found ${count} published events in the database`);
    
    // Try to fetch all events
    const events = await Event.find({ published: true }).sort({ date: 1 });
    console.log(`📋 Published events:`, events.map(e => ({
      id: e._id,
      title: e.title,
      date: e.date,
      published: e.published
    })));
    
    console.log('✅ Events test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Events test failed:', error);
    process.exit(1);
  }
}

testEvents();