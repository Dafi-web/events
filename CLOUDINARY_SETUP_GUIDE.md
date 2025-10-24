# Cloudinary + Email Setup Guide

## 🔧 **Required Environment Variables**

Add these to your `server/.env` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/onetigray

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Cloudinary Configuration (Get these from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (for contact form)
EMAIL_USER=wedibrhana@gmail.com
EMAIL_PASS=your_gmail_app_password

# Server Configuration
PORT=4000
NODE_ENV=development
```

## 📸 **Cloudinary Setup**

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to Dashboard → Settings
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret
5. Add these to your `.env` file

## 📧 **Gmail Setup for Contact Form**

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security
3. Generate an "App Password" for "Mail"
4. Use this app password (not your regular password) in `EMAIL_PASS`

## 🚀 **Benefits of This Setup**

- ✅ **Images & Videos**: Stored on Cloudinary CDN (fast, reliable)
- ✅ **Contact Messages**: Sent to wedibrhana@gmail.com
- ✅ **Admin Access**: View all contact messages via API
- ✅ **No Server Storage**: No need to manage file storage on your server
- ✅ **Automatic Optimization**: Cloudinary optimizes images/videos automatically

## 📱 **Testing**

1. Start the server: `cd server && node index.js`
2. Start the frontend: `cd client && npm start`
3. Test image upload in admin dashboard
4. Test contact form - check your email and server console






