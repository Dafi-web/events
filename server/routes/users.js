const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search, country, profession, role } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { profession: new RegExp(search, 'i') }
      ];
    }
    if (country) filter.country = new RegExp(country, 'i');
    if (profession) filter.profession = new RegExp(profession, 'i');
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('Profile update request:', req.body);
    console.log('User ID:', req.user.id);

    const allowedUpdates = [
      'name', 'phone', 'country', 'profession', 'bio', 'company', 
      'jobTitle', 'experience', 'education', 'languages', 'skills', 
      'interests', 'socialLinks', 'newsletter', 'notifications', 
      'profileVisibility'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    console.log('Updates to apply:', updates);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('Profile updated successfully:', user.name);
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user profile is public or if requesting user is admin
    if (user.profileVisibility === 'private' && req.user.id !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Profile is private' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'email', 'phone', 'country', 'profession', 'bio', 
      'company', 'jobTitle', 'experience', 'education', 'languages', 
      'skills', 'interests', 'socialLinks', 'role', 'isVerified', 
      'newsletter', 'notifications', 'profileVisibility'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/users/:id/verify
// @desc    Verify user (Admin only)
// @access  Private (Admin)
router.put('/:id/verify', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics (Admin only)
// @access  Private (Admin)
router.get('/stats/overview', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Users by country
    const usersByCountry = await User.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Users by profession
    const usersByProfession = await User.aggregate([
      { $group: { _id: '$profession', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      totalUsers,
      verifiedUsers,
      adminUsers,
      recentRegistrations,
      usersByCountry,
      usersByProfession
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;