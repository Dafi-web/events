const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const News = require('../models/News');

const router = express.Router();

// @route   GET /api/news
// @desc    Get all published news with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, featured, search } = req.query;
    const filter = { published: true };

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
        { excerpt: new RegExp(search, 'i') }
      ];
    }

    const news = await News.find(filter)
      .populate('author', 'name email')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await News.countDocuments(filter);

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/news/:id
// @desc    Get news article by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const article = await News.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    // Increment view count if published
    if (article.published) {
      article.views += 1;
      await article.save();
    }

    res.json(article);
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/news
// @desc    Create new news article
// @access  Private
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').isIn(['community', 'youth', 'culture', 'development', 'news', 'story']).withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Only admins can publish directly
    const published = req.user.role === 'admin' ? (req.body.published || false) : false;

    const newsData = {
      ...req.body,
      author: req.user.id,
      published,
      excerpt: req.body.excerpt || req.body.content.substring(0, 200) + '...'
    };

    const news = new News(newsData);
    await news.save();

    await news.populate('author', 'name email');
    res.status(201).json(news);
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/news/:id
// @desc    Update news article
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    // Check if user is author or admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Only admins can change published status
    if (req.body.published !== undefined && req.user.role !== 'admin') {
      delete req.body.published;
    }

    const updatedArticle = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json(updatedArticle);
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete news article
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/news/:id/like
// @desc    Like/unlike news article
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    const likeIndex = article.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      // Unlike
      article.likes.splice(likeIndex, 1);
    } else {
      // Like
      article.likes.push(req.user.id);
    }

    await article.save();
    res.json({ likes: article.likes.length });
  } catch (error) {
    console.error('Like news error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/news/:id/view
// @desc    Track news view
// @access  Public
router.post('/:id/view', async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ msg: 'News article not found' });
    }

    // Increment view count
    article.views = (article.views || 0) + 1;
    await article.save();

    res.json({ views: article.views });
  } catch (error) {
    console.error('Track news view error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

