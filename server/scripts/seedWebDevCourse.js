/**
 * Seeds the "Complete Web Development" course (requires an admin user).
 * Usage: from server directory, `node scripts/seedWebDevCourse.js`
 * Or:    npm run seed:webdev
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const webDev = require('../data/webDevCourse');

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI or MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('No user with role "admin" found. Create an admin user first.');
    await mongoose.disconnect();
    process.exit(1);
  }

  const existing = await Course.findOne({ title: webDev.title });
  if (existing) {
    console.log('Course already exists:', existing._id.toString());
    await mongoose.disconnect();
    process.exit(0);
  }

  const course = new Course({
    title: webDev.title,
    summary: webDev.summary,
    description: webDev.description,
    category: webDev.category,
    order: webDev.order,
    isPublished: webDev.isPublished,
    pages: webDev.pages,
    createdBy: admin._id
  });

  await course.save();
  console.log('Created web dev course:', course._id.toString());
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
