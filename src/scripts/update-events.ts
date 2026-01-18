import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../lib/db';
import Event from '../models/Event';

async function updateEvents() {
  try {
    console.log('Updating events in database...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Get current date
    const currentDate = new Date();
    console.log(`Current date: ${currentDate.toISOString()}`);
    
    // Fetch all events
    const events = await Event.find().sort({ date: 1 });
    console.log(`\n📊 Found ${events.length} events:`);
    
    // Update each event to have a future date
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const newDate = new Date();
      newDate.setDate(currentDate.getDate() + 30 * (i + 1)); // 30 days, 60 days, 90 days, etc.
      
      console.log(`${i + 1}. Updating "${event.title}" from ${event.date} to ${newDate.toISOString()}`);
      
      await Event.findByIdAndUpdate(event._id, {
        date: newDate
      });
    }
    
    console.log('\n✅ All events updated successfully!');
    
    // Verify the updates
    const updatedEvents = await Event.find().sort({ date: 1 });
    console.log('\n📅 Updated events:');
    updatedEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} on ${event.date}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating events:', error);
    process.exit(1);
  }
}

updateEvents();