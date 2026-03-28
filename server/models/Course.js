const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },
  images: [{
    url: String,
    filename: String,
    originalName: String,
    caption: String
  }],
  videos: [{
    url: String,
    filename: String,
    originalName: String,
    caption: String,
    thumbnail: String
  }],
  /** Structured lesson pages (text content) */
  pages: [{
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true }
  }],
  category: {
    type: String,
    enum: ['stem', 'languages', 'arts', 'business', 'technology', 'general'],
    default: 'general'
  },
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

courseSchema.index({ isPublished: 1, order: 1, createdAt: -1 });

module.exports = mongoose.model('Course', courseSchema);
