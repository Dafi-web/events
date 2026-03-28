const mongoose = require('mongoose');

const practiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    instructions: { type: String, default: '' },
    starterCode: { type: String, default: '' },
    solution: { type: String, default: '' },
    language: {
      type: String,
      enum: ['html', 'css', 'javascript', 'mixed'],
      default: 'html'
    }
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    practices: { type: [practiceSchema], default: [] },
    /** Optional embedded video per lesson (e.g. YouTube watch or embed URL) */
    videoUrl: { type: String, default: '', trim: true },
    videoCaption: { type: String, default: '', trim: true }
  },
  { _id: false }
);

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
  /** Structured lesson pages with optional hands-on practices */
  pages: { type: [pageSchema], default: [] },
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
