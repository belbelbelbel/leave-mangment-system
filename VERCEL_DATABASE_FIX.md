# 🔧 Fix Vercel Database Connection Issues

If both **login** and **registration** are failing on Vercel, it's almost certainly a database connection problem.

## 🔍 Step 1: Check Debug Endpoint

First, check if your database is connected:

```bash
curl https://your-app.vercel.app/api/debug
```

**Look for:**
```json
{
  "database": {
    "status": "connected",  ← Should be "connected"
    "readyState": 1,        ← Should be 1
    "user_count": 0        ← Will be 0 if no users exist
  }
}
```

**If `status` is NOT "connected":**
- Your database is not connecting
- Follow the steps below

## ✅ Step 2: Verify Environment Variables in Vercel

### Check via CLI:
```bash
vercel env ls
```

You should see:
- `MONGODB_URI` (for Production)
- `JWT_SECRET` (for Production)

### Check via Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify both variables exist

## ✅ Step 3: Verify MongoDB Connection String

The connection string should be:
```
mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Important:**
- Make sure there are **no spaces** or **line breaks**
- The password is: `5GDEo6n5LUfoLbq2`
- Include `retryWrites=true&w=majority` for reliability

## ✅ Step 4: Check MongoDB Atlas

### 4.1 Is the Cluster Running?

1. Go to https://cloud.mongodb.com
2. Check your cluster status
3. If it says **"Paused"** → Click **"Resume"**
4. Wait 2-5 minutes for it to fully start

### 4.2 Network Access

1. In MongoDB Atlas, go to **Network Access**
2. Click **"Add IP Address"**
3. Add `0.0.0.0/0` (allows all IPs - needed for Vercel)
4. Click **"Confirm"**
5. Wait 1-2 minutes for changes to propagate

**Why?** Vercel uses dynamic IPs, so you need to allow all IPs.

### 4.3 Database User

1. Go to **Database Access**
2. Verify user `gronaldchia_db_user` exists
3. Make sure password is correct: `5GDEo6n5LUfoLbq2`
4. User should have **Read and write** permissions

## ✅ Step 5: Update Environment Variables (If Needed)

If you need to update the connection string in Vercel:

### Via CLI:
```bash
# Remove old one
vercel env rm MONGODB_URI production

# Add new one
vercel env add MONGODB_URI production
# Paste: mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Via Dashboard:
1. Go to Settings → Environment Variables
2. Edit `MONGODB_URI`
3. Update the value
4. Save

## ✅ Step 6: Redeploy

**IMPORTANT:** After setting/updating environment variables, you MUST redeploy:

```bash
vercel --prod
```

Or trigger a new deployment from the Vercel dashboard.

## 🧪 Step 7: Test Again

### Test Debug Endpoint:
```bash
curl https://your-app.vercel.app/api/debug
```

Should show:
- `database.status: "connected"` ✅
- `mongodb_uri_exists: true` ✅
- `jwt_secret_exists: true` ✅

### Test Registration:
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "role": "Employee"
  }'
```

**Expected response:**
```json
{
  "message": "User registered successfully with default leave balances",
  "token": "...",
  "user": {...}
}
```

## 🐛 Common Errors and Solutions

### Error: "Database connection error"
**Cause:** MongoDB not connecting
**Solution:**
1. Check cluster is running (not paused)
2. Check Network Access allows `0.0.0.0/0`
3. Verify connection string in Vercel env vars
4. Redeploy after fixing

### Error: "MONGODB_URI not configured"
**Cause:** Environment variable not set
**Solution:**
1. Set `MONGODB_URI` in Vercel
2. Redeploy

### Error: "querySrv EREFUSED"
**Cause:** Cluster is paused or DNS issue
**Solution:**
1. Resume cluster in MongoDB Atlas
2. Wait 2-5 minutes
3. Try again

### Error: "Authentication failed"
**Cause:** Wrong password or user doesn't exist
**Solution:**
1. Verify password in MongoDB Atlas
2. Check database user exists
3. Update connection string if needed

## 📋 Checklist

Before testing, make sure:

- [ ] MongoDB cluster is **running** (not paused)
- [ ] Network Access allows `0.0.0.0/0`
- [ ] `MONGODB_URI` is set in Vercel environment variables
- [ ] `JWT_SECRET` is set in Vercel environment variables
- [ ] Connection string is correct (no spaces, correct password)
- [ ] Redeployed after setting environment variables
- [ ] Debug endpoint shows `database.status: "connected"`

## 🚀 Quick Fix Summary

1. **Check MongoDB Atlas:**
   - Cluster running? → Resume if paused
   - Network Access → Add `0.0.0.0/0`

2. **Check Vercel:**
   - Environment variables set? → Set them
   - Redeployed? → Redeploy with `vercel --prod`

3. **Test:**
   - Debug endpoint → Should show connected
   - Try registration → Should work

## 💡 Pro Tip

Use the debug endpoint to check status:
```bash
curl https://your-app.vercel.app/api/debug | jq .database
```

This will tell you exactly what's wrong!

