const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('profession').trim().notEmpty().withMessage('Profession is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, country, profession, bio, interests } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      country,
      profession,
      bio,
      interests
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        profession: user.profession,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
        interests: user.interests
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        msg: 'User already exists with this email',
        field: 'email'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        msg: 'Validation error',
        errors: errors
      });
    }
    
    // Handle MongoDB timeout/connection errors
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        msg: 'Database connection timeout. Please try again.',
        error: 'Database timeout'
      });
    }
    
    res.status(500).json({ 
      msg: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        profession: user.profession,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
        interests: user.interests
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        msg: 'Database connection timeout. Please try again.',
        error: 'Database timeout'
      });
    }
    
    res.status(500).json({ 
      msg: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

