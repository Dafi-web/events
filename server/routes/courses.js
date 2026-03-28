const express = require('express');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');
const { uploadFields } = require('../middleware/cloudinary-upload');
const Course = require('../models/Course');

const router = express.Router();

const CATEGORIES = ['stem', 'languages', 'arts', 'business', 'technology', 'general'];

function parsePages(body) {
  if (!body.pages) return [];
  try {
    const raw = typeof body.pages === 'string' ? JSON.parse(body.pages) : body.pages;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((p) => p && String(p.title || '').trim() && String(p.body || '').trim())
      .map((p) => ({
        title: String(p.title).trim(),
        body: String(p.body)
      }));
  } catch {
    return [];
  }
}

function parseExistingMedia(body, key) {
  if (!body[key]) return null;
  try {
    const raw = typeof body[key] === 'string' ? JSON.parse(body[key]) : body[key];
    return Array.isArray(raw) ? raw : null;
  } catch {
    return null;
  }
}

// @route   GET /api/courses/admin/all
// @desc    All courses (admin)
// @access  Private Admin
router.get('/admin/all', auth, adminAuth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 });
    res.json({ courses, total: courses.length });
  } catch (error) {
    console.error('Admin list courses error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/courses
// @desc    Published courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;
    const { category, search } = req.query;
    const filter = { isPublished: true };

    if (category && CATEGORIES.includes(category)) filter.category = category;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { summary: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const courses = await Course.find(filter)
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Single course (unpublished visible to admin only)
// @access  Public (+ optional admin)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name email');
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    if (!course.isPublished) {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(404).json({ msg: 'Course not found' });
      }
    }
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/courses
// @desc    Create course
// @access  Admin
router.post(
  '/',
  auth,
  adminAuth,
  uploadFields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const validationErrors = [];
      if (!req.body.title || !req.body.title.trim()) {
        validationErrors.push({ field: 'title', message: 'Title is required' });
      }
      if (!req.body.description || !req.body.description.trim()) {
        validationErrors.push({ field: 'description', message: 'Description is required' });
      }
      if (req.body.category && !CATEGORIES.includes(req.body.category)) {
        validationErrors.push({ field: 'category', message: 'Invalid category' });
      }
      if (validationErrors.length) {
        return res.status(400).json({ errors: validationErrors });
      }

      const pages = parsePages(req.body);
      const images = [];
      const videos = [];

      if (req.files?.images) {
        req.files.images.forEach((imageFile, i) => {
          images.push({
            url: imageFile.path,
            filename: imageFile.filename,
            originalName: imageFile.originalname,
            caption: req.body[`imageCaption_${i}`] || ''
          });
        });
      }

      if (req.files?.videos) {
        req.files.videos.forEach((videoFile, i) => {
          if (!videoFile.path) {
            throw new Error(`Video upload failed: ${videoFile.originalname}`);
          }
          videos.push({
            url: videoFile.path,
            filename: videoFile.filename,
            originalName: videoFile.originalname,
            caption: req.body[`videoCaption_${i}`] || ''
          });
        });
      }

      const courseData = {
        title: req.body.title.trim(),
        summary: (req.body.summary || '').trim(),
        description: req.body.description,
        pages,
        category: CATEGORIES.includes(req.body.category) ? req.body.category : 'general',
        order: req.body.order !== undefined ? Number(req.body.order) || 0 : 0,
        isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
        images,
        videos,
        createdBy: req.user.id
      };

      if (images.length > 0) {
        courseData.coverImage = images[0].url;
      }

      const course = new Course(courseData);
      await course.save();
      await course.populate('createdBy', 'name email');
      res.status(201).json(course);
    } catch (error) {
      console.error('Create course error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          msg: 'Validation error',
          errors: Object.values(error.errors).map((err) => ({ field: err.path, message: err.message }))
        });
      }
      if (error.message && error.message.includes('Video upload failed')) {
        return res.status(400).json({ msg: error.message });
      }
      res.status(500).json({
        msg: 'Server error while creating course',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Admin
router.put(
  '/:id',
  auth,
  adminAuth,
  uploadFields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }

      const validationErrors = [];
      if (!req.body.title || !req.body.title.trim()) {
        validationErrors.push({ field: 'title', message: 'Title is required' });
      }
      if (!req.body.description || !req.body.description.trim()) {
        validationErrors.push({ field: 'description', message: 'Description is required' });
      }
      if (req.body.category && !CATEGORIES.includes(req.body.category)) {
        validationErrors.push({ field: 'category', message: 'Invalid category' });
      }
      if (validationErrors.length) {
        return res.status(400).json({ errors: validationErrors });
      }

      const pages = parsePages(req.body);
      const existingImages = parseExistingMedia(req.body, 'existingImages') || course.images || [];
      const existingVideos = parseExistingMedia(req.body, 'existingVideos') || course.videos || [];

      const newImages = [];
      const newVideos = [];

      if (req.files?.images) {
        req.files.images.forEach((imageFile, i) => {
          newImages.push({
            url: imageFile.path,
            filename: imageFile.filename,
            originalName: imageFile.originalname,
            caption: req.body[`imageCaption_${i}`] || ''
          });
        });
      }

      if (req.files?.videos) {
        req.files.videos.forEach((videoFile, i) => {
          if (!videoFile.path) {
            throw new Error(`Video upload failed: ${videoFile.originalname}`);
          }
          newVideos.push({
            url: videoFile.path,
            filename: videoFile.filename,
            originalName: videoFile.originalname,
            caption: req.body[`videoCaption_${i}`] || ''
          });
        });
      }

      const mergedImages = [...existingImages, ...newImages];
      const mergedVideos = [...existingVideos, ...newVideos];

      course.title = req.body.title.trim();
      course.summary = (req.body.summary || '').trim();
      course.description = req.body.description;
      course.pages = pages;
      course.category = CATEGORIES.includes(req.body.category) ? req.body.category : course.category;
      course.order = req.body.order !== undefined ? Number(req.body.order) || 0 : course.order;
      course.isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
      course.images = mergedImages;
      course.videos = mergedVideos;

      if (mergedImages.length > 0) {
        course.coverImage = mergedImages[0].url;
      } else {
        course.coverImage = undefined;
      }

      await course.save();
      await course.populate('createdBy', 'name email');
      res.json(course);
    } catch (error) {
      console.error('Update course error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          msg: 'Validation error',
          errors: Object.values(error.errors).map((err) => ({ field: err.path, message: err.message }))
        });
      }
      res.status(500).json({ msg: 'Server error while updating course' });
    }
  }
);

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/courses/:id/view
// @desc    Track view
// @access  Public
router.post('/:id/view', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.isPublished) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    course.views = (course.views || 0) + 1;
    await course.save();
    res.json({ views: course.views });
  } catch (error) {
    console.error('Track course view error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
