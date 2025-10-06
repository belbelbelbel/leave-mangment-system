# Vercel Deployment Guide for Leave Management System

## Overview
Your Node.js Express application has been successfully restructured for Vercel's serverless architecture. Here's everything you need to deploy it.

## What We've Done

✅ **Project Structure**: Moved Express app to [`/api/index.js`](api/index.js:1) with serverless-http wrapper
✅ **Dependencies**: Added [`serverless-http`](package.json:22) for Vercel compatibility  
✅ **Database**: Updated to use [`MONGODB_URI`](.env:2) environment variable
✅ **Configuration**: Created [`vercel.json`](vercel.json:1) with proper routing
✅ **Routes**: All routes work under `/api` prefix (tested locally)

## Step-by-Step Deployment Instructions

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate with your GitHub, GitLab, or email.

### Step 3: Prepare Your Project
Ensure your project has these files:
- [`api/index.js`](api/index.js:1) - Main serverless function
- [`vercel.json`](vercel.json:1) - Deployment configuration
- [`package.json`](package.json:1) - Dependencies including serverless-http
- All your route files in `/routes` folder
- All your model files in `/models` folder
- Frontend files in `/frontend` folder

### Step 4: Set Environment Variables in Vercel

**Option A: Via Vercel CLI (Recommended)**
```bash
# Navigate to your project directory
cd /path/to/leave-mangment-system

# Add environment variables
vercel env add MONGODB_URI
# Paste your MongoDB connection string: mongodb+srv://obiriezechidiebere:Dh7xiOGpiK4QJAdW@cluster0.jtfrplb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

vercel env add JWT_SECRET
# Paste your JWT secret: 236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc
```

**Option B: Via Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project after deployment
3. Go to Settings → Environment Variables
4. Add:
   - `MONGODB_URI` = `mongodb+srv://obiriezechidiebere:Dh7xiOGpiK4QJAdW@cluster0.jtfrplb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET` = `236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc`

### Step 5: Deploy to Vercel
```bash
# Initial deployment
vercel

# For production deployment
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → Select your account
- **Link to existing project?** → N (for first deployment)
- **Project name?** → leave-management-system (or your preferred name)
- **Directory location?** → ./ (current directory)
- **Override settings?** → N

### Step 6: Verify Deployment

After deployment, Vercel will provide you with URLs:
- **Preview URL**: `https://leave-management-system-xxx.vercel.app`
- **Production URL**: `https://leave-management-system.vercel.app` (after `vercel --prod`)

## Testing Your Deployed API

### Test Endpoints:
1. **API Health Check**: `https://your-app.vercel.app/api`
2. **Auth Endpoints**: `https://your-app.vercel.app/api/auth`
3. **User Endpoints**: `https://your-app.vercel.app/api/users`
4. **Leave Endpoints**: `https://your-app.vercel.app/api/leaves`
5. **Frontend**: `https://your-app.vercel.app/`

### Example API Test:
```bash
# Test API health check
curl https://your-app.vercel.app/api

# Expected response:
{
  "message": "Leave Management System API is running",
  "timestamp": "2025-01-06T18:30:00.000Z",
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

## Project Structure After Deployment

```
your-project/
├── api/
│   └── index.js          # Main serverless function
├── routes/               # Your existing route files
├── models/               # Your existing model files
├── controllers/          # Your existing controller files
├── middleware/           # Your existing middleware files
├── config/               # Database configuration
├── frontend/             # Your frontend files
├── vercel.json          # Vercel configuration
├── package.json         # Dependencies
└── .env                 # Local environment variables (not deployed)
```

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Working**
   - Verify variables are set in Vercel dashboard
   - Redeploy after adding variables: `vercel --prod`

2. **Database Connection Issues**
   - Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Verify [`MONGODB_URI`](.env:2) is correctly set

3. **API Routes Not Working**
   - Check [`vercel.json`](vercel.json:1) routing configuration
   - Ensure all routes use `/api` prefix

4. **Frontend Not Loading**
   - Verify frontend files are in `/frontend` directory
   - Check [`vercel.json`](vercel.json:1) static file routing

### Logs and Debugging:
```bash
# View deployment logs
vercel logs

# View function logs (replace with your function URL)
vercel logs https://your-app.vercel.app
```

## Next Steps After Deployment

1. **Custom Domain** (Optional):
   ```bash
   vercel domains add your-domain.com
   ```

2. **Automatic Deployments**:
   - Connect your GitHub repository for automatic deployments
   - Every push to main branch will trigger a new deployment

3. **Monitoring**:
   - Use Vercel Analytics for performance monitoring
   - Set up error tracking with services like Sentry

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT token signing secret | Your secure random string |

## Support

If you encounter any issues:
1. Check Vercel's function logs: `vercel logs`
2. Verify environment variables in Vercel dashboard
3. Test API endpoints individually
4. Check MongoDB Atlas connection settings

Your Leave Management System is now ready for production on Vercel! 🚀