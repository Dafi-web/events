const multer = require('multer');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

// Initialize GridFS
let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
});

// File filter to accept images and videos
const fileFilter = (req, file, cb) => {
  console.log('File upload attempt:', {
    fieldname: file.fieldname,
    mimetype: file.mimetype,
    originalname: file.originalname
  });
  
  // Comprehensive list of image MIME types
  const imageMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 
    'image/webp', 'image/svg+xml', 'image/tiff', 'image/tif', 
    'image/ico', 'image/x-icon', 'image/vnd.microsoft.icon',
    'image/heic', 'image/heif', 'image/avif', 'image/apng'
  ];
  
  // Comprehensive list of video MIME types
  const videoMimeTypes = [
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
    'video/webm', 'video/ogg', 'video/3gpp', 'video/x-ms-wmv',
    'video/x-flv', 'video/x-matroska', 'video/x-ms-asf',
    'video/x-m4v', 'video/x-ms-wm', 'video/x-ms-wmx'
  ];
  
  // Check MIME type
  const isImage = imageMimeTypes.includes(file.mimetype.toLowerCase());
  const isVideo = videoMimeTypes.includes(file.mimetype.toLowerCase());
  
  // Also check file extensions as fallback
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|tif|ico|heic|heif|avif|apng)$/i;
  const videoExtensions = /\.(mp4|mpeg|mov|avi|webm|ogv|3gp|wmv|flv|mkv|asf|m4v|wm|wmx)$/i;
  
  const hasImageExtension = imageExtensions.test(file.originalname);
  const hasVideoExtension = videoExtensions.test(file.originalname);
  
  if (isImage || isVideo || hasImageExtension || hasVideoExtension) {
    console.log('File accepted:', file.mimetype, file.originalname);
    return cb(null, true);
  } else {
    console.log('File rejected:', file.mimetype, file.originalname);
    cb(new Error(`File type not allowed. Got: ${file.mimetype}, file: ${file.originalname}. Allowed: images and videos`));
  }
};

// Memory storage for now - we'll handle GridFS upload manually
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for large videos
  },
  fileFilter: fileFilter
});

// Upload middleware for images
const uploadImages = upload.array('images', 10); // Max 10 images

// Upload middleware for videos  
const uploadVideos = upload.array('videos', 5); // Max 5 videos

// Combined upload middleware
const uploadMedia = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]);

// Helper function to upload file to GridFS
const uploadToGridFS = (fileBuffer, originalName, metadata = {}) => {
  return new Promise((resolve, reject) => {
    if (!gfsBucket) {
      reject(new Error('GridFS not initialized'));
      return;
    }

    // Generate unique filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${originalName}`;
    
    const uploadStream = gfsBucket.openUploadStream(filename, {
      metadata: {
        originalName: originalName,
        uploadDate: new Date(),
        ...metadata
      }
    });

    uploadStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      reject(error);
    });

    uploadStream.on('finish', () => {
      console.log('File uploaded to GridFS:', filename);
      resolve({
        filename: filename,
        url: `/api/files/uploads/${filename}`
      });
    });

    uploadStream.end(fileBuffer);
  });
};

// Helper function to get file URL from GridFS
const getFileUrl = (filename) => {
  return `/api/files/uploads/${filename}`;
};

// Helper function to delete file from GridFS
const deleteFile = async (filename) => {
  try {
    if (!gfsBucket) {
      throw new Error('GridFS not initialized');
    }

    return new Promise((resolve, reject) => {
      gfsBucket.delete(mongoose.Types.ObjectId(filename), (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          reject(err);
        } else {
          console.log('File deleted successfully:', filename);
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

module.exports = {
  uploadImages,
  uploadVideos,
  uploadMedia,
  uploadToGridFS,
  getFileUrl,
  deleteFile
};
