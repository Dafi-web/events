const mongoose = require('mongoose');

const directorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['business', 'professional', 'organization'],
    required: true
  },
  category: {
    type: String,
    enum: ['restaurant', 'retail', 'services', 'healthcare', 'education', 'technology', 'finance', 'non-profit', 'other'],
    required: true
  },
  contact: {
    email: String,
    phone: String,
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: {
        type: String,
        required: true
      },
      postalCode: String
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  logo: {
    type: String
  },
  images: [String],
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  socialMedia: {
    instagram: String,
    linkedin: String,
    twitter: String,
    facebook: String
  },
  tags: [String],
  // Engagement metrics
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

module.exports = mongoose.model('Directory', directorySchema);

