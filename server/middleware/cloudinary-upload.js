const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource type based on file type
    const isVideo = file.mimetype.startsWith('video/');
    
    return {
      folder: 'dafitech',
      resource_type: isVideo ? 'video' : 'image',
      // For videos, use simpler settings to avoid processing timeouts
      ...(isVideo ? {
        transformation: [
          { quality: 'auto:low' }, // Lower quality for faster processing
          { fetch_format: 'auto' }
        ],
        // Video-specific settings
        eager_async: true, // Process asynchronously
        eager: [
          { width: 640, height: 480, crop: 'scale', quality: 'auto' }
        ]
      } : {
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      })
    };
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const imageMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 
    'image/webp', 'image/svg+xml', 'image/tiff', 'image/tif', 
    'image/ico', 'image/heic', 'image/heif', 'image/avif', 'image/apng'
  ];
  
  const videoMimeTypes = [
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 
    'video/webm', 'video/ogg', 'video/3gpp', 'video/x-ms-wmv', 
    'video/x-flv', 'video/x-matroska', 'video/x-ms-asf', 'video/x-m4v', 
    'video/x-ms-wm', 'video/x-ms-wmx'
  ];

  const allowedMimeTypes = [...imageMimeTypes, ...videoMimeTypes];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for videos
    fieldSize: 10 * 1024 * 1024, // 10MB for text fields
  },
  // Add timeout handling
  onError: function(err, next) {
    console.error('Multer error:', err);
    next(err);
  }
});

// Helper function to upload single file
const uploadSingle = (fieldName) => upload.single(fieldName);

// Helper function to upload multiple files
const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);

// Helper function to upload multiple fields
const uploadFields = (fields) => upload.fields(fields);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  cloudinary
};

