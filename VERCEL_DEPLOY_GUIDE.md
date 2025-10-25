# 🚀 Deploy Frontend on Vercel - Complete Guide

## ✅ Backend Status
Your backend is live at: **https://events-1.onrender.com**

Now let's deploy the frontend!

---

## 🎯 Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Go to Vercel

Visit: https://vercel.com/new

### Step 2: Import Repository

1. Click **"Add New..."** → **"Project"**
2. If not connected to GitHub, click **"Connect Git Provider"** → Choose GitHub
3. Find and select your repository: **`Dafi-web/events`**
4. Click **"Import"**

### Step 3: Configure Project Settings

**IMPORTANT:** Configure these settings correctly:

#### Root Directory
```
client
```
(This tells Vercel to deploy only the client folder)

#### Framework Preset
```
Create React App
```
(Vercel should auto-detect this)

#### Build Settings

**Build Command:**
```
npm run build
```

**Output Directory:**
```
build
```

**Install Command:**
```
npm install --legacy-peer-deps
```

### Step 4: Add Environment Variables

Click **"Environment Variables"** section and add:

**Variable Name:**
```
REACT_APP_API_URL
```

**Value:**
```
https://events-1.onrender.com/api
```

**Important:** Make sure to check all three environments:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 5: Deploy!

Click **"Deploy"** button and wait 2-3 minutes.

---

## 🎯 Method 2: Deploy via Vercel CLI (Alternative)

If you prefer command line:

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy from Client Directory
```bash
cd /Users/dawitabrhaweldegebriel/Desktop/OneTigray/client
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- What's your project's name? **dafitech-frontend** (or any name)
- In which directory is your code located? **./**
- Want to override settings? **Y**
  - Build Command: `npm run build`
  - Output Directory: `build`
  - Development Command: `npm start`

### Set Environment Variable
```bash
vercel env add REACT_APP_API_URL
# When prompted, enter: https://events-1.onrender.com/api
# Select: Production, Preview, Development (all three)
```

### Deploy to Production
```bash
vercel --prod
```

---

## ✅ Expected Deployment Process

You'll see something like:

```
Vercel CLI 28.0.0
🔍 Inspect: https://vercel.com/your-username/project/...
✅ Preview: https://project-hash.vercel.app
📝 Building...
✅ Build Completed
📦 Uploading...
✅ Deployment Ready
🎉 Production: https://your-app.vercel.app
```

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Build Fails with Dependency Errors

**Error:** `npm ERR! peer dependency conflict`

**Fix:** Make sure Install Command is set to:
```
npm install --legacy-peer-deps
```

### Issue 2: Blank Page After Deployment

**Possible Causes:**
1. **Wrong Output Directory**
   - Should be: `build` (not `dist` or `public`)

2. **Missing API URL**
   - Add `REACT_APP_API_URL` environment variable

3. **Browser Console Shows Errors**
   - Open browser DevTools (F12) → Console
   - Share the errors

### Issue 3: API Calls Failing (CORS Errors)

**Error in browser:** `Access to fetch at '...' from origin '...' has been blocked by CORS`

**Fix:** Update backend CORS settings

1. Go to Render Dashboard
2. Your Service → Environment
3. Add:
```
FRONTEND_URL = https://your-app.vercel.app
```
(Use your actual Vercel URL)
4. Redeploy backend

### Issue 4: 404 on Page Refresh

This should be fixed by the updated `vercel.json` rewrites config.

If still happening, make sure `vercel.json` has:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📋 Post-Deployment Checklist

After deployment succeeds:

- [ ] Visit your Vercel URL: `https://your-app.vercel.app`
- [ ] Check homepage loads
- [ ] Try logging in
- [ ] Check browser console for errors (F12)
- [ ] Test API calls (events, news, etc.)
- [ ] Update backend CORS with frontend URL
- [ ] Test on mobile device

---

## 🔗 Connect Backend to Frontend

### Step 1: Get Your Vercel URL

After deployment, Vercel gives you a URL like:
```
https://events-xxxxxxx.vercel.app
```

### Step 2: Update Backend CORS

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your backend service: **events-1**
3. Click **Environment** tab
4. Add new variable:
```
Key: FRONTEND_URL
Value: https://your-actual-vercel-url.vercel.app
```
5. Click **"Save Changes"**
6. Backend will auto-redeploy (~30 seconds)

### Step 3: Test Complete System

1. Visit your Vercel URL
2. Try these actions:
   - Browse events
   - View news articles
   - Register an account
   - Login
   - Browse directory

---

## 🎨 Custom Domain (Optional)

### If you have a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `dafitech.org`)
3. Follow Vercel's DNS configuration instructions
4. Update backend `FRONTEND_URL` to your custom domain

---

## 📊 Deployment Settings Summary

| Setting | Value |
|---------|-------|
| Platform | Vercel |
| Root Directory | `client` |
| Framework | Create React App |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Install Command | `npm install --legacy-peer-deps` |
| Node Version | 18.x (auto-detected) |

### Environment Variables
| Variable | Value |
|----------|-------|
| REACT_APP_API_URL | `https://events-1.onrender.com/api` |

---

## 🔍 Verify Backend URL

Make sure your backend API URL is correct. Test it:

```bash
# Should return JSON with API info
curl https://events-1.onrender.com/api

# Should return health status
curl https://events-1.onrender.com/health
```

---

## 📱 After Successful Deployment

### Your App Architecture:

```
Frontend (Vercel)
    ↓
https://your-app.vercel.app
    ↓
Calls API at: https://events-1.onrender.com/api
    ↓
Backend (Render)
    ↓
MongoDB Atlas Database
```

---

## 🆘 Still Having Issues?

Please share:

1. **Vercel deployment logs** (from dashboard)
2. **Browser console errors** (F12 → Console tab)
3. **Your Vercel URL** (if deployment succeeded)
4. **Specific error messages**

And I'll help you fix it!

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Vercel deployment shows "Deployment Ready"
✅ You can access your Vercel URL
✅ Homepage loads without errors
✅ Browser console shows no red errors
✅ API calls work (check Network tab)
✅ You can browse events, news, etc.

---

**Ready to deploy?** Follow Method 1 above (Vercel Dashboard) - it's the easiest!

**Deployment time:** 2-3 minutes ⏱️

