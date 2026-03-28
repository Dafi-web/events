const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { sendMail } = require('../utils/sendMail');

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

// @route   POST /api/auth/forgot-password
// @desc    Request password reset email (JWT link)
// @access  Public
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail().withMessage('valid_email_required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg });
      }

      const { email } = req.body;
      const user = await User.findOne({ email });

      const genericMsg =
        'If an account exists for this email, you will receive password reset instructions shortly.';

      if (!user) {
        return res.json({ msg: genericMsg });
      }

      const resetToken = jwt.sign(
        { id: user._id.toString(), purpose: 'password-reset' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const base =
        process.env.FRONTEND_URL ||
        process.env.CLIENT_URL ||
        'http://localhost:3000';
      const resetUrl = `${base.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(resetToken)}`;

      const emailResult = await sendMail({
        to: user.email,
        subject: 'DafiTech Super Academy — Password reset',
        text: `Hello ${user.name},\n\nWe received a request to reset your password.\n\nOpen this link (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.\n\n— DafiTech Super Academy`,
        html: `<p>Hello ${escapeHtml(user.name)},</p>
<p>We received a request to reset your password.</p>
<p><a href="${resetUrl}">Reset your password</a> (link valid for 1 hour)</p>
<p>If you did not request this, you can ignore this email.</p>
<p>— DafiTech Super Academy</p>`
      });

      if (!emailResult.sent && process.env.NODE_ENV === 'development') {
        console.log('[forgot-password] Dev — reset URL:', resetUrl);
      }

      return res.json({ msg: genericMsg });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ msg: 'server_error' });
    }
  }
);

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// @route   POST /api/auth/reset-password
// @desc    Set new password with token from email
// @access  Public
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('token_required'),
    body('password').isLength({ min: 6 }).withMessage('password_min_6')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg });
      }

      const { token, password } = req.body;
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        return res.status(400).json({ msg: 'invalid_or_expired_token' });
      }

      if (decoded.purpose !== 'password-reset' || !decoded.id) {
        return res.status(400).json({ msg: 'invalid_or_expired_token' });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ msg: 'invalid_or_expired_token' });
      }

      user.password = password;
      await user.save();

      res.json({ msg: 'password_reset_success' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ msg: 'server_error' });
    }
  }
);

// @route   PUT /api/auth/change-password
// @desc    Change password while logged in (all roles including admin)
// @access  Private
router.put(
  '/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('current_password_required'),
    body('newPassword').isLength({ min: 6 }).withMessage('password_min_6')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'user_not_found' });
      }

      const match = await user.comparePassword(currentPassword);
      if (!match) {
        return res.status(400).json({ msg: 'invalid_current_password' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ msg: 'password_updated' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ msg: 'server_error' });
    }
  }
);

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

