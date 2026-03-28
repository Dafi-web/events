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

const slideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, default: '' },
    variant: {
      type: String,
      enum: ['intro', 'content', 'practice', 'summary'],
      default: 'content'
    },
    theme: {
      type: String,
      enum: ['indigo', 'emerald', 'amber', 'rose', 'slate', 'violet'],
      default: 'indigo'
    },
    /** Optional voice-over (MP3, M4A, OGG, WAV URL — host on Cloudinary/CDN) */
    narrationUrl: { type: String, default: '', trim: true },
    /** Optional teaching visual: GIF, image, or short video URL */
    mediaUrl: { type: String, default: '', trim: true },
    mediaKind: {
      type: String,
      enum: ['', 'gif', 'image', 'video'],
      default: ''
    },
    /** Optional mini exercise on this slide (same shape as lesson practices) */
    practice: { type: practiceSchema, required: false }
  },
  { _id: false }
);

const assessmentQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String }],
    correctIndex: { type: Number, default: 0 }
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Quick check' },
    passingScore: { type: Number, default: 70 },
    questions: { type: [assessmentQuestionSchema], default: [] }
  },
  { _id: false }
);

const tipItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, default: '' }
  },
  { _id: false }
);

const sampleProjectSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    description: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    codeSample: { type: String, default: '' }
  },
  { _id: false }
);

/** Optional rich intro on course overview: explainer video, voice, GIF/visual */
const courseExplainerSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Course introduction' },
    videoUrl: { type: String, default: '', trim: true },
    audioUrl: { type: String, default: '', trim: true },
    visualUrl: { type: String, default: '', trim: true },
    visualKind: {
      type: String,
      enum: ['', 'gif', 'image', 'video'],
      default: ''
    },
    caption: { type: String, default: '' }
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    practices: { type: [practiceSchema], default: [] },
    slides: { type: [slideSchema], default: [] },
    deepDive: { type: String, default: '' },
    lessonTips: [{ type: String }],
    assessment: assessmentSchema,
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
  /** Course-wide tips (shown on overview) */
  tips: { type: [tipItemSchema], default: [] },
  /** Starter repo / sample project for learners */
  sampleProject: sampleProjectSchema,
  /** Intro block: video / audio / GIF to explain the course (overview tab) */
  courseExplainer: courseExplainerSchema,
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
