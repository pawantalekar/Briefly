# Quick Deployment Steps

## 🚀 Quick Start (5 Minutes)

### 1. Push to GitHub
```bash
cd C:\Users\ptalekar\source\repos\Briefly
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/briefly.git
git push -u origin main
```

### 2. Deploy Backend (Render)
1. Go to https://dashboard.render.com/select-repo
2. Select your GitHub repo
3. Choose `backend` folder
4. Add environment variables:
   - `SUPABASE_URL`: (from your Supabase dashboard)
   - `SUPABASE_ANON_KEY`: (from your Supabase dashboard)
   - `SUPABASE_SERVICE_KEY`: (from your Supabase dashboard)
   - `JWT_SECRET`: (generate random: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `FRONTEND_URL`: (will add after frontend deployment)
5. Click Deploy
6. **Copy your backend URL** (e.g., https://briefly-backend.onrender.com)

### 3. Deploy Frontend (Vercel)
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://briefly-backend.onrender.com/api`
5. Click Deploy
6. **Copy your frontend URL** (e.g., https://briefly.vercel.app)

### 4. Update Backend CORS
1. Go back to Render dashboard
2. Add environment variable:
   - `FRONTEND_URL`: `https://briefly.vercel.app`
3. Render will auto-redeploy

### 5. Test Your App
Visit: `https://briefly.vercel.app`

---

## 📝 Environment Variables Needed

### Backend (Render)
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_KEY`
- ✅ `JWT_SECRET`
- ✅ `FRONTEND_URL`
- ✅ `NODE_ENV=production` (auto-set)
- ✅ `PORT=5000` (auto-set)

### Frontend (Vercel)
- ✅ `VITE_API_BASE_URL`

---

## 🔍 Where to Find Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_KEY`

---

## ⚠️ Important Notes

1. **Free Tier Limits:**
   - Render: Backend sleeps after 15 min of inactivity (cold start ~30s)
   - Vercel: No sleep, unlimited deployments

2. **First Load:**
   - First request to backend after sleep takes 20-30 seconds
   - Subsequent requests are fast

3. **Auto-Deploy:**
   - Push to `main` branch = auto-deploy to production
   - Both Vercel and Render watch your repo

4. **Logs:**
   - Render logs: Dashboard → Service → Logs
   - Vercel logs: Dashboard → Project → Deployments

---

## 🎯 Checklist

Before sharing your app:
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Can register new user
- [ ] Can login
- [ ] Can create blog post
- [ ] Can view blog posts
- [ ] Categories work
- [ ] Admin panel accessible
- [ ] Mobile responsive

---

## 🆘 Quick Fixes

**Backend not working?**
```bash
# Check logs in Render dashboard
# Verify all environment variables are set
```

**Frontend can't connect to backend?**
```bash
# Check VITE_API_BASE_URL is correct
# Check CORS is configured (FRONTEND_URL in Render)
```

**Database errors?**
```bash
# Verify Supabase credentials in Render
# Check Supabase project is active
```

---

For detailed guide, see **DEPLOYMENT_GUIDE.md**
