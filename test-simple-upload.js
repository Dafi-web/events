#!/usr/bin/env node

/**
 * Simple Upload Test - Test GridFS directly
 */

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const fs = require('fs');

async function testSimpleUpload() {
  console.log('🧪 Testing Simple GridFS Upload...\n');

  try {
    // Connect to MongoDB
    const MONGODB_URI = 'mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/dafitech?retryWrites=true&w=majority&appName=Cluster0&serverSelectionTimeoutMS=30000';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Initialize GridFS
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');

    // Create a simple test file
    const testContent = 'This is a test file for GridFS upload';
    const filename = `test-${Date.now()}.txt`;

    console.log('📤 Uploading test file to GridFS...');

    // Upload file to GridFS
    const writeStream = gfs.createWriteStream({
      filename: filename,
      metadata: {
        originalName: 'test.txt',
        uploadDate: new Date(),
        type: 'test'
      }
    });

    writeStream.on('error', (error) => {
      console.error('❌ Upload error:', error);
    });

    writeStream.on('close', () => {
      console.log('✅ File uploaded successfully!');
      console.log('Filename:', filename);
      console.log('URL:', `/api/files/uploads/${filename}`);
      
      // Test reading the file back
      console.log('\n📖 Testing file retrieval...');
      const readStream = gfs.createReadStream({ filename: filename });
      let retrievedContent = '';
      
      readStream.on('data', (chunk) => {
        retrievedContent += chunk.toString();
      });
      
      readStream.on('end', () => {
        console.log('✅ File retrieved successfully!');
        console.log('Content:', retrievedContent);
        console.log('\n🎉 GridFS upload and retrieval working perfectly!');
        process.exit(0);
      });
      
      readStream.on('error', (error) => {
        console.error('❌ Read error:', error);
        process.exit(1);
      });
    });

    writeStream.end(testContent);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testSimpleUpload().catch(console.error);
