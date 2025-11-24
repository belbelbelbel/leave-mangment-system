# 🚀 Vercel Deployment Commands Explained

## What is `vercel --prod`?

`vercel --prod` is a command that **deploys your application to production** on Vercel.

## 📋 Common Vercel Commands

### 1. `vercel` (or `vercel --preview`)
- Deploys to a **preview/staging** environment
- Creates a temporary URL for testing
- Good for testing before production
- Example URL: `https://your-app-git-branch-username.vercel.app`

### 2. `vercel --prod` (Production Deployment)
- Deploys to **production**
- Uses your main production URL
- Example URL: `https://your-app.vercel.app`
- **This is what you want for your live app!**

### 3. `vercel env ls`
- Lists all environment variables
- Shows what's set for Production, Preview, and Development

### 4. `vercel logs --prod`
- Shows logs from your production deployment
- Useful for debugging errors

## 🎯 When to Use `vercel --prod`

Use `vercel --prod` when you want to:
- ✅ Deploy your app to production
- ✅ Make changes live
- ✅ Update environment variables (must redeploy after setting them)
- ✅ Push code changes to production

## 📝 Step-by-Step: Deploying to Production

### First Time Setup:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```
   - This will open your browser
   - Authorize Vercel CLI

3. **Navigate to your project**:
   ```bash
   cd /Users/macbookpro/Desktop/leave-mangment-system
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### What Happens When You Run `vercel --prod`:

1. Vercel reads your project files
2. Builds your application
3. Uploads to Vercel servers
4. Sets up your production environment
5. Gives you a production URL

### After Setting Environment Variables:

**IMPORTANT:** After setting environment variables, you MUST redeploy:

```bash
vercel --prod
```

Why? Because environment variables are only applied when you deploy!

## 🔄 Typical Workflow

```bash
# 1. Set environment variables
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production

# 2. Deploy to production (this applies the env vars)
vercel --prod

# 3. Test your app
curl https://your-app.vercel.app/api/debug
```

## 🆚 Preview vs Production

| Command | Environment | URL Type | When to Use |
|---------|-------------|----------|-------------|
| `vercel` | Preview | Temporary URL | Testing changes |
| `vercel --prod` | Production | Main URL | Live app |

## 💡 Pro Tips

1. **Always redeploy after setting env vars:**
   ```bash
   vercel env add MONGODB_URI production
   vercel --prod  # ← Don't forget this!
   ```

2. **Check your deployment:**
   ```bash
   vercel ls  # Lists all deployments
   ```

3. **View logs if something breaks:**
   ```bash
   vercel logs --prod
   ```

## 🐛 Common Issues

### "Command not found: vercel"
**Solution:** Install Vercel CLI
```bash
npm install -g vercel
```

### "Not authenticated"
**Solution:** Login first
```bash
vercel login
```

### Environment variables not working
**Solution:** Redeploy after setting them
```bash
vercel --prod
```

## 📚 Summary

- `vercel --prod` = Deploy to production
- Use it after setting environment variables
- Use it when you want to update your live app
- It's the command that makes your changes go live!

