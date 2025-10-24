const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 1000 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Reference to the content being commented on
  contentType: { 
    type: String, 
    enum: ['event', 'news', 'directory'], 
    required: true 
  },
  contentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  // Nested comments (replies)
  parentComment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',
    default: null 
  },
  // Comment reactions
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  dislikes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  // Comment status
  status: { 
    type: String, 
    enum: ['active', 'hidden', 'deleted'], 
    default: 'active' 
  },
  // Moderation
  isModerated: { 
    type: Boolean, 
    default: false 
  },
  moderatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  moderationReason: String,
  // Engagement metrics
  replyCount: { 
    type: Number, 
    default: 0 
  },
  // Flags for inappropriate content
  flags: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true 
});

// Indexes for better performance
commentSchema.index({ contentType: 1, contentId: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ status: 1 });

// Virtual for total reactions
commentSchema.virtual('totalReactions').get(function() {
  return this.likes.length - this.dislikes.length;
});

// Virtual for user's reaction (if any)
commentSchema.methods.getUserReaction = function(userId) {
  if (this.likes.includes(userId)) return 'like';
  if (this.dislikes.includes(userId)) return 'dislike';
  return null;
};

// Method to toggle like
commentSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  const dislikeIndex = this.dislikes.indexOf(userId);
  
  if (likeIndex > -1) {
    // User already liked, remove like
    this.likes.splice(likeIndex, 1);
  } else {
    // Add like and remove dislike if exists
    this.likes.push(userId);
    if (dislikeIndex > -1) {
      this.dislikes.splice(dislikeIndex, 1);
    }
  }
  
  return this.save();
};

// Method to toggle dislike
commentSchema.methods.toggleDislike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  const dislikeIndex = this.dislikes.indexOf(userId);
  
  if (dislikeIndex > -1) {
    // User already disliked, remove dislike
    this.dislikes.splice(dislikeIndex, 1);
  } else {
    // Add dislike and remove like if exists
    this.dislikes.push(userId);
    if (likeIndex > -1) {
      this.likes.splice(likeIndex, 1);
    }
  }
  
  return this.save();
};

// Method to add flag
commentSchema.methods.addFlag = function(userId, reason) {
  // Check if user already flagged
  const existingFlag = this.flags.find(flag => flag.user.toString() === userId.toString());
  if (!existingFlag) {
    this.flags.push({ user: userId, reason });
    return this.save();
  }
  return Promise.resolve(this);
};

// Pre-save middleware to update reply count - DISABLED FOR DEBUGGING
// commentSchema.pre('save', function(next) {
//   if (this.isNew && this.parentComment) {
//     // Increment parent comment's reply count
//     this.constructor.findByIdAndUpdate(
//       this.parentComment,
//       { $inc: { replyCount: 1 } }
//     ).exec();
//   }
//   next();
// });

module.exports = mongoose.model('Comment', commentSchema);
