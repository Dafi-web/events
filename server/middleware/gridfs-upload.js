const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

// Create GridFS storage engine
const createGridFSStorage = () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/onetigray?retryWrites=true&w=majority&appName=Cluster0&serverSelectionTimeoutMS=30000';
  
  return new GridFsStorage({
    url: mongoUri,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        // Generate unique filename
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
        
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads', // GridFS bucket name
          metadata: {
            originalName: file.originalname,
            mimetype: file.mimetype,
            uploadDate: new Date(),
            uploadedBy: req.user ? req.user.id : null
          }
        };
        
        resolve(fileInfo);
      });
    }
  });
};

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

// Create multer upload middleware
const createUploadMiddleware = () => {
  const storage = createGridFSStorage();
  
  return multer({
    storage: storage,
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB limit for large videos
    },
    fileFilter: fileFilter
  });
};

// Upload middleware for images
const uploadImages = createUploadMiddleware().array('images', 10); // Max 10 images

// Upload middleware for videos  
const uploadVideos = createUploadMiddleware().array('videos', 5); // Max 5 videos

// Combined upload middleware
const uploadMedia = createUploadMiddleware().fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]);

// Helper function to get file URL from GridFS
const getFileUrl = (filename, bucketName = 'uploads') => {
  // Return the URL to access the file through your API
  return `/api/files/${bucketName}/${filename}`;
};

// Helper function to delete file from GridFS
const deleteFile = async (filename, bucketName = 'uploads') => {
  try {
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    const gfsBucket = gfs.collection(bucketName);
    
    return new Promise((resolve, reject) => {
      gfsBucket.deleteOne({ filename: filename }, (err) => {
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
  getFileUrl,
  deleteFile
};
