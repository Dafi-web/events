# Render Environment Variables Setup

## 🚨 Critical - Do This First!

Your deployment is failing because required environment variables are missing.

## ✅ Required Environment Variables

Add these in Render Dashboard → Your Service → Environment:

### 1. MONGODB_URI (REQUIRED)
```
mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/onetigray?retryWrites=true&w=majority&appName=Cluster0
```
**What it does:** Connects to your MongoDB database

### 2. JWT_SECRET (REQUIRED)
```
afdea6a02dcc97a4f95c6fefb74f62486a7c58e778ba54a3cc275be49a53faac
```
**What it does:** Secures user authentication tokens

### 3. NODE_ENV (REQUIRED)
```
production
```
**What it does:** Sets the application to production mode

---

## 🎯 How to Add in Render Dashboard

### Step-by-Step:

1. **Go to:** https://dashboard.render.com

2. **Select your service:** `events-1` or similar

3. **Click:** "Environment" tab on the left sidebar

4. **Click:** "Add Environment Variable" button

5. **Add each variable:**
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/onetigray?retryWrites=true&w=majority&appName=Cluster0`
   - Click "Save"

6. **Repeat for JWT_SECRET and NODE_ENV**

7. **Save Changes** - Render will automatically redeploy

---

## 📸 Visual Guide

```
Render Dashboard
    └── Your Service (events-1)
        └── Environment Tab (left sidebar)
            └── Add Environment Variable (button)
                ├── Key: MONGODB_URI
                └── Value: [your connection string]
```

---

## ⚙️ Optional But Recommended Variables

Add these for full functionality:

### Cloudinary (for image uploads)
```
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
```

### Email (for notifications)
```
EMAIL_USER = your_email@gmail.com
EMAIL_PASS = your_16_char_app_password
```

### Stripe (for payments)
```
STRIPE_SECRET_KEY = sk_test_or_live_your_key
STRIPE_WEBHOOK_SECRET = whsec_your_secret
```

### Frontend URL (for CORS)
```
FRONTEND_URL = https://your-frontend.vercel.app
```

---

## ✅ Verification Checklist

After adding variables:

- [ ] MONGODB_URI is set (check for typos!)
- [ ] JWT_SECRET is set (32+ characters)
- [ ] NODE_ENV is set to "production"
- [ ] Build Command: `cd server && npm install --legacy-peer-deps`
- [ ] Start Command: `cd server && npm start`
- [ ] Saved changes and triggered redeploy

---

## 🔍 How to Check If It Worked

### Method 1: Check Logs
1. Render Dashboard → Your Service → Logs
2. Look for:
   ```
   ✅ Environment configuration check completed
   ✅ MongoDB connected successfully
   Server running on port 10000
   ```

### Method 2: Test Health Endpoint
```bash
curl https://your-service.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "database": "Connected"
}
```

---

## 🆘 Troubleshooting

### Error: "Missing required environment variables: MONGODB_URI"
**Fix:** You forgot to add MONGODB_URI. Go back and add it.

### Error: "Missing required environment variables: JWT_SECRET"
**Fix:** You forgot to add JWT_SECRET. Go back and add it.

### Error: "MongoDB connection failed"
**Fix:** 
1. Check MongoDB Atlas is running
2. Network Access → Add IP `0.0.0.0/0`
3. Verify connection string is correct

### Error: "MongoServerSelectionError"
**Fix:** MongoDB Atlas firewall is blocking Render
1. MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Save

---

## 📝 Quick Copy-Paste Format

For quick setup, copy this and fill in the blanks:

```
MONGODB_URI=mongodb+srv://wediabrhana_db_user:yesno1212@cluster0.zdrbe3u.mongodb.net/onetigray?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=afdea6a02dcc97a4f95c6fefb74f62486a7c58e778ba54a3cc275be49a53faac
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
STRIPE_SECRET_KEY=
FRONTEND_URL=
```

---

## 🎉 Success!

Once you see these logs in Render:
```
✅ Environment configuration check completed
📁 File uploads: ✅ Configured  (if Cloudinary is set)
💳 Payments: ✅ Configured      (if Stripe is set)
📧 Email notifications: ✅ Configured  (if Email is set)
✅ MongoDB connected successfully
Server running on port 10000
```

**Your backend is live!** 🚀

Test it: `https://your-service.onrender.com/health`

---

## 🔗 Next Steps

After backend is working:
1. Deploy frontend on Vercel (see `QUICK_DEPLOY.md`)
2. Add backend URL to frontend environment variables
3. Add frontend URL to `FRONTEND_URL` in Render
4. Test the complete application

---

**Need help?** Check `RENDER_DEPLOYMENT_FIX.md` for detailed troubleshooting.

