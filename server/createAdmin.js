const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/dafitech?retryWrites=true&w=majority&appName=Cluster0');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@dafitech.org' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@dafitech.org');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@dafitech.org',
      password: 'admin123', // This will be hashed by the pre-save middleware
      country: 'Ethiopia',
      profession: 'Administrator',
      bio: 'System Administrator for DafiTech',
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@dafitech.org');
    console.log('Password: admin123');
    console.log('\nYou can now login with these credentials on the website.');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
};

createAdmin();
