import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../lib/db';
import Event from '../models/Event';

async function checkEvents() {
  try {
    console.log('Checking events in database...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Fetch all events
    const events = await Event.find().sort({ date: 1 });
    console.log(`\n📊 Found ${events.length} events:`);
    
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Date: ${event.date}`);
      console.log(`   Published: ${event.published}`);
      console.log(`   Image: ${event.image}`);
      console.log(`   Location: ${event.location}`);
      console.log('---');
    });
    
    // Check upcoming events
    const upcomingEvents = await Event.find({ 
      published: true,
      date: { $gte: new Date() }
    }).sort({ date: 1 });
    
    console.log(`\n📅 Upcoming events (${upcomingEvents.length}):`);
    upcomingEvents.forEach(event => {
      console.log(`- ${event.title} on ${event.date}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking events:', error);
    process.exit(1);
  }
}

checkEvents();