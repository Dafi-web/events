const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  bioAmharic: {
    type: String,
    required: true
  },
  education: [{
    degree: String,
    field: String,
    institution: String,
    year: String,
    isTopUniversity: {
      type: Boolean,
      default: false
    }
  }],
  expertise: [String],
  languages: [String],
  profileImage: {
    type: String
  },
  socialLinks: {
    linkedin: String,
    email: String,
    website: String,
    twitter: String
  },
  isInstructor: {
    type: Boolean,
    default: false
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
teamMemberSchema.index({ isActive: 1, order: 1 });
teamMemberSchema.index({ isInstructor: 1 });

module.exports = mongoose.model('TeamMember', teamMemberSchema);

