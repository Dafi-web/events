const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const router = express.Router();

// Initialize GridFS
let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
});

// @route   GET /api/files/uploads/:filename
// @desc    Get file from GridFS
// @access  Public
router.get('/uploads/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!gfsBucket) {
      return res.status(500).json({ msg: 'GridFS not initialized' });
    }

    console.log('Requesting file:', filename);

    // Find file by filename
    const files = gfsBucket.find({ filename: filename });
    const fileArray = await files.toArray();
    
    if (!fileArray || fileArray.length === 0) {
      console.log('File not found:', filename);
      return res.status(404).json({ msg: 'File not found' });
    }

    const file = fileArray[0];
    console.log('Found file:', file.filename, 'Size:', file.length);
    
    const contentType = file.metadata?.mimetype || 'application/octet-stream';
    
    // Set appropriate headers
    res.set('Content-Type', contentType);
    res.set('Content-Length', file.length);
    res.set('Content-Disposition', `inline; filename="${file.metadata?.originalName || filename}"`);
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Create read stream using file ID instead of filename
    const downloadStream = gfsBucket.openDownloadStream(file._id);
    
    downloadStream.on('error', (err) => {
      console.error('Error reading file stream:', err);
      if (!res.headersSent) {
        res.status(500).json({ msg: 'Error reading file' });
      }
    });
    
    downloadStream.on('end', () => {
      console.log('File stream ended for:', filename);
    });
    
    downloadStream.pipe(res);
    
  } catch (error) {
    console.error('File serve error:', error);
    if (!res.headersSent) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
});

// @route   GET /api/files/:bucket
// @desc    Get all files from a bucket
// @access  Public
router.get('/:bucket', (req, res) => {
  try {
    const { bucket } = req.params;
    
    if (!gfsBucket) {
      return res.status(500).json({ msg: 'GridFS not initialized' });
    }

    const files = gfsBucket.find({});
    files.toArray((err, fileArray) => {
      if (err) {
        return res.status(500).json({ msg: 'Error fetching files' });
      }
      
      if (!fileArray || fileArray.length === 0) {
        return res.status(404).json({ msg: 'No files found' });
      }
      
      res.json(fileArray);
    });
  } catch (error) {
    console.error('Files list error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/files/:bucket/:filename
// @desc    Delete file from GridFS
// @access  Private (Admin only)
router.delete('/:bucket/:filename', (req, res, next) => {
  require('../middleware/auth')(req, res, next);
}, (req, res) => {
  try {
    const { bucket, filename } = req.params;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    if (!gfsBucket) {
      return res.status(500).json({ msg: 'GridFS not initialized' });
    }

    // Find file first to get its ID
    const files = gfsBucket.find({ filename: filename });
    files.toArray((err, fileArray) => {
      if (err) {
        console.error('Error finding file:', err);
        return res.status(500).json({ msg: 'Error finding file' });
      }

      if (!fileArray || fileArray.length === 0) {
        return res.status(404).json({ msg: 'File not found' });
      }

      const file = fileArray[0];
      gfsBucket.delete(file._id, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ msg: 'Error deleting file' });
        }
        
        res.json({ msg: 'File deleted successfully' });
      });
    });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
