# Cloudinary Setup Guide

## Why Cloudinary?
Cloudinary is a cloud-based image and video management service that provides:
- Automatic image optimization and resizing
- Video transcoding and optimization
- CDN delivery for fast loading
- Secure file storage

## Setup Steps

### 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Cloudinary Credentials
1. Log into your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy the following values:
   - **Cloud Name** (e.g., `my-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### 3. Create Environment File
Create a `.env` file in the `server` directory with the following content:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/onetigray?retryWrites=true&w=majority&appName=Cluster0&serverSelectionTimeoutMS=30000

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

# Cloudinary Configuration for file uploads
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=4000
NODE_ENV=development
```

### 4. Replace the Placeholder Values
Replace the following values in your `.env` file:
- `your_cloudinary_cloud_name` → Your actual Cloudinary cloud name
- `your_cloudinary_api_key` → Your actual Cloudinary API key
- `your_cloudinary_api_secret` → Your actual Cloudinary API secret
- `your_jwt_secret_key_here_change_this_in_production` → A secure random string for JWT signing

### 5. Restart Your Server
After creating the `.env` file, restart your server:
```bash
cd server
npm start
```

## What This Enables

Once configured, your application will:
- ✅ Upload images and videos to Cloudinary
- ✅ Automatically optimize images for web delivery
- ✅ Generate responsive image sizes
- ✅ Provide fast CDN delivery
- ✅ Handle video transcoding
- ✅ Store files securely in the cloud

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- 25,000 transformations per month
- 1,000 video minutes per month

This should be sufficient for most small to medium applications.

## Troubleshooting

### "Upload disabled - Cloudinary not configured"
This means the environment variables are not set correctly. Check:
1. The `.env` file exists in the `server` directory
2. The Cloudinary credentials are correct
3. The server was restarted after adding the `.env` file

### Upload Errors
If uploads fail, check:
1. Your Cloudinary account is active
2. The API credentials are correct
3. You haven't exceeded your free tier limits
4. The file size is under 500MB (as configured in the app)

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique values for JWT_SECRET
- Regularly rotate your API keys
- Monitor your Cloudinary usage to avoid unexpected charges
