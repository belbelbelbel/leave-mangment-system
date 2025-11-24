# 🚀 Deploy to Vercel - Step by Step

Now that you're logged in, follow these steps:

## Step 1: Set Environment Variables

### Set MONGODB_URI:
```bash
vercel env add MONGODB_URI production
```
When prompted, paste:
```
mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Set JWT_SECRET:
```bash
vercel env add JWT_SECRET production
```
When prompted, paste:
```
236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc
```

### Also set for Preview (recommended):
```bash
vercel env add MONGODB_URI preview
# Paste the same MONGODB_URI

vercel env add JWT_SECRET preview
# Paste the same JWT_SECRET
```

## Step 2: Deploy to Production

After setting environment variables, deploy:

```bash
vercel --prod
```

This will:
- Build your application
- Deploy to production
- Apply the environment variables
- Give you a production URL

## Step 3: Test Your Deployment

After deployment completes, test:

```bash
# Check debug endpoint
curl https://your-app.vercel.app/api/debug

# Should show:
# - mongodb_uri_exists: true
# - jwt_secret_exists: true
# - database.status: "connected"
```

## That's it! 🎉

Your app should now be working on Vercel!

