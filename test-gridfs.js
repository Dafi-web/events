#!/usr/bin/env node

/**
 * Test MongoDB GridFS Setup
 * This script tests if GridFS is properly configured for file storage
 */

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/dafitech?retryWrites=true&w=majority&appName=Cluster0&serverSelectionTimeoutMS=30000';

async function testGridFS() {
  console.log('🔍 Testing MongoDB GridFS Setup...\n');

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');

    // Initialize GridFS
    console.log('Initializing GridFS...');
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('✅ GridFS initialized successfully');

    // Test GridFS operations
    console.log('Testing GridFS operations...');
    
    // List existing files
    const files = await new Promise((resolve, reject) => {
      gfs.files.find({}).toArray((err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
    
    console.log(`✅ Found ${files.length} existing files in GridFS`);
    
    if (files.length > 0) {
      console.log('Sample files:');
      files.slice(0, 3).forEach(file => {
        console.log(`  - ${file.filename} (${file.metadata?.mimetype || 'unknown type'})`);
      });
    }

    console.log('\n🎉 GridFS is ready for file uploads!');
    console.log('\nNext steps:');
    console.log('1. Start your server: cd server && npm start');
    console.log('2. Go to the admin dashboard');
    console.log('3. Try uploading images and videos');
    console.log('4. Files will be stored in MongoDB GridFS');

  } catch (error) {
    console.error('❌ GridFS setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your MongoDB connection string');
    console.log('2. Ensure MongoDB Atlas is accessible');
    console.log('3. Verify your network connection');
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB connection closed');
  }
}

testGridFS().catch(console.error);
