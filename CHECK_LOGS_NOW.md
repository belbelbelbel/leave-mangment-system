# 🔍 Check Vercel Logs to Find the Error

The 500 error means something is failing on the server. Here's how to find out what:

## Method 1: Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/dashboard
2. **Click:** Your project "leave-mangment-system"
3. **Click:** "Logs" tab (or "Functions" tab)
4. **Look for:** Red error messages
5. **Copy:** The error message and share it

## Method 2: Vercel CLI

```bash
# List deployments
vercel ls

# Check logs for a specific deployment
# (Replace URL with your actual deployment URL)
vercel logs https://leave-mangment-system-xxx.vercel.app
```

## What to Look For:

Common errors you might see:

1. **"Database connection error"** or **"MongoDB connection failed"**
   → Database not connected

2. **"JWT_SECRET is not configured"**
   → JWT_SECRET not set

3. **"querySrv EREFUSED"**
   → MongoDB cluster is paused or network issue

4. **"MongoServerError"**
   → Database operation failed

## After Finding the Error:

1. **Share the error message** with me
2. **I'll help you fix it** based on the specific error

## Quick Fixes to Try:

### If Database Error:
```bash
# Check MongoDB Atlas - is cluster running?
# Check Network Access - allow 0.0.0.0/0
# Redeploy
vercel --prod
```

### If JWT_SECRET Error:
```bash
vercel env add JWT_SECRET production
# Paste your JWT secret
vercel --prod
```

## Next Step:

**Check the Vercel logs and share the error message!** That will tell us exactly what's wrong.

