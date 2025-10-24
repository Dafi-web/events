const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Comment = require('../models/CommentFixed');
const Event = require('../models/Event');
const News = require('../models/News');
const Directory = require('../models/Directory');

const router = express.Router();

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', auth, [
  body('content').trim().notEmpty().withMessage('Comment content is required').isLength({ max: 5000 }).withMessage('Comment too long'),
  body('contentType').isIn(['event', 'news', 'directory']).withMessage('Invalid content type'),
  body('contentId').isMongoId().withMessage('Invalid content ID'),
  body('parentComment').optional().isMongoId().withMessage('Invalid parent comment ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, contentType, contentId, parentComment } = req.body;

    // If this is a reply, limit to 100 characters
    if (parentComment && content.length > 100) {
      return res.status(400).json({ 
        errors: [{ 
          field: 'content', 
          message: 'Reply must be 100 characters or less' 
        }] 
      });
    }

    // Verify the content exists
    let contentModel;
    switch (contentType) {
      case 'event':
        contentModel = Event;
        break;
      case 'news':
        contentModel = News;
        break;
      case 'directory':
        contentModel = Directory;
        break;
      default:
        return res.status(400).json({ msg: 'Invalid content type' });
    }

    const contentExists = await contentModel.findById(contentId);
    if (!contentExists) {
      return res.status(404).json({ msg: 'Content not found' });
    }

    // If replying to a comment, verify parent exists
    if (parentComment) {
      const parentExists = await Comment.findById(parentComment);
      if (!parentExists) {
        return res.status(404).json({ msg: 'Parent comment not found' });
      }
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      contentType,
      contentId,
      parentComment: parentComment || null
    });

    await comment.save();
    await comment.populate('author', 'name email');

    // Update comment count on the content
    await contentModel.findByIdAndUpdate(contentId, { $inc: { commentCount: 1 } });

    // If this is a reply, update the parent comment's reply count
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, { $inc: { replyCount: 1 } });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/comments/replies/:id
// @desc    Get replies for a specific comment
// @access  Public
router.get('/replies/:id', async (req, res) => {
  try {
    console.log('=== REPLIES ROUTE HIT ===');
    console.log('Request params:', req.params);
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    
    const commentId = req.params.id;
    console.log('Looking for replies to comment ID:', commentId);
    
    // Validate that the ID is a valid MongoDB ObjectId
    if (!commentId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid comment ID format:', commentId);
      return res.status(400).json({ msg: 'Invalid comment ID format' });
    }
    
    const replies = await Comment.find({
      parentComment: commentId,
      status: 'active'
    })
    .populate('author', 'name email')
    .sort({ createdAt: 1 });

    console.log('Found replies:', replies.length);
    res.json({ replies });
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/comments/:contentType/:contentId
// @desc    Get comments for specific content
// @access  Public
router.get('/:contentType/:contentId', async (req, res) => {
  try {
    console.log('=== GENERAL COMMENTS ROUTE HIT ===');
    console.log('Getting comments for:', req.params);
    const { contentType, contentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate content type
    if (!['event', 'news', 'directory'].includes(contentType)) {
      return res.status(400).json({ msg: 'Invalid content type' });
    }

    const comments = await Comment.find({
      contentType,
      contentId,
      parentComment: null, // Only top-level comments
      status: 'active'
    })
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Comment.countDocuments({
      contentType,
      contentId,
      parentComment: null,
      status: 'active'
    });

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get comments error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private
router.put('/:id', auth, [
  body('content').trim().notEmpty().withMessage('Comment content is required').isLength({ max: 5000 }).withMessage('Comment too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    comment.content = req.body.content;
    await comment.save();
    await comment.populate('author', 'name email');

    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Soft delete - mark as deleted
    comment.status = 'deleted';
    await comment.save();

    // Update comment count on the content
    let contentModel;
    switch (comment.contentType) {
      case 'event':
        contentModel = Event;
        break;
      case 'news':
        contentModel = News;
        break;
      case 'directory':
        contentModel = Directory;
        break;
    }
    await contentModel.findByIdAndUpdate(comment.contentId, { $inc: { commentCount: -1 } });

    res.json({ msg: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/comments/:id/like
// @desc    Toggle like on a comment
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await comment.toggleLike(req.user.id);
    await comment.populate('author', 'name email');

    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      userReaction: comment.getUserReaction(req.user.id)
    });
  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/comments/:id/dislike
// @desc    Toggle dislike on a comment
// @access  Private
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await comment.toggleDislike(req.user.id);
    await comment.populate('author', 'name email');

    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      userReaction: comment.getUserReaction(req.user.id)
    });
  } catch (error) {
    console.error('Toggle comment dislike error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/comments/:id/flag
// @desc    Flag a comment for moderation
// @access  Private
router.post('/:id/flag', auth, [
  body('reason').trim().notEmpty().withMessage('Flag reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await comment.addFlag(req.user.id, req.body.reason);

    res.json({ msg: 'Comment flagged successfully' });
  } catch (error) {
    console.error('Flag comment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
