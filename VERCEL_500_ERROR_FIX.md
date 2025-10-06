# 🔧 Fix for Vercel 500 Server Error - Leave Management System
## The Problem

You're getting a 500 server error during signup/signin operations. This indicates the API routing is working (404 is fixed), but there's an internal server error, likely related to:

1. **Missing environment variables**
2. **MongoDB connection issues**
3. **Model initialization problems in serverless environment**

## ✅ Fixes Applied

### 1. Enhanced Error Handling in [`api/index.js`](api/index.js:1)
- Added explicit model imports to ensure Mongoose schemas are registered
- Improved database connection error messages
- Added debug endpoints for troubleshooting

### 2. Debug Endpoints Added
- `GET /api/` - Shows environment variable status
- `GET /api/debug` - Detailed debugging information

## 🚀 Step-by-Step Fix Process

### Step 1: Check Environment Variables in Vercel

**Via Vercel Dashboard:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables if missing:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://obiriezechidiebere:Dh7xiOGpiK4QJAdW@cluster0.jtfrplb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc` |

**Via Vercel CLI:**
```bash
vercel env add MONGODB_URI production
# Paste the MongoDB URI when prompted

vercel env add JWT_SECRET production  
# Paste the JWT secret when prompted
```

### Step 2: Redeploy with Environment Variables
```bash
# Redeploy to ensure environment variables are loaded
vercel --prod
```

### Step 3: Test Debug Endpoints

After redeployment, test these URLs to identify the issue:

**1. Basic Health Check:**
```bash
curl https://your-app.vercel.app/api/
```

Expected response should show:
```json
{
  "message": "Leave Management System API is running",
  "environment": {
    "mongodb_uri_exists": true,
    "jwt_secret_exists": true,
    "node_env": "production"
  }
}
```

**2. Detailed Debug Info:**
```bash
curl https://your-app.vercel.app/api/debug
```

Expected response:
```json
{
  "message": "Debug information",
  "environment_variables": {
    "MONGODB_URI": "Set",
    "JWT_SECRET": "Set"
  },
  "mongoose_connection": {
    "ready_state": 1,
    "states": {
      "1": "connected"
    }
  }
}
```

### Step 4: Check MongoDB Atlas Settings

**IP Whitelist:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Network Access**
3. Ensure you have `0.0.0.0/0` (Allow access from anywhere) or add Vercel's IP ranges

**Database User:**
1. Go to **Database Access**
2. Ensure the user `obiriezechidiebere` exists and has proper permissions
3. Verify the password matches what's in your connection string

### Step 5: Test Auth Endpoints

After environment variables are set and MongoDB is accessible:

**Test Registration:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123",
    "role": "Employee"
  }'
```

**Test Login:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔍 Debugging Steps if Still Getting 500 Error

### 1. Check Vercel Function Logs
```bash
vercel logs --prod
```

### 2. Common Error Patterns and Solutions

| Error Message | Cause | Solution |
|---------------|--------|----------|
| `MongoNetworkError` | MongoDB connection failed | Check Atlas IP whitelist and connection string |
| `JsonWebTokenError: invalid signature` | Wrong JWT_SECRET | Verify JWT_SECRET matches between local and Vercel |
| `ValidationError` | Missing required fields | Check request body format |
| `Cannot read properties of undefined` | Missing environment variables | Set environment variables in Vercel |

### 3. Test Individual Components

**Test MongoDB Connection:**
```bash
# Should show connection status
curl https://your-app.vercel.app/api/debug
```

**Test JWT Token Generation:**
```bash
# Register should return a token
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

## 📋 Environment Variables Checklist

Make sure these are set in Vercel:

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] Environment variables are set for **Production** environment
- [ ] Redeployed after setting environment variables

## 🛠 MongoDB Atlas Checklist

- [ ] Database user exists with correct password
- [ ] IP whitelist includes `0.0.0.0/0` or Vercel IPs
- [ ] Database cluster is running and accessible
- [ ] Connection string is correct and includes database name

## 🚨 If All Else Fails

**Check Vercel Function Logs:**
```bash
vercel logs https://your-app.vercel.app/api/auth/register --prod
```

**Test with Curl Verbose:**
```bash
curl -v -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"123456"}'
```

The 500 error should be resolved after setting the environment variables correctly! 🎉

## Summary

Most 500 errors in this setup are caused by:
1. **Missing `MONGODB_URI` or `JWT_SECRET`** (90% of cases)
2. **MongoDB Atlas IP restrictions** 
3. **Incorrect environment variable names**

The debug endpoints will help you identify exactly which component is failing.