const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary if credentials are available
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// For now, use memory storage and handle uploads manually
const memoryStorage = multer.memoryStorage();
const upload = multer({ 
  storage: memoryStorage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for large videos
  },
  fileFilter: (req, file, cb) => {
    // Log the file details for debugging
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
    
    // Also check file extensions as fallback for cases where MIME type might be incorrect
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
  }
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

// Helper function to upload files to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'dafitech/events', originalName = '') => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      // Return a placeholder URL if Cloudinary is not configured
      console.log('Cloudinary not configured, returning placeholder URL');
      resolve({
        url: 'https://via.placeholder.com/800x600?text=Upload+Disabled',
        publicId: null
      });
      return;
    }

    // Determine resource type based on file extension
    const isVideo = /\.(mp4|mpeg|mov|avi|webm|ogv|3gp|wmv|flv|mkv|asf|m4v|wm|wmx)$/i.test(originalName);
    const resourceType = isVideo ? 'video' : 'image';

    console.log(`Uploading ${resourceType} to Cloudinary:`, originalName);

    const uploadOptions = {
      resource_type: resourceType,
      folder: folder,
      use_filename: true,
      unique_filename: true,
    };

    // Only apply image transformations for images
    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ];
    }

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result.secure_url);
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      }
    ).end(fileBuffer);
  });
};

module.exports = {
  uploadImages,
  uploadVideos,
  uploadMedia,
  cloudinary,
  uploadToCloudinary
};
