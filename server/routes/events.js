const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const { uploadFields } = require('../middleware/cloudinary-upload');
const Event = require('../models/Event');

const router = express.Router();

// Test route for debugging video uploads
router.post('/test-video-upload', uploadFields([
  { name: 'videos', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('=== VIDEO UPLOAD TEST ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    if (req.files && req.files.videos) {
      const video = req.files.videos[0];
      console.log('Video file details:', {
        fieldname: video.fieldname,
        originalname: video.originalname,
        encoding: video.encoding,
        mimetype: video.mimetype,
        size: video.size,
        path: video.path,
        filename: video.filename
      });
      
      res.json({
        success: true,
        message: 'Video upload test successful',
        video: {
          originalName: video.originalname,
          size: video.size,
          path: video.path,
          filename: video.filename
        }
      });
    } else {
      res.json({
        success: false,
        message: 'No video file received',
        files: req.files
      });
    }
  } catch (error) {
    console.error('Video upload test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/events
// @desc    Get all events with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, country, upcoming, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (country) filter['location.country'] = new RegExp(country, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    if (upcoming === 'true') {
      // Set to start of today to include events happening today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.date = { $gte: today };
    }
    
    // Always filter by active events unless specifically requested otherwise
    if (req.query.includeInactive !== 'true') {
      filter.isActive = true;
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .populate('attendees.user', 'name email')
      .sort({ date: 1 })
      .limit(limit)
      .skip(skip);

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('attendees.user', 'name email');
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private
router.post('/', auth, uploadFields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), async (req, res) => {
  try {
    // Manual validation
    const validationErrors = [];
    
    if (!req.body.title || req.body.title.trim() === '') {
      validationErrors.push({ field: 'title', message: 'Title is required' });
    }
    if (!req.body.description || req.body.description.trim() === '') {
      validationErrors.push({ field: 'description', message: 'Description is required' });
    }
    if (!req.body.date) {
      validationErrors.push({ field: 'date', message: 'Valid date is required' });
    }
    if (!req.body.time || req.body.time.trim() === '') {
      validationErrors.push({ field: 'time', message: 'Time is required' });
    }
    if (!req.body.category || !['cultural', 'business', 'education', 'social', 'youth', 'religious'].includes(req.body.category)) {
      validationErrors.push({ field: 'category', message: 'Valid category is required' });
    }

    // Handle location validation - can be either string (JSON) or object
    let location;
    try {
      location = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;
      if (!location || !location.name || location.name.trim() === '') {
        validationErrors.push({ field: 'location.name', message: 'Location name is required' });
      }
      if (!location || !location.country || location.country.trim() === '') {
        validationErrors.push({ field: 'location.country', message: 'Country is required' });
      }
    } catch (error) {
      validationErrors.push({ field: 'location', message: 'Invalid location format' });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Parse pricing if it's a string
    let pricing = req.body.pricing;
    if (typeof pricing === 'string') {
      try {
        pricing = JSON.parse(pricing);
      } catch (error) {
        pricing = {
          general: { amount: 0, currency: 'usd' },
          student: { amount: 0, currency: 'usd' },
          vip: { amount: 0, currency: 'usd' }
        };
      }
    }

    let eventData = {
      ...req.body,
      organizer: req.user.id,
      location: location,
      isFree: req.body.isFree === 'true' || req.body.isFree === true,
      pricing: pricing
    };

    console.log('Event creation request:', {
      body: req.body,
      location: location,
      files: req.files ? Object.keys(req.files) : 'no files',
      fileCount: req.files ? Object.values(req.files).flat().length : 0
    });

    // Handle uploaded files
    if (req.files) {
      const images = [];
      const videos = [];

      // Process images with Cloudinary
      if (req.files.images) {
        for (let i = 0; i < req.files.images.length; i++) {
          const imageFile = req.files.images[i];
          images.push({
            url: imageFile.path,
            filename: imageFile.filename,
            originalName: imageFile.originalname,
            caption: req.body[`imageCaption_${i}`] || ''
          });
        }
      }

      // Process videos with Cloudinary
      if (req.files.videos) {
        console.log(`Processing ${req.files.videos.length} video files...`);
        for (let i = 0; i < req.files.videos.length; i++) {
          const videoFile = req.files.videos[i];
          console.log(`Processing video ${i + 1}: ${videoFile.originalname} (${videoFile.size} bytes)`);
          
          // Check if video upload was successful
          if (!videoFile.path) {
            console.error(`Video upload failed for: ${videoFile.originalname}`);
            throw new Error(`Video upload failed: ${videoFile.originalname}`);
          }
          
          videos.push({
            url: videoFile.path,
            filename: videoFile.filename,
            originalName: videoFile.originalname,
            caption: req.body[`videoCaption_${i}`] || ''
          });
        }
        console.log(`Successfully processed ${videos.length} videos`);
      }

      eventData.images = images;
      eventData.videos = videos;
      
      // Set main image to first uploaded image if not specified
      if (images.length > 0 && !eventData.image) {
        eventData.image = images[0].url;
      }
    }

    // Location is already parsed in validation above

    const event = new Event(eventData);
    await event.save();

    await event.populate('organizer', 'name email');
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        msg: 'Validation error', 
        errors: Object.values(error.errors).map(err => ({ field: err.path, message: err.message }))
      });
    }
    
    if (error.code === 'ENOENT' || error.message.includes('cloudinary')) {
      return res.status(503).json({ 
        msg: 'File upload service is not configured. Please contact the administrator.',
        error: 'UPLOAD_SERVICE_NOT_CONFIGURED'
      });
    }
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ 
        msg: error.message,
        error: 'INVALID_FILE_TYPE'
      });
    }
    
    res.status(500).json({ 
      msg: 'Server error occurred while creating event',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private
router.put('/:id', auth, uploadFields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Manual validation
    const validationErrors = [];
    
    if (!req.body.title || req.body.title.trim() === '') {
      validationErrors.push({ field: 'title', message: 'Title is required' });
    }
    if (!req.body.description || req.body.description.trim() === '') {
      validationErrors.push({ field: 'description', message: 'Description is required' });
    }
    if (!req.body.date) {
      validationErrors.push({ field: 'date', message: 'Valid date is required' });
    }
    if (!req.body.time || req.body.time.trim() === '') {
      validationErrors.push({ field: 'time', message: 'Time is required' });
    }
    if (!req.body.category || !['cultural', 'business', 'education', 'social', 'youth', 'religious'].includes(req.body.category)) {
      validationErrors.push({ field: 'category', message: 'Valid category is required' });
    }

    // Handle location validation - can be either string (JSON) or object
    let location;
    try {
      location = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;
      if (!location || !location.name || location.name.trim() === '') {
        validationErrors.push({ field: 'location.name', message: 'Location name is required' });
      }
      if (!location || !location.country || location.country.trim() === '') {
        validationErrors.push({ field: 'location.country', message: 'Country is required' });
      }
    } catch (error) {
      validationErrors.push({ field: 'location', message: 'Invalid location format' });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Parse pricing if it's a string
    let pricing = req.body.pricing;
    if (typeof pricing === 'string') {
      try {
        pricing = JSON.parse(pricing);
      } catch (error) {
        pricing = event.pricing || {
          general: { amount: 0, currency: 'usd' },
          student: { amount: 0, currency: 'usd' },
          vip: { amount: 0, currency: 'usd' }
        };
      }
    }

    let updateData = {
      ...req.body,
      location: location,
      isFree: req.body.isFree === 'true' || req.body.isFree === true,
      pricing: pricing
    };

    // Handle uploaded files
    if (req.files) {
      const newImages = [];
      const newVideos = [];

      // Process new images with Cloudinary
      if (req.files.images) {
        for (let i = 0; i < req.files.images.length; i++) {
          const imageFile = req.files.images[i];
          newImages.push({
            url: imageFile.path,
            filename: imageFile.filename,
            originalName: imageFile.originalname,
            caption: req.body[`imageCaption_${i}`] || ''
          });
        }
      }

      // Process new videos with Cloudinary
      if (req.files.videos) {
        console.log(`Processing ${req.files.videos.length} new video files...`);
        for (let i = 0; i < req.files.videos.length; i++) {
          const videoFile = req.files.videos[i];
          console.log(`Processing video ${i + 1}: ${videoFile.originalname} (${videoFile.size} bytes)`);
          
          // Check if video upload was successful
          if (!videoFile.path) {
            console.error(`Video upload failed for: ${videoFile.originalname}`);
            throw new Error(`Video upload failed: ${videoFile.originalname}`);
          }
          
          newVideos.push({
            url: videoFile.path,
            filename: videoFile.filename,
            originalName: videoFile.originalname,
            caption: req.body[`videoCaption_${i}`] || ''
          });
        }
        console.log(`Successfully processed ${newVideos.length} new videos`);
      }

      // Merge with existing images and videos
      const existingImages = event.images || [];
      const existingVideos = event.videos || [];
      
      updateData.images = [...existingImages, ...newImages];
      updateData.videos = [...existingVideos, ...newVideos];
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        msg: 'Validation error', 
        errors: Object.values(error.errors).map(err => ({ field: err.path, message: err.message }))
      });
    }
    
    if (error.code === 'ENOENT' || error.message.includes('cloudinary')) {
      return res.status(503).json({ 
        msg: 'File upload service is not configured. Please contact the administrator.',
        error: 'UPLOAD_SERVICE_NOT_CONFIGURED'
      });
    }
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ 
        msg: error.message,
        error: 'INVALID_FILE_TYPE'
      });
    }
    
    res.status(500).json({ 
      msg: 'Server error occurred while updating event',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/events/:id/rsvp
// @desc    RSVP to event
// @access  Private
router.post('/:id/rsvp', auth, [
  body('status').isIn(['going', 'maybe', 'not going']).withMessage('Valid RSVP status required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if event is still active (not past date)
    const now = new Date();
    const eventDate = new Date(event.date);
    eventDate.setHours(23, 59, 59, 999); // End of event day
    
    if (!event.isActive || eventDate < now) {
      return res.status(400).json({ 
        msg: 'Cannot RSVP to this event. The event date has passed or the event is no longer active.' 
      });
    }

    // Remove existing RSVP if exists
    event.attendees = event.attendees.filter(
      attendee => attendee.user.toString() !== req.user.id
    );

    // Add new RSVP
    event.attendees.push({
      user: req.user.id,
      status: req.body.status
    });

    await event.save();
    await event.populate('attendees.user', 'name email');

    res.json(event);
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/events/:id/view
// @desc    Track event view
// @access  Public
router.post('/:id/view', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Increment view count
    event.views = (event.views || 0) + 1;
    await event.save();

    res.json({ views: event.views });
  } catch (error) {
    console.error('Track event view error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/events/update-active-status
// @desc    Update all events' active status based on date (admin only)
// @access  Private (Admin)
router.post('/update-active-status', adminAuth, async (req, res) => {
  try {
    await Event.updateActiveStatus();
    res.json({ msg: 'Event active status updated successfully' });
  } catch (error) {
    console.error('Update active status error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

