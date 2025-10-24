const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Simple in-memory storage for contact messages (in production, use a database)
let contactMessages = [];

// Configure nodemailer for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'contact@dafitech.org',
      pass: process.env.EMAIL_PASS // You'll need to set this in .env
    }
  });
};

// @route   POST /api/contact
// @desc    Save contact form message
// @access  Public
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Create message object
    const contactMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    // Store message in memory (in production, save to database)
    contactMessages.push(contactMessage);

    // Log the message to console for admin visibility
    console.log('\n📧 NEW CONTACT MESSAGE:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Timestamp:', contactMessage.timestamp);
    console.log('---\n');

    // Try to send email if configured
    let emailSent = false;
    let emailError = null;
    try {
      if (process.env.EMAIL_PASS) {
        const transporter = createTransporter();
        
        const mailOptions = {
          from: process.env.EMAIL_USER || 'contact@dafitech.org',
          to: process.env.EMAIL_USER || 'contact@dafitech.org',
          replyTo: email,
          subject: `DafiTech Contact: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><em>Sent from DafiTech website contact form</em></p>
          `
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log('✅ Email sent successfully to contact@dafitech.org');
      } else {
        console.log('⚠️  Email not configured - message saved locally only');
        console.log('📧 To enable email notifications, set EMAIL_PASS in your .env file');
      }
    } catch (err) {
      emailError = err;
      console.error('❌ Email sending failed:', err.message);
      console.error('📧 Email error details:', {
        code: err.code,
        command: err.command,
        response: err.response,
        responseCode: err.responseCode
      });
      // Don't fail the request if email fails
    }

    res.json({ 
      msg: 'Message received successfully! We will get back to you soon.',
      emailSent: emailSent,
      emailConfigured: !!process.env.EMAIL_PASS,
      emailError: emailError ? {
        message: emailError.message,
        code: emailError.code
      } : null
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ msg: 'Failed to send message. Please try again.' });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private
router.get('/', (req, res, next) => {
  require('../middleware/auth')(req, res, next);
}, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json({ messages: contactMessages });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

