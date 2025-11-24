# 🔧 Vercel Environment Variables Setup

Based on the updates made to your project, here's exactly what you need to set in Vercel.

## 📋 Required Environment Variables

You need to set **2 environment variables** in Vercel:

### 1. MONGODB_URI
```
mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 2. JWT_SECRET
```
236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc
```

## 🚀 How to Set Them in Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Navigate to your project
cd /Users/macbookpro/Desktop/leave-mangment-system

# Set MONGODB_URI for production
vercel env add MONGODB_URI production
# When prompted, paste: mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Set MONGODB_URI for preview (optional, but recommended)
vercel env add MONGODB_URI preview
# Paste the same connection string

# Set JWT_SECRET for production
vercel env add JWT_SECRET production
# When prompted, paste: 236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc

# Set JWT_SECRET for preview (optional, but recommended)
vercel env add JWT_SECRET preview
# Paste the same JWT secret
```

### Option B: Using Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project (or create one if you haven't)

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add MONGODB_URI**
   - Click **Add New**
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - **Environment**: Select `Production`, `Preview`, and `Development` (or at least Production)
   - Click **Save**

4. **Add JWT_SECRET**
   - Click **Add New**
   - **Key**: `JWT_SECRET`
   - **Value**: `236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc`
   - **Environment**: Select `Production`, `Preview`, and `Development` (or at least Production)
   - Click **Save**

## ✅ Verify Environment Variables

After setting them, verify they're correct:

### Via CLI:
```bash
vercel env ls
```

### Via Dashboard:
- Go to Settings → Environment Variables
- You should see both `MONGODB_URI` and `JWT_SECRET` listed

## 🔄 After Setting Environment Variables

**Important:** You need to **redeploy** for the changes to take effect:

```bash
vercel --prod
```

Or trigger a new deployment from the Vercel dashboard.

## 🧪 Test After Deployment

Once deployed, test your API:

```bash
# Test health check
curl https://your-app.vercel.app/api

# Test debug endpoint
curl https://your-app.vercel.app/api/debug
```

The debug endpoint will show you if the environment variables are set correctly.

## ⚠️ Important Notes

1. **MongoDB Cluster Must Be Running**
   - Make sure your MongoDB Atlas cluster is **not paused**
   - If paused, resume it in MongoDB Atlas dashboard
   - Wait 2-5 minutes for it to fully start

2. **Network Access**
   - In MongoDB Atlas, go to **Network Access**
   - Add `0.0.0.0/0` to allow connections from anywhere (for Vercel)
   - Or add Vercel's IP ranges (less secure but more restrictive)

3. **Connection String Format**
   - The connection string should be exactly as shown above
   - Make sure there are no extra spaces or line breaks
   - The password is: `5GDEo6n5LUfoLbq2`

## 📝 Summary

You need to set these **2 environment variables** in Vercel:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc` |

After setting them, **redeploy** your application!

