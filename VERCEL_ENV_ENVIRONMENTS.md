# 🎯 Vercel Environment Variables: Which Environments to Use?

## ✅ Recommended: Set for ALL Environments

**Best Practice:** Set your environment variables for **ALL environments** (Production, Preview, and Development).

## 📋 Why Set for All Environments?

### ✅ Advantages:
1. **Works everywhere** - Your app works in production AND preview deployments
2. **Easier testing** - Preview deployments can test with real database
3. **Consistency** - Same configuration across all environments
4. **Less confusion** - Don't have to remember which env vars are set where

### ⚠️ If You Only Set Production:
- Preview deployments won't work (no database connection)
- Testing pull requests won't work
- You'll get errors in preview URLs

## 🎯 Recommended Setup

When adding environment variables, select **ALL THREE**:
- ✅ **Production** - For your live app
- ✅ **Preview** - For testing/staging
- ✅ **Development** - For local development (optional, but recommended)

## 📝 How to Set for All Environments

### Via Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Enter your **Key** (e.g., `MONGODB_URI`)
4. Enter your **Value**
5. **Select ALL environments:**
   - ☑️ Production
   - ☑️ Preview  
   - ☑️ Development
6. Click **Save**

### Via Vercel CLI:

```bash
# Set for Production
vercel env add MONGODB_URI production
# Paste your value

# Set for Preview
vercel env add MONGODB_URI preview
# Paste the same value

# Set for Development (optional)
vercel env add MONGODB_URI development
# Paste the same value
```

## 🔄 Quick Setup Script

You can set all at once:

```bash
# MONGODB_URI for all environments
echo "mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" | vercel env add MONGODB_URI production
echo "mongodb+srv://gronaldchia_db_user:5GDEo6n5LUfoLbq2@cluster0.sx4w97j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" | vercel env add MONGODB_URI preview

# JWT_SECRET for all environments
echo "236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc" | vercel env add JWT_SECRET production
echo "236e806324686152d06c14fab8ab84435ebf1b65eb94aed4a97f9dba73efbc45115c40b3a9e4a1d54387c722b381a2d597ba6e6b69528ed27059b1698fca23cc" | vercel env add JWT_SECRET preview
```

## 🎯 My Recommendation

**Set for Production AND Preview** (minimum):
- ✅ Production - Your live app needs it
- ✅ Preview - Testing/staging needs it
- ⚪ Development - Optional (you have `.env` file locally)

## 📊 Environment Comparison

| Environment | When Used | Needs Env Vars? |
|-------------|-----------|-----------------|
| **Production** | Live app (`vercel --prod`) | ✅ **YES** |
| **Preview** | Testing/staging (`vercel`) | ✅ **YES** |
| **Development** | Local dev (optional) | ⚪ Optional (you have `.env`) |

## 💡 Pro Tip

**For your leave management system:**
- Set `MONGODB_URI` for **Production** and **Preview** ✅
- Set `JWT_SECRET` for **Production** and **Preview** ✅
- Development is optional since you have a local `.env` file

## ✅ Quick Answer

**Yes, set for ALL environments (or at least Production + Preview)!**

This ensures your app works everywhere and you don't get confusing errors in preview deployments.

