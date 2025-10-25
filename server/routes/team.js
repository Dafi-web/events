const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const TeamMember = require('../models/TeamMember');
const { upload } = require('../middleware/cloudinary-upload');

const router = express.Router();

// @route   GET /api/team
// @desc    Get all active team members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });

    res.json(teamMembers);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/team/instructors
// @desc    Get all instructors
// @access  Public
router.get('/instructors', async (req, res) => {
  try {
    const instructors = await TeamMember.find({ 
      isActive: true, 
      isInstructor: true 
    }).sort({ order: 1, createdAt: 1 });

    res.json(instructors);
  } catch (error) {
    console.error('Get instructors error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/team/:id
// @desc    Get team member by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/team
// @desc    Create new team member (Admin only)
// @access  Private (Admin)
router.post('/', auth, adminAuth, upload.single('profileImage'), async (req, res) => {
  try {
    const teamMemberData = {
      ...req.body,
      profileImage: req.file ? req.file.path : undefined
    };

    // Parse education array if it's a string
    if (typeof teamMemberData.education === 'string') {
      teamMemberData.education = JSON.parse(teamMemberData.education);
    }

    // Parse arrays if they're strings
    if (typeof teamMemberData.expertise === 'string') {
      teamMemberData.expertise = teamMemberData.expertise.split(',').map(item => item.trim());
    }
    if (typeof teamMemberData.languages === 'string') {
      teamMemberData.languages = teamMemberData.languages.split(',').map(item => item.trim());
    }

    const teamMember = new TeamMember(teamMemberData);
    await teamMember.save();

    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/team/:id
// @desc    Update team member (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, adminAuth, upload.single('profileImage'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    // Parse education array if it's a string
    if (typeof updateData.education === 'string') {
      updateData.education = JSON.parse(updateData.education);
    }

    // Parse arrays if they're strings
    if (typeof updateData.expertise === 'string') {
      updateData.expertise = updateData.expertise.split(',').map(item => item.trim());
    }
    if (typeof updateData.languages === 'string') {
      updateData.languages = updateData.languages.split(',').map(item => item.trim());
    }

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/team/:id
// @desc    Delete team member (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    res.json({ msg: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

