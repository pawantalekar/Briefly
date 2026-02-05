# 📁 GitHub Commit Guide - What to Commit and What Not

## ✅ FILES TO COMMIT (Safe to Push)

### Root Directory
```
✅ README.md
✅ DEPLOYMENT_GUIDE.md
✅ QUICK_DEPLOY.md
✅ GITHUB_COMMIT_GUIDE.md
✅ .gitignore
```

### Backend Directory (`backend/`)
```
✅ src/                              (All TypeScript source code)
   ✅ server.ts
   ✅ config/
      ✅ config.ts
      ✅ supabaseClient.ts
   ✅ middlewares/
   ✅ modules/
      ✅ auth/
      ✅ blog/
      ✅ category/
      ✅ comment/
      ✅ like/
      ✅ tag/
      ✅ admin/
   ✅ routes/
   ✅ shared/
   
✅ package.json
✅ package-lock.json
✅ tsconfig.json
✅ .env.example              (⚠️ WITHOUT real secrets)
✅ .gitignore
✅ render.yaml
```

### Frontend Directory (`frontend/`)
```
✅ src/                              (All React source code)
   ✅ components/
   ✅ pages/
   ✅ services/
   ✅ types/
   ✅ utils/
   ✅ App.tsx
   ✅ main.tsx
   ✅ index.css
   
✅ public/                           (Static assets)
✅ index.html
✅ package.json
✅ package-lock.json
✅ tsconfig.json
✅ tsconfig.app.json
✅ tsconfig.node.json
✅ vite.config.ts
✅ tailwind.config.js
✅ postcss.config.js
✅ eslint.config.js
✅ .env.example              (⚠️ WITHOUT real API URLs)
✅ .env.production           (⚠️ Can commit if using placeholder)
✅ .gitignore
✅ vercel.json
```

---

## ❌ FILES NOT TO COMMIT (Dangerous/Unnecessary)

### 🔴 CRITICAL - Never Commit These (Security Risk)
```
❌ .env                      (Backend - Contains Supabase credentials & JWT secret)
❌ .env.local                (Frontend - May contain API keys)
❌ .env.development          (Development secrets)
❌ backend/.env              (Contains SUPABASE_SERVICE_KEY, JWT_SECRET)
❌ frontend/.env             (Contains local API URLs)
```

**Why?** These files contain:
- Database credentials (SUPABASE_URL, SUPABASE_SERVICE_KEY)
- JWT secret keys
- API keys
- Anyone with these can access/modify your database!

### 📦 Build Artifacts (Auto-generated)
```
❌ node_modules/             (Dependencies - 100MB+, reinstall with npm install)
❌ backend/dist/             (Compiled JavaScript from TypeScript)
❌ frontend/dist/            (Production build output)
❌ backend/build/            (Alternative build folder)
❌ frontend/build/           (Alternative build folder)
```

**Why?** 
- Too large (node_modules can be 100-500MB)
- Generated automatically during deployment
- Can cause conflicts between different OS/versions

### 📝 Logs & Cache
```
❌ *.log                     (npm-debug.log, error.log, etc.)
❌ logs/                     (Log directory)
❌ .npm/                     (npm cache)
❌ .cache/                   (Various cache files)
❌ .parcel-cache/           (Parcel bundler cache)
❌ .vite/                    (Vite cache)
```

### 🖥️ IDE & OS Files
```
❌ .DS_Store                 (macOS finder settings)
❌ Thumbs.db                 (Windows thumbnail cache)
❌ .vscode/                  (VS Code workspace settings - optional)
❌ .idea/                    (WebStorm/IntelliJ settings)
❌ *.swp                     (Vim swap files)
❌ *.suo, *.user             (Visual Studio files)
```

### 🔧 TypeScript Build Info
```
❌ *.tsbuildinfo             (TypeScript incremental build cache)
```

---

## 🔍 How to Check What Will Be Committed

### Before First Commit
```bash
cd C:\Users\ptalekar\source\repos\Briefly

# See what will be committed
git status

# See ignored files (should NOT appear in commit)
git status --ignored
```

### Verify Critical Files Are Ignored
```bash
# These commands should return "NOT found" or no results
git ls-files | grep "\.env$"
git ls-files | grep "node_modules"
git ls-files | grep "dist/"
```

---

## 🛡️ Safety Checklist Before Pushing

Run these commands to verify:

```bash
# 1. Check .env files are NOT being tracked
git ls-files | findstr /I "\.env"
# ✅ Should ONLY show: .env.example

# 2. Check node_modules is NOT being tracked
git ls-files | findstr /I "node_modules"
# ✅ Should show NOTHING

# 3. Check dist folders are NOT being tracked
git ls-files | findstr /I "\\dist\\"
# ✅ Should show NOTHING

# 4. See what WILL be committed
git status
```

---

## 📋 Complete Commit Commands

### Initial Setup
```bash
cd C:\Users\ptalekar\source\repos\Briefly

# Initialize git (if not done)
git init

# Add all safe files
git add .

# Check what's being added (IMPORTANT!)
git status

# If you see .env files or node_modules, STOP and fix .gitignore
# Then run: git reset
```

### Verify Before Commit
```powershell
# List all files that will be committed
git diff --cached --name-only

# Should NOT include:
# - .env
# - node_modules/
# - dist/
# - *.log
```

### Safe Commit & Push
```bash
# Commit
git commit -m "Initial commit: Briefly blog platform ready for deployment"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/briefly.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🚨 If You Accidentally Committed Secrets

### Remove .env from Git (but keep local file)
```bash
# Stop tracking .env
git rm --cached .env
git rm --cached backend/.env
git rm --cached frontend/.env

# Commit the removal
git commit -m "Remove .env files from tracking"

# Push
git push
```

### If Secrets Were Already Pushed to GitHub
⚠️ **CRITICAL - Take These Steps IMMEDIATELY:**

1. **Rotate ALL credentials:**
   - Generate new JWT_SECRET
   - Reset Supabase service_role key (if exposed)
   - Change any API keys

2. **Update your deployed apps:**
   - Update environment variables on Render
   - Update environment variables on Vercel

3. **Remove from Git history:**
   ```bash
   # Use BFG Repo Cleaner or git filter-branch
   # See: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
   ```

---

## 📊 What Your Git Repository Should Look Like

### File Structure (git ls-files)
```
README.md
DEPLOYMENT_GUIDE.md
QUICK_DEPLOY.md
backend/.env.example
backend/.gitignore
backend/package.json
backend/render.yaml
backend/src/server.ts
backend/src/config/config.ts
backend/src/modules/auth/...
backend/tsconfig.json
frontend/.env.example
frontend/.gitignore
frontend/package.json
frontend/public/...
frontend/src/App.tsx
frontend/src/components/...
frontend/src/pages/...
frontend/vercel.json
frontend/vite.config.ts
```

### Total Files: ~100-150 files
### Total Size: ~5-15 MB (without node_modules)

---

## ✅ Final Pre-Push Checklist

- [ ] `.gitignore` files are in place (root, backend, frontend)
- [ ] `.env` files are NOT in `git status`
- [ ] `node_modules/` is NOT in `git status`
- [ ] `dist/` folders are NOT in `git status`
- [ ] `.env.example` files ARE in `git status` (templates only)
- [ ] All source code (`.ts`, `.tsx`) IS in `git status`
- [ ] `package.json` files ARE in `git status`
- [ ] Config files (tsconfig, vite.config, etc.) ARE in `git status`
- [ ] README and deployment guides ARE in `git status`
- [ ] No log files (*.log) in `git status`

---

## 🎯 Quick Reference

### ✅ Safe to Commit
- All `.ts` and `.tsx` source files
- `package.json` and `package-lock.json`
- Config files (tsconfig, vite.config, etc.)
- `.env.example` (templates without real secrets)
- Documentation (README, guides)
- `.gitignore` files

### ❌ Never Commit
- `.env` (real secrets)
- `node_modules/` (dependencies)
- `dist/` or `build/` (compiled output)
- `*.log` (log files)
- OS-specific files (.DS_Store, Thumbs.db)

---

## 📞 Need Help?

**Verify your .gitignore is working:**
```bash
git check-ignore -v node_modules/
git check-ignore -v .env
# Should show which .gitignore rule is ignoring them
```

**See what's ignored:**
```bash
git status --ignored
```

**List only tracked files:**
```bash
git ls-files
```

---

## 🎉 You're Ready!

Once verified, your code is safe to push to GitHub and will work perfectly with Vercel and Render deployments!
