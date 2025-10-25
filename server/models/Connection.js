const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Ensure unique connections
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Prevent self-connections
connectionSchema.pre('save', function(next) {
  if (this.requester.toString() === this.recipient.toString()) {
    return next(new Error('Cannot connect to yourself'));
  }
  next();
});

module.exports = mongoose.model('Connection', connectionSchema);

