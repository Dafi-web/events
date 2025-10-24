# Video Upload Troubleshooting Guide

## Issue Identified
The 500 errors occur specifically when uploading videos with events. Images work fine, but videos cause the server to fail.

## Changes Made

### 1. **Improved Cloudinary Video Configuration**
- ✅ Added separate handling for videos vs images
- ✅ Reduced video file size limit from 100MB to 50MB
- ✅ Added asynchronous video processing to prevent timeouts
- ✅ Added better error logging for video uploads

### 2. **Enhanced Error Handling**
- ✅ Added detailed logging for video processing
- ✅ Added validation checks for video upload success
- ✅ Improved error messages for video upload failures

## Testing Steps

### **Step 1: Test with Small Video File**
1. Try uploading a **small video file** (< 10MB) first
2. Use common formats: MP4, MOV, or WebM
3. Check the server console for detailed logs

### **Step 2: Check Server Logs**
When you try to upload a video, you should see logs like:
```
Processing 1 video files...
Processing video 1: myvideo.mp4 (5242880 bytes)
Successfully processed 1 videos
```

### **Step 3: Common Video Issues & Solutions**

#### **Issue: Large Video Files**
- **Problem**: Videos > 20MB will be rejected
- **Solution**: Compress videos before uploading or increase the limit

#### **Issue: Unsupported Video Format**
- **Problem**: Some video formats may not be supported
- **Solution**: Convert to MP4, MOV, or WebM format

#### **Issue: Network Timeout**
- **Problem**: Large videos take too long to upload
- **Solution**: Use smaller video files or check your internet connection

#### **Issue: Cloudinary Processing Timeout**
- **Problem**: Cloudinary takes too long to process the video
- **Solution**: The new async processing should handle this

## Temporary Workaround

If videos still don't work, you can:

1. **Create events without videos** - just use images for now
2. **Upload videos separately** - use Cloudinary directly and add URLs manually
3. **Use smaller video files** - compress videos to < 20MB

## Debugging Commands

### Check if server is processing videos:
```bash
# Watch server logs when uploading
tail -f server/logs/app.log  # if logs are written to file
```

### Test video upload manually:
```bash
curl -X POST http://localhost:4000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Event" \
  -F "description=Test" \
  -F "date=2025-12-31" \
  -F "time=12:00" \
  -F "category=cultural" \
  -F "location[name]=Test Location" \
  -F "location[country]=Ethiopia" \
  -F "videos=@/path/to/small-video.mp4"
```

## Next Steps

1. **Try uploading a small video file** (< 20MB)
2. **Check the server console** for error messages
3. **If it still fails**, we can implement a fallback that saves the event without videos
4. **Consider implementing video compression** on the frontend

## Expected Behavior After Fix

- ✅ Videos up to 20MB should upload successfully
- ✅ Server logs should show detailed video processing info
- ✅ Events with videos should save without 500 errors
- ✅ Videos should be accessible via the returned URLs

---

**Note**: If you continue to have issues, we can implement a progressive upload system or switch to a different video hosting solution.
