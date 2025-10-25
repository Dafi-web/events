# Render Deployment Fix Guide

## Problem Summary

The deployment was failing with these errors:
- `sh: 1: nodemon: not found`
- `sh: 1: react-scripts: not found`

**Root Cause**: The build command only installed dependencies in the root directory, but the `server` and `client` subdirectories have their own `package.json` files with their own dependencies that weren't being installed.

## Solution Applied

### 1. Fixed `render.yaml` Configuration

**Location**: `/render.yaml` (root directory)

The updated configuration now:
- Changes to the `server` directory before installing dependencies
- Installs server dependencies with `--legacy-peer-deps` flag
- Starts only the backend server (not the client)

```yaml
services:
  - type: web
    name: dafitech-backend
    env: node
    plan: free
    buildCommand: cd server && npm install --legacy-peer-deps
    startCommand: cd server && npm start
```

### 2. Updated Root `package.json` Scripts

Added proper build and install commands that handle all subdirectories.

## Deployment Steps for Render

### Option A: Deploy from Render Dashboard (Recommended)

1. **Go to your Render Dashboard**: https://dashboard.render.com

2. **Update Service Settings**:
   - Go to your service (dafitech-backend)
   - Click on "Settings"
   - Update the build command:
     ```
     cd server && npm install --legacy-peer-deps
     ```
   - Update the start command:
     ```
     cd server && npm start
     ```

3. **Configure Environment Variables**:
   In the "Environment" tab, add these variables (get values from your production.env.example):
   
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   EMAIL_USER=<your_email>
   EMAIL_PASS=<your_gmail_app_password>
   FRONTEND_URL=<your_frontend_url>
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   STRIPE_WEBHOOK_SECRET=<your_webhook_secret>
   ```

4. **Trigger Manual Deploy**:
   - Click on "Manual Deploy" → "Deploy latest commit"

### Option B: Deploy Using render.yaml

1. **Ensure render.yaml is in repository root** ✅ (Done)

2. **Commit and push changes**:
   ```bash
   git add render.yaml package.json server/render.yaml
   git commit -m "Fix Render deployment configuration"
   git push origin main
   ```

3. **In Render Dashboard**:
   - The service should automatically detect and use the root `render.yaml`
   - If not, you can create a new service and point it to your repository
   - Render will automatically use the `render.yaml` file

4. **Add Environment Variables** (same as Option A, step 3)

## Important Notes

### Backend vs Frontend Deployment

Your application has two parts:

1. **Backend (Node.js/Express)** - Deploy on Render ✅
   - This is what the current configuration handles
   - API will be available at: `https://dafitech-backend.onrender.com` (or your custom domain)

2. **Frontend (React)** - Deploy separately
   - **Recommended platforms**:
     - **Vercel** (easiest for React): https://vercel.com
     - **Netlify**: https://netlify.com
     - **Render Static Site**: Another Render service

### Frontend Deployment (Quick Guide)

#### Deploy React App on Vercel:

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your repository
4. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```
6. Deploy!

#### Update Frontend API URL:

In your React app (`client/src/utils/api.js`), make sure it uses the production backend URL:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### Enable CORS in Backend

Make sure your backend allows requests from your frontend domain. Check `server/index.js` for CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://your-frontend-domain.vercel.app',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
```

## Troubleshooting

### If deployment still fails:

1. **Check Render Logs**:
   - Go to your service → "Logs" tab
   - Look for specific error messages

2. **Verify Node Version**:
   - Add `engines` field to `server/package.json`:
     ```json
     "engines": {
       "node": "18.x"
     }
     ```

3. **Clear Build Cache**:
   - In Render dashboard → Settings → "Clear build cache"
   - Then trigger a new deploy

4. **Test Locally**:
   ```bash
   cd server
   npm install --legacy-peer-deps
   npm start
   ```

### Common Issues:

- **Port binding error**: Render automatically sets the PORT environment variable, make sure your `server/index.js` uses it:
  ```javascript
  const PORT = process.env.PORT || 5000;
  ```

- **MongoDB connection timeout**: Ensure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Render's IP addresses to the allowlist

- **Environment variables not set**: Double-check all required variables are added in Render dashboard

## Monitoring

After successful deployment:

1. **Check Health**:
   - Visit: `https://your-backend.onrender.com/health` (if you have a health endpoint)
   - Or test an API endpoint

2. **Monitor Logs**:
   - Render Dashboard → Your Service → Logs tab
   - Watch for any runtime errors

3. **Set up Alerts** (Optional):
   - Render Dashboard → Your Service → Settings → Notifications

## Next Steps

1. ✅ Backend deployed on Render
2. ⬜ Deploy frontend on Vercel/Netlify
3. ⬜ Update frontend API URL to point to Render backend
4. ⬜ Test the full application
5. ⬜ Set up custom domain (optional)
6. ⬜ Configure SSL certificate (automatic on Render)

## Support

If you continue to have issues:
- Check Render documentation: https://render.com/docs
- Review Render community forum: https://community.render.com
- Check your deployment logs carefully for specific error messages

