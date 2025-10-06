# 🔧 Fix for Vercel 404 Error - Leave Management System
## The Problem
You're getting `404: NOT_FOUND` error because of how Vercel handles API routes. When Vercel receives a request to `/api/something`, it routes it to `/api/index.js` but **strips the `/api` prefix**.
## ✅ What We Fixed
### 1. Simplified vercel.json
The [`vercel.json`](vercel.json:1) was overcomplicated. Now it's clean:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/",
      "dest": "/frontend/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

### 2. Fixed API Routes in api/index.js
**BEFORE (causing 404):**
```javascript
app.use("/api/auth", authRoutes)  
app.get("/api", (req, res) => {  
```
**AFTER (fixed):**
```javascript
app.use("/auth", authRoutes) 
app.get("/", (req, res) => {      
```

## 🚀 How to Deploy the Fix

### Step 1: Redeploy to Vercel
```bash
cd /path/to/leave-management-system
vercel --prod
```

### Step 2: Test Your Endpoints

After deployment, your endpoints will be:
- **API Health Check**: `https://your-app.vercel.app/api/` (note the trailing slash)
- **Auth**: `https://your-app.vercel.app/api/auth/login`
- **Users**: `https://your-app.vercel.app/api/users`
- **Leaves**: `https://your-app.vercel.app/api/leaves`
- **Balances**: `https://your-app.vercel.app/api/balances`
- **Balance Requests**: `https://your-app.vercel.app/api/balance-requests`
- **Notices**: `https://your-app.vercel.app/api/notices`
- **Admin**: `https://your-app.vercel.app/api/admin`
- **Wellness**: `https://your-app.vercel.app/api/wellness`

### Step 3: Verify It's Working

Test the health check endpoint:
```bash
curl https://your-app.vercel.app/api/
```

You should get:
```json
{
  "message": "Leave Management System API is running",
  "timestamp": "2025-01-06T18:53:00.000Z",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "leaves": "/api/leaves",
    "balances": "/api/balances",
    "balanceRequests": "/api/balance-requests",
    "notices": "/api/notices",
    "admin": "/api/admin",
    "wellness": "/api/wellness"
  }
}
```

## 🔍 Environment Variables

Make sure your environment variables are set in Vercel:

### Via Vercel CLI:
```bash
vercel env add MONGODB_URI
# Paste: mongodb+srv://obiriezechidiebere:Dh7xiOGpiK4QJAdW@cluster0.jtfrplb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

vercel env add JWT_SECRET
# Paste: 236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc
```

### Via Vercel Dashboard:
1. Go to your project dashboard on vercel.com
2. Settings → Environment Variables
3. Add the variables above

## 🔄 If Still Getting 404

### Check Function Logs:
```bash
vercel logs --prod
```

### Common Issues:
1. **Environment variables not set** → Add them via Vercel dashboard
2. **MongoDB connection issue** → Check your MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
3. **Build failed** → Check build logs in Vercel dashboard

### Debug Steps:
```bash

curl https://your-app.vercel.app/api/

curl https://your-app.vercel.app/api/auth/

curl -v https://your-app.vercel.app/api/
```

## 📋 Summary of Changes Made

| File | Change | Why |
|------|--------|-----|
| [`vercel.json`](vercel.json:1) | Simplified configuration | Removed complex routing that was causing conflicts |
| [`api/index.js`](api/index.js:55) | Removed `/api` prefix from routes | Vercel strips `/api` when routing to the function |
| [`api/index.js`](api/index.js:65) | Changed health check from `/api` to `/` | Root path of the function |

The 404 error should now be resolved! 🎉