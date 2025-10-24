#!/usr/bin/env node

/**
 * Test Cloudinary Configuration
 * This script tests if Cloudinary is properly configured
 */

require('dotenv').config({ path: './server/.env' });

console.log('🔍 Testing Cloudinary Configuration...\n');

// Check if environment variables are set
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Environment Variables:');
console.log(`CLOUDINARY_CLOUD_NAME: ${cloudName ? '✅ Set' : '❌ Missing'}`);
console.log(`CLOUDINARY_API_KEY: ${apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`CLOUDINARY_API_SECRET: ${apiSecret ? '✅ Set' : '❌ Missing'}\n`);

if (!cloudName || !apiKey || !apiSecret) {
  console.log('❌ Cloudinary configuration is incomplete!');
  console.log('\nTo fix this:');
  console.log('1. Run: node setup-cloudinary.js');
  console.log('2. Or manually create server/.env with your Cloudinary credentials');
  console.log('3. See CLOUDINARY_SETUP.md for detailed instructions');
  process.exit(1);
}

// Test Cloudinary connection
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

console.log('Testing Cloudinary connection...');

cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful!');
    console.log(`Status: ${result.status}`);
    console.log('\n🎉 Your file uploads should now work!');
    console.log('\nNext steps:');
    console.log('1. Start your server: cd server && npm start');
    console.log('2. Go to the admin dashboard');
    console.log('3. Try uploading images and videos');
  })
  .catch(error => {
    console.log('❌ Cloudinary connection failed!');
    console.log('Error:', error.message);
    console.log('\nPlease check:');
    console.log('1. Your Cloudinary credentials are correct');
    console.log('2. Your internet connection is working');
    console.log('3. Your Cloudinary account is active');
  });
