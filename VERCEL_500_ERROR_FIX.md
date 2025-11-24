# 🔧 Fix Vercel 500 Internal Server Error

You're getting a 500 error, which means the server is running but something is failing. Here's how to fix it.

## 🔍 Step 1: Check Vercel Logs

The most important step - check what the actual error is:

### Via CLI:
```bash
vercel logs --prod
```

### Via Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click on **"Functions"** tab
4. Click on a recent deployment
5. Check the **logs** for errors

**Look for:**
- Database connection errors
- JWT_SECRET errors
- Any red error messages

## 🔍 Step 2: Test Debug Endpoint

Check if your environment variables are set:

```bash
curl https://leave-mangment-system-ashy.vercel.app/api/debug
```

**What to check:**
```json
{
  "environment": {
    "mongodb_uri_exists": true,  ← Should be true
    "jwt_secret_exists": true,   ← Should be true
    "mongodb_uri_length": 120,   ← Should be > 0
    "jwt_secret_length": 128      ← Should be > 0
  },
  "database": {
    "status": "connected",        ← Should be "connected"
    "readyState": 1               ← Should be 1
  }
}
```

## ✅ Step 3: Verify Environment Variables

### Check if they're set:
```bash
vercel env ls
```

You should see:
- `MONGODB_URI` (for Production)
- `JWT_SECRET` (for Production)

### If missing, add them:

**MONGODB_URI:**
```bash
vercel env add MONGODB_URI production
# Paste: mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**JWT_SECRET:**
```bash
vercel env add JWT_SECRET production
# Paste: 236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc
```

## ✅ Step 4: REDEPLOY After Setting Variables

**CRITICAL:** After setting environment variables, you MUST redeploy:

```bash
vercel --prod
```

**Why?** Environment variables are only applied when you deploy!

## ✅ Step 5: Check MongoDB Atlas

1. **Is cluster running?**
   - Go to MongoDB Atlas
   - Check if cluster is **running** (not paused)
   - If paused → Resume it

2. **Network Access:**
   - Go to **Network Access**
   - Make sure `0.0.0.0/0` is allowed
   - This allows Vercel to connect

## 🐛 Common Causes of 500 Error

### 1. JWT_SECRET Not Set
**Error in logs:** "JWT_SECRET is not configured"
**Fix:** Set `JWT_SECRET` in Vercel and redeploy

### 2. Database Not Connected
**Error in logs:** "Database connection error" or "MongoDB connection failed"
**Fix:** 
- Check MongoDB cluster is running
- Check Network Access allows `0.0.0.0/0`
- Verify `MONGODB_URI` is correct
- Redeploy

### 3. MONGODB_URI Not Set
**Error in logs:** "MONGODB_URI not found"
**Fix:** Set `MONGODB_URI` in Vercel and redeploy

### 4. User Doesn't Exist
**Error:** 400 error (not 500), but worth checking
**Fix:** Register a user first

## 🔄 Complete Fix Workflow

```bash
# 1. Check current env vars
vercel env ls

# 2. Set MONGODB_URI (if not set)
vercel env add MONGODB_URI production
# Paste your connection string

# 3. Set JWT_SECRET (if not set)
vercel env add JWT_SECRET production
# Paste your JWT secret

# 4. REDEPLOY (IMPORTANT!)
vercel --prod

# 5. Wait for deployment to finish

# 6. Test debug endpoint
curl https://leave-mangment-system-ashy.vercel.app/api/debug

# 7. Try login again
```

## 🧪 Test After Fix

1. **Debug endpoint:**
   ```bash
   curl https://leave-mangment-system-ashy.vercel.app/api/debug
   ```
   Should show both env vars exist and database is connected

2. **Try registration:**
   ```bash
   curl -X POST https://leave-mangment-system-ashy.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "test123"
     }'
   ```

3. **Try login:**
   - Use the frontend
   - Or test via API

## 📋 Quick Checklist

- [ ] Checked Vercel logs for actual error
- [ ] `MONGODB_URI` is set in Vercel
- [ ] `JWT_SECRET` is set in Vercel
- [ ] Redeployed after setting env vars (`vercel --prod`)
- [ ] MongoDB cluster is running (not paused)
- [ ] Network Access allows `0.0.0.0/0`
- [ ] Debug endpoint shows env vars exist
- [ ] Debug endpoint shows database is connected

## 💡 Most Likely Issue

Based on your error, the most likely causes are:

1. **Environment variables not set** → Set them and redeploy
2. **Not redeployed after setting vars** → Run `vercel --prod`
3. **Database connection failing** → Check MongoDB Atlas

**Start by checking the Vercel logs - that will tell you exactly what's wrong!**

