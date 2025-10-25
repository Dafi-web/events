const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Event tracking
  event: {
    type: String,
    required: true,
    enum: [
      'page_view', 'user_register', 'user_login', 'event_rsvp', 
      'directory_view', 'directory_submit', 'tutorial_enroll',
      'contact_form', 'search_performed', 'profile_view'
    ]
  },
  // User information (if available)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Session information
  sessionId: String,
  // Page/Resource information
  page: String,
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'resourceModel'
  },
  resourceModel: {
    type: String,
    enum: ['Event', 'Directory', 'News', 'User']
  },
  // Geographic information
  location: {
    country: String,
    city: String,
    timezone: String
  },
  // Device information
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet']
  },
  browser: String,
  os: String,
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  // IP address for basic analytics
  ipAddress: String,
  // User agent
  userAgent: String
}, {
  timestamps: true
});

// Indexes for efficient querying
analyticsSchema.index({ event: 1, createdAt: -1 });
analyticsSchema.index({ user: 1, createdAt: -1 });
analyticsSchema.index({ page: 1, createdAt: -1 });
analyticsSchema.index({ 'location.country': 1, createdAt: -1 });

// Static method to track events
analyticsSchema.statics.track = async function(eventData) {
  try {
    const analytics = new this(eventData);
    await analytics.save();
    return analytics;
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't throw error to prevent breaking the main flow
  }
};

// Static method to get analytics summary
analyticsSchema.statics.getSummary = async function(startDate, endDate) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: '$event',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' }
      }
    },
    {
      $project: {
        event: '$_id',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' }
      }
    },
    { $sort: { count: -1 } }
  ];

  return this.aggregate(pipeline);
};

// Static method to get user activity
analyticsSchema.statics.getUserActivity = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.find({
    user: userId,
    createdAt: { $gte: startDate }
  }).sort({ createdAt: -1 });
};

// Static method to get page views
analyticsSchema.statics.getPageViews = async function(startDate, endDate) {
  const matchStage = { event: 'page_view' };
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: '$page',
        views: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' }
      }
    },
    {
      $project: {
        page: '$_id',
        views: 1,
        uniqueUsers: { $size: '$uniqueUsers' }
      }
    },
    { $sort: { views: -1 } }
  ];

  return this.aggregate(pipeline);
};

module.exports = mongoose.model('Analytics', analyticsSchema);

