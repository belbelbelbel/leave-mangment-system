# 🔧 Fix 500 Error on Login

You're getting a 500 Internal Server Error. Let's fix it step by step.

## 🔍 Step 1: Check Vercel Logs

The logs will show the exact error. Do this:

1. Go to: https://vercel.com/dashboard
2. Click on your project: "leave-mangment-system"
3. Click on **"Logs"** tab (or **"Functions"** tab)
4. Look for the latest error
5. Copy the error message

**OR use CLI:**
```bash
# Get your deployment URL first
vercel ls

# Then check logs (replace with your actual deployment URL)
vercel logs https://your-deployment-url.vercel.app
```

## ✅ Step 2: Most Common Causes

### 1. Database Not Connected
**Error in logs:** "Database connection error" or "MongoDB connection failed"

**Fix:**
- Check MongoDB Atlas - is cluster running?
- Check Network Access - allow `0.0.0.0/0`
- Verify `MONGODB_URI` in Vercel env vars
- Redeploy: `vercel --prod`

### 2. JWT_SECRET Not Set
**Error in logs:** "JWT_SECRET is not configured"

**Fix:**
```bash
vercel env add JWT_SECRET production
# Paste your JWT secret
vercel --prod
```

### 3. Environment Variables Not Applied
**Problem:** Set env vars but didn't redeploy

**Fix:**
```bash
vercel --prod
```

## 🧪 Step 3: Test Debug Endpoint

Check if everything is configured:

```bash
curl https://your-app.vercel.app/api/debug
```

Should show:
- `mongodb_uri_exists: true`
- `jwt_secret_exists: true`
- `database.status: "connected"`

## 🔄 Step 4: Complete Fix Workflow

```bash
# 1. Verify env vars are set
vercel env ls

# 2. If missing, add them
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production

# 3. REDEPLOY (critical!)
vercel --prod

# 4. Wait for deployment

# 5. Test
curl https://your-app.vercel.app/api/debug
```

## 📋 Quick Checklist

- [ ] Checked Vercel logs for actual error
- [ ] MongoDB cluster is running (not paused)
- [ ] Network Access allows `0.0.0.0/0`
- [ ] `MONGODB_URI` is set in Vercel
- [ ] `JWT_SECRET` is set in Vercel
- [ ] Redeployed after setting env vars
- [ ] Debug endpoint shows database connected

## 💡 Next Steps

1. **Check the Vercel logs** - This will tell you exactly what's wrong
2. **Share the error message** from the logs
3. **I'll help you fix it** based on the specific error

The logs are the key - they'll show the exact problem!

