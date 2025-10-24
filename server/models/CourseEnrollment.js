const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: String,
    required: true,
    enum: ['math-grade-5-12', 'english-grade-5-12', 'physics-grade-5-12', 'electrical-engineering', 'mern-fullstack', 'computer-basics']
  },
  courseName: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  telephone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  currentLevel: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  learningGoals: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  previousExperience: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  availability: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  motivation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  preferredLearningStyle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  budget: {
    type: Number,
    required: false,
    min: 0
  },
  languages: [{
    type: String,
    trim: true
  }],
  contactInfo: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'enrolled', 'completed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 500
  },
  enrollmentDate: {
    type: Date
  },
  completionDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
courseEnrollmentSchema.index({ user: 1, course: 1 });
courseEnrollmentSchema.index({ status: 1 });
courseEnrollmentSchema.index({ createdAt: -1 });

// Virtual for course display name
courseEnrollmentSchema.virtual('courseDisplayName').get(function() {
  const courseNames = {
    'math-grade-5-12': 'Mathematics (Grade 5-12)',
    'english-grade-5-12': 'English (Grade 5-12)',
    'physics-grade-5-12': 'Physics (Grade 5-12)',
    'electrical-engineering': 'Electrical Engineering',
    'mern-fullstack': 'MERN Full Stack Web Development',
    'computer-basics': 'Basics of Computers'
  };
  return courseNames[this.course] || this.course;
});

// Ensure virtual fields are serialized
courseEnrollmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
