const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Check for required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const optionalEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS'
];

console.log('🔍 Checking environment configuration...');

// Check required variables
const missingRequired = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingRequired.length > 0) {
  console.error('❌ Missing required environment variables:', missingRequired);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Check optional variables and warn if missing
const missingOptional = optionalEnvVars.filter(envVar => !process.env[envVar]);
if (missingOptional.length > 0) {
  console.warn('⚠️  Missing optional environment variables:', missingOptional);
  console.warn('Some features may not work properly without these variables.');
  console.warn('See ENVIRONMENT_SETUP_GUIDE.md for setup instructions.');
}

// Log configuration status
console.log('✅ Environment configuration check completed');
console.log('📁 File uploads:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configured' : '❌ Not configured');
console.log('💳 Payments:', process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Not configured');
console.log('📧 Email notifications:', process.env.EMAIL_PASS ? '✅ Configured' : '❌ Not configured');
console.log('');

const app = express();

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://dafitech.org',
      'https://www.dafitech.org',
      'https://api.dafitech.org'
    ]
  : [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:4000',
      'http://localhost:5000'
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/news', require('./routes/news'));
app.use('/api/directory', require('./routes/directory'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/team', require('./routes/team'));
app.use('/api/files', require('./routes/files'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/reactions', require('./routes/reactions'));
app.use('/api/tutorials', require('./routes/tutorials'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/onetigray?retryWrites=true&w=majority&appName=Cluster0&serverSelectionTimeoutMS=30000';

// Enhanced MongoDB connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });
    console.log('✅ MongoDB connected successfully');
    
    // Monitor connection status
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected - attempting to reconnect...');
    });
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check MongoDB Atlas cluster is running');
    console.log('2. Whitelist your IP address in Atlas Network Access');
    console.log('3. Verify connection string is correct');
    console.log('4. Check database user permissions\n');
    
    // Retry connection after 10 seconds
    setTimeout(connectDB, 10000);
  }
};

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
