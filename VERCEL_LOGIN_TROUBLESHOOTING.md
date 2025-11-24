# 🔧 Vercel Login Troubleshooting Guide

If login works locally but fails on Vercel, follow these steps:

## 🔍 Step 1: Check Debug Endpoint

First, check if your environment variables and database connection are working:

```bash
curl https://your-app.vercel.app/api/debug
```

**What to look for:**
- ✅ `mongodb_uri_exists: true`
- ✅ `jwt_secret_exists: true`
- ✅ `database.status: "connected"`
- ✅ `database.user_count: > 0` (if you have users)

**If database status is "disconnected":**
- MongoDB connection string might be wrong
- MongoDB cluster might be paused
- Network access might not be configured

## 🔍 Step 2: Check Vercel Logs

Check your Vercel function logs for errors:

```bash
vercel logs --prod
```

Or in Vercel Dashboard:
1. Go to your project
2. Click on "Functions" tab
3. Click on a recent deployment
4. Check the logs for errors

**Look for:**
- Database connection errors
- Authentication errors
- JWT secret errors

## 🔍 Step 3: Verify Environment Variables

Make sure environment variables are set correctly in Vercel:

### Via CLI:
```bash
vercel env ls
```

### Via Dashboard:
1. Go to Settings → Environment Variables
2. Verify both `MONGODB_URI` and `JWT_SECRET` are set
3. Make sure they're set for **Production** environment

## 🔍 Step 4: Most Common Issue - User Doesn't Exist

**The Problem:** Your user exists in your local database, but NOT in the database that Vercel is connecting to.

**The Solution:** You need to register/create the user in the Vercel database.

### Option A: Register via API
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your-email@example.com",
    "password": "your-password",
    "role": "Admin"
  }'
```

### Option B: Use the Frontend
1. Go to: `https://your-app.vercel.app/pages/auth/register.html`
2. Register a new user
3. Then try logging in

## 🔍 Step 5: Check MongoDB Connection

Verify your MongoDB cluster is:
1. **Running** (not paused) in MongoDB Atlas
2. **Network Access** allows `0.0.0.0/0` (or Vercel's IPs)
3. **Connection string** is correct in Vercel environment variables

## 🔍 Step 6: Test Login Endpoint Directly

Test the login endpoint directly to see the exact error:

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

**Expected response (success):**
```json
{
  "message": "Login successful",
  "token": "...",
  "role": "Admin",
  "user": {...}
}
```

**If you get an error, check:**
- Error message
- Status code
- Vercel logs for more details

## 🔍 Step 7: Verify Database Connection in Vercel

The debug endpoint now shows database status. Check:

```bash
curl https://your-app.vercel.app/api/debug | jq .database
```

**If `status` is not "connected":**
1. Check MongoDB Atlas - is cluster running?
2. Check Network Access - is `0.0.0.0/0` allowed?
3. Verify `MONGODB_URI` in Vercel environment variables
4. Redeploy after fixing: `vercel --prod`

## ✅ Quick Checklist

- [ ] Environment variables set in Vercel (`MONGODB_URI`, `JWT_SECRET`)
- [ ] MongoDB cluster is running (not paused)
- [ ] Network Access allows `0.0.0.0/0` in MongoDB Atlas
- [ ] User exists in the database (register if needed)
- [ ] Debug endpoint shows database is connected
- [ ] Redeployed after setting environment variables

## 🐛 Common Error Messages

### "Invalid email or password"
- User doesn't exist in database → Register the user
- Wrong password → Check password
- Database not connected → Check MongoDB connection

### "Database connection error"
- MongoDB cluster is paused → Resume it
- Network access not configured → Add `0.0.0.0/0` in Atlas
- Wrong connection string → Verify `MONGODB_URI` in Vercel

### "Server error during login"
- Check Vercel logs for detailed error
- Usually a database connection issue
- Or JWT_SECRET not set correctly

## 🚀 After Fixing

1. **Redeploy:**
   ```bash
   vercel --prod
   ```

2. **Test again:**
   - Try logging in via frontend
   - Or test API directly with curl

3. **Check logs:**
   ```bash
   vercel logs --prod
   ```

## 📝 Summary

Most likely causes:
1. **User doesn't exist** in Vercel's database → Register the user
2. **Database not connected** → Check MongoDB Atlas and network access
3. **Environment variables not set** → Set them in Vercel and redeploy

The debug endpoint (`/api/debug`) will help you identify which issue it is!

