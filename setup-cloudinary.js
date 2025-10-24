#!/usr/bin/env node

/**
 * Cloudinary Setup Helper Script
 * This script helps you set up Cloudinary configuration for your OneTigray application
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupCloudinary() {
  console.log('🚀 OneTigray Cloudinary Setup\n');
  console.log('This script will help you configure Cloudinary for file uploads.\n');
  
  console.log('First, you need to:');
  console.log('1. Go to https://cloudinary.com/ and create a free account');
  console.log('2. Get your credentials from the dashboard\n');
  
  const cloudName = await question('Enter your Cloudinary Cloud Name: ');
  const apiKey = await question('Enter your Cloudinary API Key: ');
  const apiSecret = await question('Enter your Cloudinary API Secret: ');
  
  if (!cloudName || !apiKey || !apiSecret) {
    console.log('❌ All fields are required. Please run the script again.');
    rl.close();
    return;
  }
  
  // Generate a random JWT secret
  const jwtSecret = require('crypto').randomBytes(64).toString('hex');
  
  const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/onetigray?retryWrites=true&w=majority&appName=Cluster0&serverSelectionTimeoutMS=30000

# JWT Secret for authentication
JWT_SECRET=${jwtSecret}

# Cloudinary Configuration for file uploads
CLOUDINARY_CLOUD_NAME=${cloudName}
CLOUDINARY_API_KEY=${apiKey}
CLOUDINARY_API_SECRET=${apiSecret}

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=4000
NODE_ENV=development
`;

  const envPath = path.join(__dirname, 'server', '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log(`📁 Location: ${envPath}`);
    console.log('\n🔧 Next steps:');
    console.log('1. Restart your server: cd server && npm start');
    console.log('2. Test file uploads in the admin dashboard');
    console.log('3. Check the server logs for upload confirmations');
    console.log('\n🎉 Your file uploads should now work!');
  } catch (error) {
    console.log('❌ Error creating .env file:', error.message);
    console.log('\nPlease create the file manually:');
    console.log('1. Create a file named .env in the server directory');
    console.log('2. Copy the content below:');
    console.log('\n' + '='.repeat(50));
    console.log(envContent);
    console.log('='.repeat(50));
  }
  
  rl.close();
}

setupCloudinary().catch(console.error);
