const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 5000 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  contentType: { 
    type: String, 
    enum: ['event', 'news', 'directory'], 
    required: true 
  },
  contentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  parentComment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment', 
    default: null 
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  },
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
  const existingFlag = this.flags && this.flags.find(flag => flag.user.toString() === userId.toString());
  if (!existingFlag) {
    if (!this.flags) this.flags = [];
    this.flags.push({ user: userId, reason, createdAt: new Date() });
    return this.save();
  }
  return Promise.resolve(this);
};

// Pre-save middleware to update reply count
commentSchema.pre('save', async function(next) {
  if (this.isNew && this.parentComment) {
    try {
      // Increment parent comment's reply count
      await this.constructor.findByIdAndUpdate(
        this.parentComment,
        { $inc: { replyCount: 1 } }
      ).exec();
    } catch (error) {
      console.error('Error updating reply count:', error);
    }
  }
  next();
});

module.exports = mongoose.model('CommentFixed', commentSchema);

