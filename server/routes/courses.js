const express = require('express');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');
const { uploadFields } = require('../middleware/cloudinary-upload');
const Course = require('../models/Course');

const router = express.Router();

const CATEGORIES = ['stem', 'languages', 'arts', 'business', 'technology', 'general'];

const PRACTICE_LANGS = new Set(['html', 'css', 'javascript', 'mixed']);

function normalizePractice(pr) {
  if (!pr || typeof pr !== 'object') return null;
  const title = String(pr.title || '').trim();
  if (!title) return null;
  const lang = PRACTICE_LANGS.has(pr.language) ? pr.language : 'html';
  return {
    title,
    instructions: String(pr.instructions || ''),
    starterCode: String(pr.starterCode || ''),
    solution: String(pr.solution || ''),
    language: lang
  };
}

const SLIDE_VARIANTS = new Set(['intro', 'content', 'practice', 'summary']);
const SLIDE_THEMES = new Set(['indigo', 'emerald', 'amber', 'rose', 'slate', 'violet']);
const SLIDE_MEDIA_KINDS = new Set(['', 'gif', 'image', 'video']);

function inferMediaKind(url, hint) {
  const h = String(hint || '').toLowerCase();
  if (SLIDE_MEDIA_KINDS.has(h) && h) return h;
  const u = String(url || '');
  if (/\.gif(\?|#|$)/i.test(u)) return 'gif';
  if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(u)) return 'video';
  if (/\.(png|jpe?g|webp|svg|avif)(\?|#|$)/i.test(u)) return 'image';
  return '';
}

function normalizeSlide(s) {
  if (!s || typeof s !== 'object') return null;
  const title = String(s.title || '').trim();
  if (!title) return null;
  const variant = SLIDE_VARIANTS.has(s.variant) ? s.variant : 'content';
  const theme = SLIDE_THEMES.has(s.theme) ? s.theme : 'indigo';
  const body = String(s.body || '');
  const practice = s.practice ? normalizePractice(s.practice) : null;
  const narrationUrl = String(s.narrationUrl || '').trim();
  const mediaUrl = String(s.mediaUrl || '').trim();
  let mediaKind = inferMediaKind(mediaUrl, s.mediaKind);
  if (mediaUrl && !mediaKind) mediaKind = 'image';

  const out = { title, body, variant, theme };
  if (practice) out.practice = practice;
  if (narrationUrl) out.narrationUrl = narrationUrl;
  if (mediaUrl) {
    out.mediaUrl = mediaUrl;
    out.mediaKind = mediaKind;
  }
  return out;
}

function normalizeAssessment(a) {
  if (!a || typeof a !== 'object') return undefined;
  const rawQ = Array.isArray(a.questions) ? a.questions : [];
  const questions = rawQ
    .map((q) => ({
      question: String(q.question || '').trim(),
      options: Array.isArray(q.options) ? q.options.map((o) => String(o)) : [],
      correctIndex: Math.max(0, parseInt(q.correctIndex, 10) || 0)
    }))
    .filter((q) => q.question && q.options.length >= 2);
  if (!questions.length) return undefined;
  const passingScore = Math.min(100, Math.max(0, Number(a.passingScore) || 70));
  return {
    title: String(a.title || 'Quick check').trim() || 'Quick check',
    passingScore,
    questions
  };
}

function parseTipsFromBody(body) {
  if (!body.courseTips) return [];
  try {
    const raw =
      typeof body.courseTips === 'string' ? JSON.parse(body.courseTips) : body.courseTips;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((t) => t && String(t.title || '').trim())
      .map((t) => ({
        title: String(t.title).trim(),
        body: String(t.body || '')
      }));
  } catch {
    return [];
  }
}

/** @returns {object|null|undefined} project, null to clear, undefined if absent or invalid JSON */
function parseCourseExplainerFromBody(body) {
  if (!body.courseExplainer) return undefined;
  try {
    const raw =
      typeof body.courseExplainer === 'string'
        ? JSON.parse(body.courseExplainer)
        : body.courseExplainer;
    if (!raw || typeof raw !== 'object') return null;
    const title = String(raw.title || 'Course introduction').trim() || 'Course introduction';
    const videoUrl = String(raw.videoUrl || '').trim();
    const audioUrl = String(raw.audioUrl || '').trim();
    const visualUrl = String(raw.visualUrl || '').trim();
    let visualKind = inferMediaKind(visualUrl, raw.visualKind);
    if (visualUrl && !visualKind) visualKind = 'image';
    const caption = String(raw.caption || '');
    if (!videoUrl && !audioUrl && !visualUrl) return null;
    return {
      title,
      videoUrl,
      audioUrl,
      visualUrl,
      visualKind: SLIDE_MEDIA_KINDS.has(visualKind) ? visualKind : '',
      caption
    };
  } catch {
    return undefined;
  }
}

function parseSampleProjectFromBody(body) {
  if (!body.sampleProject) return undefined;
  try {
    const raw =
      typeof body.sampleProject === 'string'
        ? JSON.parse(body.sampleProject)
        : body.sampleProject;
    if (!raw || typeof raw !== 'object') return null;
    const title = String(raw.title || '').trim();
    if (!title) return null;
    return {
      title,
      description: String(raw.description || ''),
      repoUrl: String(raw.repoUrl || '').trim(),
      codeSample: String(raw.codeSample || '')
    };
  } catch {
    return undefined;
  }
}

function parsePages(body) {
  if (!body.pages) return [];
  try {
    const raw = typeof body.pages === 'string' ? JSON.parse(body.pages) : body.pages;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((p) => p && String(p.title || '').trim() && String(p.body || '').trim())
      .map((p) => {
        const practices = Array.isArray(p.practices)
          ? p.practices.map(normalizePractice).filter(Boolean)
          : [];
        const slides = Array.isArray(p.slides)
          ? p.slides.map(normalizeSlide).filter(Boolean)
          : [];
        const assessment = normalizeAssessment(p.assessment);
        const pageOut = {
          title: String(p.title).trim(),
          body: String(p.body),
          practices,
          slides,
          deepDive: String(p.deepDive || ''),
          lessonTips: Array.isArray(p.lessonTips)
            ? p.lessonTips.map(String).filter(Boolean)
            : [],
          videoUrl: String(p.videoUrl || '').trim(),
          videoCaption: String(p.videoCaption || '').trim()
        };
        if (assessment) pageOut.assessment = assessment;
        return pageOut;
      });
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

      const tips = parseTipsFromBody(req.body);
      const sampleProject = parseSampleProjectFromBody(req.body);
      const courseExplainer = parseCourseExplainerFromBody(req.body);

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
      if (tips.length) courseData.tips = tips;
      if (sampleProject) courseData.sampleProject = sampleProject;
      if (courseExplainer) courseData.courseExplainer = courseExplainer;

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

      const tips = parseTipsFromBody(req.body);
      const sampleProject = parseSampleProjectFromBody(req.body);
      const courseExplainer = parseCourseExplainerFromBody(req.body);

      course.title = req.body.title.trim();
      course.summary = (req.body.summary || '').trim();
      course.description = req.body.description;
      course.pages = pages;
      course.category = CATEGORIES.includes(req.body.category) ? req.body.category : course.category;
      course.order = req.body.order !== undefined ? Number(req.body.order) || 0 : course.order;
      course.isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
      course.images = mergedImages;
      course.videos = mergedVideos;
      course.tips = tips;
      if (Object.prototype.hasOwnProperty.call(req.body, 'sampleProject')) {
        if (sampleProject === null) {
          course.set('sampleProject', undefined);
        } else if (sampleProject) {
          course.sampleProject = sampleProject;
        }
      }
      if (Object.prototype.hasOwnProperty.call(req.body, 'courseExplainer')) {
        if (courseExplainer === null) {
          course.set('courseExplainer', undefined);
        } else if (courseExplainer) {
          course.courseExplainer = courseExplainer;
        }
      }

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
