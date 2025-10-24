# MongoDB GridFS File Storage Setup

## Overview
Your OneTigray application now uses MongoDB GridFS for file storage instead of Cloudinary. This means all images and videos are stored directly in your MongoDB database.

## What is GridFS?
GridFS is MongoDB's specification for storing and retrieving files that exceed the BSON document size limit of 16MB. It's perfect for storing images, videos, and other large files.

## Benefits of Using GridFS
- ✅ **No external dependencies** - Everything stored in your MongoDB database
- ✅ **Cost-effective** - No additional cloud storage costs
- ✅ **Unified data management** - All data in one place
- ✅ **Automatic replication** - Files are replicated with your MongoDB data
- ✅ **Built-in sharding** - Scales with your MongoDB cluster
- ✅ **Metadata support** - Store file information alongside the file

## How It Works

### File Upload Process
1. User selects files in the admin dashboard
2. Files are uploaded to MongoDB GridFS
3. File URLs are generated pointing to your API
4. URLs are stored in the event document

### File Access
- Files are served through `/api/files/:bucket/:filename`
- Your API handles file streaming and proper headers
- Files are cached by browsers for performance

## Setup Instructions

### 1. Install Dependencies
The required packages are already installed:
- `multer-gridfs-storage` - Multer storage engine for GridFS
- `gridfs-stream` - GridFS streaming interface

### 2. Test GridFS Setup
Run the test script to verify everything is working:

```bash
node test-gridfs.js
```

This will:
- Connect to your MongoDB database
- Initialize GridFS
- Check for existing files
- Verify the setup is working

### 3. Start Your Server
```bash
cd server
npm start
```

### 4. Test File Uploads
1. Go to the admin dashboard
2. Create or edit an event
3. Upload images and videos
4. Check that files appear correctly

## File Structure

### GridFS Collections
- **uploads.files** - File metadata and information
- **uploads.chunks** - File data chunks (for files > 16MB)

### Event Document Structure
```javascript
{
  images: [{
    url: "/api/files/uploads/filename.jpg",
    filename: "1234567890-123456789-image.jpg",
    originalName: "my-image.jpg",
    caption: "Event photo"
  }],
  videos: [{
    url: "/api/files/uploads/filename.mp4",
    filename: "1234567890-123456789-video.mp4",
    originalName: "my-video.mp4",
    caption: "Event video"
  }]
}
```

## API Endpoints

### Get File
```
GET /api/files/:bucket/:filename
```
Returns the file with proper content-type headers.

### List Files
```
GET /api/files/:bucket
```
Returns all files in the specified bucket.

### Delete File (Admin Only)
```
DELETE /api/files/:bucket/:filename
```
Deletes a file from GridFS.

## File Management

### Supported File Types
**Images:** JPEG, PNG, GIF, BMP, WebP, SVG, TIFF, ICO, HEIC, HEIF, AVIF, APNG
**Videos:** MP4, MOV, AVI, WebM, OGG, 3GP, WMV, FLV, MKV, ASF, M4V

### File Size Limits
- Maximum file size: 500MB per file
- Maximum images per event: 10
- Maximum videos per event: 5

### File Naming
Files are automatically renamed to prevent conflicts:
- Format: `{timestamp}-{random}-{originalname}`
- Example: `1703123456789-123456789-photo.jpg`

## Monitoring and Maintenance

### Check File Storage Usage
```bash
# Connect to MongoDB and check collections
use onetigray
db.uploads.files.countDocuments()
db.uploads.chunks.countDocuments()
```

### Clean Up Orphaned Files
If you delete events, you may want to clean up unused files:
```javascript
// This would need to be implemented as a cleanup script
// to remove files that are no longer referenced in events
```

## Troubleshooting

### "GridFS not initialized" Error
This means MongoDB connection failed. Check:
1. MongoDB connection string is correct
2. Network connectivity to MongoDB Atlas
3. Database permissions

### Files Not Displaying
Check:
1. Server is running on correct port
2. File URLs are correct
3. Files exist in GridFS collections

### Upload Errors
Check:
1. File size is under 500MB
2. File type is supported
3. MongoDB connection is stable

## Performance Considerations

### File Size Optimization
- Images are stored as-is (no automatic compression)
- Consider implementing image compression if needed
- Large videos may take time to upload

### Caching
- Files are served with appropriate cache headers
- Browsers will cache files for better performance
- Consider implementing CDN if needed for high traffic

## Security

### File Access
- Files are publicly accessible via URL
- Consider implementing authentication if needed
- File names are obfuscated to prevent guessing

### File Validation
- Only allowed file types are accepted
- File size limits are enforced
- Malicious files are rejected

## Migration from Cloudinary

If you were previously using Cloudinary:
1. Old placeholder URLs will still work
2. New uploads will use GridFS
3. Consider migrating existing files if needed

## Support

For issues with GridFS setup:
1. Check MongoDB Atlas logs
2. Verify network connectivity
3. Test with the provided test script
4. Check server logs for detailed error messages
