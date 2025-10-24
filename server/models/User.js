const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  country: {
    type: String,
    required: true
  },
  profession: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profileImage: {
    type: String
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  interests: [String],
  socialLinks: {
    instagram: String,
    linkedin: String,
    twitter: String,
    facebook: String,
    website: String,
    youtube: String
  },
  // Enhanced profile fields
  phone: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  languages: [String],
  timezone: String,
  // Professional details
  company: String,
  jobTitle: String,
  experience: String,
  education: String,
  skills: [String],
  // Preferences
  newsletter: {
    type: Boolean,
    default: true
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  // Activity tracking
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  // Privacy settings
  profileVisibility: {
    type: String,
    enum: ['public', 'members', 'private'],
    default: 'members'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

