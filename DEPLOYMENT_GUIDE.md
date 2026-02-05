# Deployment Guide - Briefly Blog Platform

This guide will help you deploy your Briefly blog platform with:
- **Frontend** on Vercel
- **Backend** on Render
- **Database** on Supabase (already configured)

---

## 📋 Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. Render account (sign up at https://render.com)
4. Supabase account (already have it)

---

## 🚀 Step 1: Prepare Your Code

### 1.1 Update .gitignore
Make sure these files are in your `.gitignore`:
```
node_modules/
dist/
.env
.env.local
.env.production
```

### 1.2 Create Environment Variable Templates
- Copy `.env.example` files (already created)
- **DO NOT** commit actual `.env` files with secrets

---

## 🗄️ Step 2: Backend Deployment on Render

### 2.1 Push Code to GitHub
```bash
cd C:\Users\ptalekar\source\repos\Briefly
git init
git add .
git commit -m "Initial commit for deployment"
git remote add origin https://github.com/YOUR_USERNAME/briefly-blog.git
git push -u origin main
```

### 2.2 Create New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `briefly-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: Free (or paid for better performance)

**Environment Variables** (Click "Advanced" → "Add Environment Variable"):
```
PORT=5000
NODE_ENV=production
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_KEY=<your-supabase-service-key>
JWT_SECRET=<generate-a-strong-random-string>
```

**To generate JWT_SECRET:**
```bash
# In terminal/PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL: `https://briefly-backend.onrender.com`

### 2.3 Update CORS Settings

After deployment, you'll need to update CORS in `backend/src/server.ts`:

**Current:**
```typescript
app.use(cors());
```

**Update to:**
```typescript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://your-frontend-app.vercel.app',  // Add after frontend deployment
    ],
    credentials: true
}));
```

---

## 🌐 Step 3: Frontend Deployment on Vercel

### 3.1 Create Environment File

Create `frontend/.env.production`:
```
VITE_API_BASE_URL=https://briefly-backend.onrender.com/api
```

Commit this change:
```bash
git add frontend/.env.production
git commit -m "Add production environment config"
git push
```

### 3.2 Deploy to Vercel

**Option A: Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://briefly-backend.onrender.com/api
   ```

5. Click **"Deploy"**

**Option B: Using Vercel CLI**
```bash
npm install -g vercel
cd frontend
vercel
# Follow prompts
```

### 3.3 Get Your Frontend URL
After deployment, Vercel will give you a URL like:
`https://briefly-blog-xyz123.vercel.app`

---

## 🔄 Step 4: Update Backend CORS

Now that you have your frontend URL, update backend CORS:

1. Edit `backend/src/server.ts`:
```typescript
app.use(cors({
    origin: [
        'http://localhost:5173',  // For local development
        'https://briefly-blog-xyz123.vercel.app',  // Your actual Vercel URL
    ],
    credentials: true
}));
```

2. Commit and push:
```bash
git add backend/src/server.ts
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy your backend.

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend
Visit: `https://briefly-backend.onrender.com/api/health`
Should return: `{"success": true, "message": "Server is healthy"}`

### 5.2 Test Frontend
1. Open: `https://briefly-blog-xyz123.vercel.app`
2. Test these features:
   - ✅ Homepage loads
   - ✅ Blog posts display
   - ✅ Category filtering works
   - ✅ User registration
   - ✅ User login
   - ✅ Create blog post
   - ✅ Like/comment functionality

---

## 🔧 Step 6: Post-Deployment Configuration

### 6.1 Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `briefly.com`)
3. Configure DNS with your domain provider

**Render:**
1. Go to Service Settings → Custom Domain
2. Add your domain (e.g., `api.briefly.com`)
3. Configure DNS

### 6.2 Environment Variables Management

**To update environment variables:**

**Render:**
1. Dashboard → Your Service → Environment
2. Update variables
3. Service will auto-redeploy

**Vercel:**
1. Project Settings → Environment Variables
2. Update variables
3. Redeploy to apply changes

---

## 🐛 Common Issues & Solutions

### Issue 1: "Network Error" in Frontend
**Solution**: Check VITE_API_BASE_URL is correct
```bash
# In frontend directory
cat .env.production
# Should show: VITE_API_BASE_URL=https://briefly-backend.onrender.com/api
```

### Issue 2: CORS Errors
**Solution**: Ensure backend CORS includes your Vercel URL
```typescript
origin: ['https://your-actual-vercel-url.vercel.app']
```

### Issue 3: Backend Won't Start on Render
**Solution**: Check build logs for errors
- Verify all environment variables are set
- Check `package.json` scripts are correct
- Ensure `PORT` is not hardcoded (use `process.env.PORT`)

### Issue 4: 401 Unauthorized Errors
**Solution**: Check JWT_SECRET matches between local and production

### Issue 5: Database Connection Errors
**Solution**: Verify Supabase credentials in Render environment variables

---

## 📊 Monitoring & Logs

### Render Logs
```
Dashboard → Your Service → Logs
```
View real-time server logs

### Vercel Logs
```
Project → Deployments → Click deployment → View Function Logs
```

---

## 🔄 Future Deployments

### Auto-Deployment (Recommended)

**Both Vercel and Render support auto-deployment:**
- Push to `main` branch → Auto-deploys to production
- Push to `dev` branch → Create preview deployments

**Setup:**
1. **Render**: Already enabled by default
2. **Vercel**: Already enabled by default

### Manual Deployment

**Render:**
```
Dashboard → Service → Manual Deploy → Deploy Latest Commit
```

**Vercel:**
```bash
cd frontend
vercel --prod
```

---

## 💰 Cost Considerations

### Free Tier Limits

**Render Free Tier:**
- ✅ 750 hours/month
- ❌ Sleeps after 15 min inactivity (cold starts)
- ✅ Good for testing/demo

**Vercel Free Tier:**
- ✅ Unlimited bandwidth
- ✅ 100 GB-hours/month
- ✅ No cold starts
- ✅ Perfect for frontend

**Upgrade Considerations:**
- If backend cold starts are an issue → Upgrade Render ($7/mo)
- For custom domain and better analytics → Keep Vercel free or upgrade

---

## 🎯 Quick Checklist

Before going live:

- [ ] All environment variables set on Render
- [ ] All environment variables set on Vercel
- [ ] CORS configured with production URLs
- [ ] Database (Supabase) is accessible from Render
- [ ] JWT_SECRET is strong and secure
- [ ] Test all features on production
- [ ] Check mobile responsiveness
- [ ] Test admin panel access
- [ ] Verify stock ticker works
- [ ] Test file uploads (if any)

---

## 📞 Need Help?

**Render Support**: https://render.com/docs
**Vercel Support**: https://vercel.com/docs
**Supabase Support**: https://supabase.com/docs

---

## 🎉 You're Live!

Your blog is now accessible worldwide:
- **Frontend**: https://briefly-blog-xyz123.vercel.app
- **Backend**: https://briefly-backend.onrender.com
- **Admin Panel**: https://briefly-blog-xyz123.vercel.app/admin

Share your blog and start writing! 🚀
