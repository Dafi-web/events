/**
 * Seeds the MERN stack course (requires an admin user).
 * Usage: cd server && npm run seed:mern
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const mern = require('../data/mernCourse');

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI or MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('No user with role "admin" found.');
    await mongoose.disconnect();
    process.exit(1);
  }

  const existing = await Course.findOne({ title: mern.title });
  if (existing) {
    console.log('MERN course already exists:', existing._id.toString());
    await mongoose.disconnect();
    process.exit(0);
  }

  const course = new Course({
    title: mern.title,
    summary: mern.summary,
    description: mern.description,
    category: mern.category,
    order: mern.order,
    isPublished: mern.isPublished,
    pages: mern.pages,
    createdBy: admin._id
  });

  await course.save();
  console.log('Created MERN course:', course._id.toString());
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
