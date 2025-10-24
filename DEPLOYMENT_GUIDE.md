# 🚀 DafiTech Platform Deployment Guide

This guide will help you deploy your DafiTech platform online with:
- **Frontend**: Vercel (free hosting)
- **Backend**: Render (free hosting)
- **Database**: MongoDB Atlas (free tier)
- **Domain**: Your custom domain

## 📋 Prerequisites

1. **Domain Name**: You mentioned you bought a domain
2. **GitHub Account**: For version control
3. **Vercel Account**: For frontend hosting
4. **Render Account**: For backend hosting
5. **MongoDB Atlas Account**: For database hosting

## 🎯 Step 1: Prepare Your Code

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Ready for deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/dafitech-platform.git

# Push to GitHub
git push -u origin main
```

## 🌐 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `dafitech-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Environment Variables
Add these environment variables in Render dashboard:

**Required:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dafitech?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=10000
```

**Optional (for full functionality):**
```
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
EMAIL_USER=contact@dafitech.org
EMAIL_PASS=your-gmail-app-password
```

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://dafitech-backend.onrender.com`

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Import your GitHub repository

### 3.2 Configure Project
1. **Framework Preset**: Create React App
2. **Root Directory**: `client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`

### 3.3 Environment Variables
Add these environment variables in Vercel dashboard:

```
REACT_APP_API_URL=https://dafitech-backend.onrender.com
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://dafitech-platform.vercel.app`

## 🌍 Step 4: Configure Custom Domain

### 4.1 Vercel Domain Setup
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your domain: `dafitech.org`
4. Add www subdomain: `www.dafitech.org`
5. Follow DNS configuration instructions

### 4.2 DNS Configuration
In your domain registrar's DNS settings, add:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.3 Update CORS Settings
After getting your domain, update the backend CORS settings in `server/index.js`:

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://dafitech.org',
      'https://www.dafitech.org'
    ]
  : [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:4000',
      'http://localhost:5000'
    ];
```

## 🗄️ Step 5: MongoDB Atlas Setup

### 5.1 Create Cluster
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Choose a region close to your users

### 5.2 Database Access
1. Create a database user
2. Set username and password
3. Note these credentials

### 5.3 Network Access
1. Add IP address: `0.0.0.0/0` (allows all IPs)
2. Or add specific IPs for security

### 5.4 Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `dafitech`

## 🔧 Step 6: Final Configuration

### 6.1 Update API URL
After deployment, update your frontend environment variable:
```
REACT_APP_API_URL=https://dafitech-backend.onrender.com
```

### 6.2 Test Your Deployment
1. Visit your domain: `https://dafitech.org`
2. Test user registration
3. Test login functionality
4. Test all major features

## 📊 Step 7: Monitoring & Maintenance

### 7.1 Render Monitoring
- Check Render dashboard for backend health
- Monitor logs for errors
- Set up uptime monitoring

### 7.2 Vercel Analytics
- Enable Vercel Analytics
- Monitor frontend performance
- Check for build errors

### 7.3 MongoDB Monitoring
- Monitor database usage
- Set up alerts for high usage
- Regular backups

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check CORS configuration in backend
   - Ensure domain is in allowed origins

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable names match exactly

3. **Database Connection**
   - Verify MongoDB URI is correct
   - Check network access settings

4. **Build Failures**
   - Check build logs in Vercel
   - Ensure all dependencies are in package.json

## 📞 Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas connection

## 🎉 Success!

Once deployed, your DafiTech platform will be live at:
- **Frontend**: `https://dafitech.org`
- **Backend**: `https://dafitech-backend.onrender.com`
- **Database**: MongoDB Atlas

Your platform is now ready for users worldwide! 🌍