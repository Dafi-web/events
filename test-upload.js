#!/usr/bin/env node

/**
 * Test File Upload to MongoDB GridFS
 * This script tests the file upload functionality
 */

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function testUpload() {
  console.log('🧪 Testing File Upload to MongoDB GridFS...\n');

  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    // Create form data
    const formData = new FormData();
    formData.append('title', 'Test Event with Upload');
    formData.append('description', 'Testing file upload functionality');
    formData.append('date', '2025-12-31');
    formData.append('time', '12:00');
    formData.append('location', JSON.stringify({
      name: 'Test Location',
      country: 'Test Country'
    }));
    formData.append('category', 'cultural');
    formData.append('images', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });

    console.log('📤 Uploading test event with image...');

    // Make the request
    const response = await axios.post('http://localhost:4000/api/events', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': 'Bearer your-jwt-token-here' // You'll need to get a real token
      },
      timeout: 10000
    });

    console.log('✅ Upload successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\nTroubleshooting:');
    console.log('1. Make sure the server is running on port 4000');
    console.log('2. Check if you have a valid JWT token');
    console.log('3. Verify MongoDB connection is working');
  }
}

testUpload().catch(console.error);
