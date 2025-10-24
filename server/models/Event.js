const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    name: {
      type: String,
      required: true
    },
    address: String,
    city: String,
    country: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  image: {
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
  category: {
    type: String,
    enum: ['cultural', 'business', 'education', 'social', 'youth', 'religious'],
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rsvpDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['going', 'maybe', 'not going'],
      default: 'going'
    },
    paymentStatus: {
      type: String,
      enum: ['free', 'paid', 'pending', 'failed'],
      default: 'free'
    },
    paymentIntentId: String,
    paidAt: Date,
    ticketType: {
      type: String,
      enum: ['general', 'student', 'vip'],
      default: 'general'
    }
  }],
  maxAttendees: {
    type: Number,
    default: null
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingLink: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFree: {
    type: Boolean,
    default: true
  },
  pricing: {
    general: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'usd'
      }
    },
    student: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'usd'
      }
    },
    vip: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'usd'
      }
    }
  },
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

// Virtual field to check if event is active based on date
eventSchema.virtual('isEventActive').get(function() {
  if (!this.isActive) return false; // If manually set to inactive, return false
  
  const now = new Date();
  const eventDate = new Date(this.date);
  
  // Set time to end of day for the event date
  eventDate.setHours(23, 59, 59, 999);
  
  return eventDate >= now;
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to automatically set isActive based on date
eventSchema.pre('save', function(next) {
  if (this.isModified('date') || this.isNew) {
    const now = new Date();
    const eventDate = new Date(this.date);
    
    // Set time to end of day for the event date
    eventDate.setHours(23, 59, 59, 999);
    
    // Only auto-set to inactive if it's a new event or date was changed
    // Don't override manually set inactive status
    if (this.isNew || this.isModified('date')) {
      this.isActive = eventDate >= now;
    }
  }
  next();
});

// Static method to update all events' active status based on date
eventSchema.statics.updateActiveStatus = async function() {
  const now = new Date();
  
  // Set events to inactive if their date has passed
  await this.updateMany(
    { 
      date: { $lt: now },
      isActive: true 
    },
    { 
      $set: { isActive: false } 
    }
  );
  
  // Set events to active if their date is in the future and they were manually set to inactive
  await this.updateMany(
    { 
      date: { $gte: now },
      isActive: false 
    },
    { 
      $set: { isActive: true } 
    }
  );
};

module.exports = mongoose.model('Event', eventSchema);

