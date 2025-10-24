#!/usr/bin/env node

/**
 * Script to update all events' active status based on their dates
 * This can be run as a cron job to automatically update event statuses
 * 
 * Usage:
 * node server/scripts/updateEventStatus.js
 * 
 * Or as a cron job (daily at midnight):
 * 0 0 * * * cd /path/to/your/app && node server/scripts/updateEventStatus.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Event model
const Event = require('../models/Event');

async function updateEventStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onetigray', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Update active status for all events
    await Event.updateActiveStatus();

    console.log('Event active status updated successfully');

    // Get some statistics
    const activeEvents = await Event.countDocuments({ isActive: true });
    const inactiveEvents = await Event.countDocuments({ isActive: false });

    console.log(`Active events: ${activeEvents}`);
    console.log(`Inactive events: ${inactiveEvents}`);

  } catch (error) {
    console.error('Error updating event status:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the script
updateEventStatus();


