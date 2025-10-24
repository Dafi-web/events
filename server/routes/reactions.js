const express = require('express');
const { auth } = require('../middleware/auth');
const Event = require('../models/Event');
const News = require('../models/News');
const Directory = require('../models/Directory');

const router = express.Router();

// Helper function to toggle like/dislike on content
const toggleReaction = async (Model, contentId, userId, reactionType) => {
  const content = await Model.findById(contentId);
  if (!content) {
    throw new Error('Content not found');
  }

  const likeIndex = content.likes.indexOf(userId);
  const dislikeIndex = content.dislikes.indexOf(userId);

  if (reactionType === 'like') {
    if (likeIndex > -1) {
      // User already liked, remove like
      content.likes.splice(likeIndex, 1);
    } else {
      // Add like and remove dislike if exists
      content.likes.push(userId);
      if (dislikeIndex > -1) {
        content.dislikes.splice(dislikeIndex, 1);
      }
    }
  } else if (reactionType === 'dislike') {
    if (dislikeIndex > -1) {
      // User already disliked, remove dislike
      content.dislikes.splice(dislikeIndex, 1);
    } else {
      // Add dislike and remove like if exists
      content.dislikes.push(userId);
      if (likeIndex > -1) {
        content.likes.splice(likeIndex, 1);
      }
    }
  }

  await content.save();
  return {
    likes: content.likes.length,
    dislikes: content.dislikes.length,
    userReaction: likeIndex > -1 ? 'like' : (dislikeIndex > -1 ? 'dislike' : null)
  };
};

// @route   POST /api/reactions/events/:id/like
// @desc    Toggle like on an event
// @access  Private
router.post('/events/:id/like', auth, async (req, res) => {
  try {
    const result = await toggleReaction(Event, req.params.id, req.user.id, 'like');
    res.json(result);
  } catch (error) {
    console.error('Toggle event like error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/reactions/events/:id/dislike
// @desc    Toggle dislike on an event
// @access  Private
router.post('/events/:id/dislike', auth, async (req, res) => {
  try {
    const result = await toggleReaction(Event, req.params.id, req.user.id, 'dislike');
    res.json(result);
  } catch (error) {
    console.error('Toggle event dislike error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/reactions/news/:id/like
// @desc    Toggle like on a news article
// @access  Private
router.post('/news/:id/like', auth, async (req, res) => {
  try {
    const result = await toggleReaction(News, req.params.id, req.user.id, 'like');
    res.json(result);
  } catch (error) {
    console.error('Toggle news like error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/reactions/news/:id/dislike
// @desc    Toggle dislike on a news article
// @access  Private
router.post('/news/:id/dislike', auth, async (req, res) => {
  try {
    const result = await toggleReaction(News, req.params.id, req.user.id, 'dislike');
    res.json(result);
  } catch (error) {
    console.error('Toggle news dislike error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/reactions/directory/:id/like
// @desc    Toggle like on a directory listing
// @access  Private
router.post('/directory/:id/like', auth, async (req, res) => {
  try {
    const result = await toggleReaction(Directory, req.params.id, req.user.id, 'like');
    res.json(result);
  } catch (error) {
    console.error('Toggle directory like error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/reactions/directory/:id/dislike
// @desc    Toggle dislike on a directory listing
// @access  Private
router.post('/directory/:id/dislike', auth, async (req, res) => {
  try {
    const result = await toggleReaction(Directory, req.params.id, req.user.id, 'dislike');
    res.json(result);
  } catch (error) {
    console.error('Toggle directory dislike error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/reactions/events/:id
// @desc    Get reaction counts for an event
// @access  Public
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select('likes dislikes');
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json({
      likes: event.likes.length,
      dislikes: event.dislikes.length
    });
  } catch (error) {
    console.error('Get event reactions error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/reactions/news/:id
// @desc    Get reaction counts for a news article
// @access  Public
router.get('/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id).select('likes dislikes');
    if (!news) {
      return res.status(404).json({ msg: 'News article not found' });
    }

    res.json({
      likes: news.likes.length,
      dislikes: news.dislikes.length
    });
  } catch (error) {
    console.error('Get news reactions error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/reactions/directory/:id
// @desc    Get reaction counts for a directory listing
// @access  Public
router.get('/directory/:id', async (req, res) => {
  try {
    const directory = await Directory.findById(req.params.id).select('likes dislikes');
    if (!directory) {
      return res.status(404).json({ msg: 'Directory listing not found' });
    }

    res.json({
      likes: directory.likes.length,
      dislikes: directory.dislikes.length
    });
  } catch (error) {
    console.error('Get directory reactions error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

