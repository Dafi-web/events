#!/usr/bin/env node

/**
 * Test Modern GridFS Upload
 */

const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

async function testModernGridFS() {
  console.log('🧪 Testing Modern GridFS Upload...\n');

  try {
    // Connect to MongoDB
    const MONGODB_URI = 'mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/onetigray?retryWrites=true&w=majority&appName=Cluster0&serverSelectionTimeoutMS=30000';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Initialize GridFS
    const gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    console.log('✅ GridFS bucket initialized');

    // Create a simple test file
    const testContent = 'This is a test file for modern GridFS upload';
    const filename = `test-modern-${Date.now()}.txt`;

    console.log('📤 Uploading test file to GridFS...');

    // Upload file to GridFS
    const uploadStream = gfsBucket.openUploadStream(filename, {
      metadata: {
        originalName: 'test.txt',
        uploadDate: new Date(),
        type: 'test'
      }
    });

    uploadStream.on('error', (error) => {
      console.error('❌ Upload error:', error);
    });

    uploadStream.on('finish', () => {
      console.log('✅ File uploaded successfully!');
      console.log('Filename:', filename);
      console.log('URL:', `/api/files/uploads/${filename}`);
      
      // Test reading the file back
      console.log('\n📖 Testing file retrieval...');
      const downloadStream = gfsBucket.openDownloadStreamByName(filename);
      let retrievedContent = '';
      
      downloadStream.on('data', (chunk) => {
        retrievedContent += chunk.toString();
      });
      
      downloadStream.on('end', () => {
        console.log('✅ File retrieved successfully!');
        console.log('Content:', retrievedContent);
        console.log('\n🎉 Modern GridFS upload and retrieval working perfectly!');
        process.exit(0);
      });
      
      downloadStream.on('error', (error) => {
        console.error('❌ Read error:', error);
        process.exit(1);
      });
    });

    uploadStream.end(testContent);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testModernGridFS().catch(console.error);
