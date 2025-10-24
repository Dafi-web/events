const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const Directory = require('../models/Directory');
const { upload } = require('../middleware/cloudinary-upload');

const router = express.Router();

// @route   GET /api/directory
// @desc    Get all approved directory listings
// @access  Private (Members only)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const { type, category, country, search, featured } = req.query;
    const filter = { status: 'approved' };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (country) filter['contact.address.country'] = new RegExp(country, 'i');
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const listings = await Directory.find(filter)
      .populate('owner', 'name email')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Directory.countDocuments(filter);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get directory error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/directory/admin/pending
// @desc    Get pending directory listings (Admin only)
// @access  Private (Admin)
router.get('/admin/pending', auth, adminAuth, async (req, res) => {
  try {
    const listings = await Directory.find({ status: 'pending' })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error('Get pending listings error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/directory/admin/all
// @desc    Get all directory listings (Admin only)
// @access  Private (Admin)
router.get('/admin/all', auth, adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const listings = await Directory.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Directory.countDocuments(filter);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get all listings error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/directory/:id
// @desc    Get directory listing by ID
// @access  Private (Members only)
router.get('/:id', auth, async (req, res) => {
  try {
    const listing = await Directory.findById(req.params.id)
      .populate('owner', 'name email');

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Get directory listing error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/directory
// @desc    Create new directory listing
// @access  Private
router.post('/', auth, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['business', 'professional', 'organization']).withMessage('Valid type is required'),
  body('category').isIn(['restaurant', 'retail', 'services', 'healthcare', 'education', 'technology', 'finance', 'non-profit', 'other']).withMessage('Valid category is required'),
  body('contact.email').optional().isEmail().withMessage('Valid email is required'),
  body('contact.address.country').trim().notEmpty().withMessage('Country is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Directory submission files:', req.files);

    const listingData = {
      ...req.body,
      owner: req.user.id,
      status: 'pending' // New listings need approval
    };

    // Handle logo upload
    if (req.files && req.files.logo) {
      listingData.logo = req.files.logo[0].path;
      console.log('Logo uploaded:', listingData.logo);
    }

    // Handle images upload
    if (req.files && req.files.images) {
      listingData.images = req.files.images.map(file => file.path);
      console.log('Images uploaded:', listingData.images);
    }

    const listing = new Directory(listingData);
    await listing.save();

    await listing.populate('owner', 'name email');
    res.status(201).json(listing);
  } catch (error) {
    console.error('Create directory listing error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/directory/:id
// @desc    Update directory listing
// @access  Private
router.put('/:id', auth, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), async (req, res) => {
  try {
    const listing = await Directory.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    // Check if user is owner or admin
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const updateData = { ...req.body };

    // Handle logo upload
    if (req.files && req.files.logo) {
      updateData.logo = req.files.logo[0].path;
      console.log('Logo updated:', updateData.logo);
    }

    // Handle images upload
    if (req.files && req.files.images) {
      updateData.images = req.files.images.map(file => file.path);
      console.log('Images updated:', updateData.images);
    }

    // Only admins can change approval status
    if (updateData.status && req.user.role !== 'admin') {
      delete updateData.status;
    }

    const updatedListing = await Directory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.json(updatedListing);
  } catch (error) {
    console.error('Update directory listing error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/directory/admin/:id/approve
// @desc    Approve directory listing (Admin only)
// @access  Private (Admin)
router.put('/admin/:id/approve', auth, adminAuth, async (req, res) => {
  try {
    const listing = await Directory.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        verified: req.body.verified || false,
        featured: req.body.featured || false
      },
      { new: true }
    ).populate('owner', 'name email');

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Approve listing error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/directory/admin/:id/reject
// @desc    Reject directory listing (Admin only)
// @access  Private (Admin)
router.put('/admin/:id/reject', auth, adminAuth, async (req, res) => {
  try {
    const listing = await Directory.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('owner', 'name email');

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Reject listing error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/directory/:id
// @desc    Delete directory listing
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Directory.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Directory.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete directory listing error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/directory/my-listings
// @desc    Get current user's directory listings
// @access  Private
router.get('/my-listings', auth, async (req, res) => {
  try {
    const listings = await Directory.find({ owner: req.user.id })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({ listings });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/directory/:id/view
// @desc    Track directory listing view
// @access  Public
router.post('/:id/view', async (req, res) => {
  try {
    const listing = await Directory.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ msg: 'Directory listing not found' });
    }

    // Increment view count
    listing.views = (listing.views || 0) + 1;
    await listing.save();

    res.json({ views: listing.views });
  } catch (error) {
    console.error('Track directory view error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;