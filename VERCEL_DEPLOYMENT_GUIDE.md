# Versa - Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

- [x] Project is a Vite + React application
- [x] Firebase environment variables are configured with `VITE_` prefix
- [x] `.env` and `.env.local` files are in `.gitignore`
- [x] `vercel.json` is configured with proper rewrites for client-side routing
- [x] Build command: `npm run build`
- [x] Output directory: `dist`
- [x] Node.js 18.x compatibility verified

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Prepare Your Local Project

**1.1 Verify the build works locally:**
```bash
npm install
npm run build
```

**1.2 Test the production build locally:**
```bash
npm run preview
```

Visit `http://localhost:4173` and test:
- Login page loads
- Signup page loads
- Reset Password page loads
- Client-side routing works (try navigating to `/admin`, `/dashboard`, etc.)

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

**Verify:**
- ✅ All files pushed (except `.env` files - they should NOT be in the repository)
- ✅ `vercel.json` is committed
- ✅ `.gitignore` includes `.env` and `.env.local`

---

## 🔗 Step 3: Connect to Vercel

### 3.1 Create a Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Authorize Vercel to access your GitHub repositories

### 3.2 Import Your Project
1. Click **"New Project"**
2. Select **GitHub** as the source
3. Search for `mohan010105/versa` repository
4. Click **"Import"**

---

## ⚙️ Step 4: Configure Build Settings

Vercel should **auto-detect Vite framework**. Verify settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x |

✅ Vercel will use `vercel.json` for additional configuration

---

## 🔐 Step 5: Configure Environment Variables

### 5.1 Add Environment Variables in Vercel Dashboard

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following variables for **all environments** (Production, Preview, Development):

```
VITE_FIREBASE_API_KEY = [your_firebase_api_key]
VITE_FIREBASE_AUTH_DOMAIN = [your_firebase_auth_domain]
VITE_FIREBASE_PROJECT_ID = [your_firebase_project_id]
VITE_FIREBASE_STORAGE_BUCKET = [your_firebase_storage_bucket]
VITE_FIREBASE_MESSAGING_SENDER_ID = [your_firebase_messaging_sender_id]
VITE_FIREBASE_APP_ID = [your_firebase_app_id]
```

### 5.2 Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your Versa project
3. Click **⚙️ Project Settings**
4. Go to **"Your apps"** section
5. Click on your web app
6. Copy the Firebase configuration object

**Example Firebase Config:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "versa-project.firebaseapp.com",
  projectId: "versa-project",
  storageBucket: "versa-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### 5.3 Add Variables to Vercel
- Add each value individually with the **VITE_** prefix
- Select **All** environments for each variable
- Click **"Save"**

---

## 🚀 Step 6: Deploy

### 6.1 Trigger Deployment
1. Click the **"Deploy"** button
2. Vercel will:
   - Clone your repository
   - Run `npm install`
   - Run `npm run build`
   - Deploy to the `dist` folder

### 6.2 Monitor Build Process
- Watch the **Deployment** tab for build progress
- Build should complete in **1-2 minutes**
- Once complete, you'll get a deployment URL

### 6.3 Test Your Deployment
Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Navigation to `/auth/login` works
- ✅ Navigation to `/auth/signup` works
- ✅ Navigation to `/auth/reset-password` works
- ✅ Page refresh doesn't return 404 (client-side routing works)
- ✅ Firebase authentication works
- ✅ Role-based routing works (admin vs user)
- ✅ Image upload works

---

## 🔥 Important: Vercel Rewrites Configuration

The `vercel.json` file includes this critical configuration:

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

**What this does:**
- Routes all requests to `index.html`
- Enables React Router to handle client-side routing
- Prevents 404 errors on page refresh for routes like `/admin`, `/dashboard`, etc.

---

## 🔒 Security Best Practices

✅ **DO:**
- ✅ Store environment variables in Vercel dashboard only
- ✅ Use `VITE_` prefix for all client-side Firebase variables
- ✅ Keep `.env` files in `.gitignore`
- ✅ Use `import.meta.env.VITE_*` in code to access variables
- ✅ Never commit `.env.local` to Git

❌ **DON'T:**
- ❌ Hardcode Firebase credentials in code
- ❌ Commit `.env` or `.env.local` to GitHub
- ❌ Use `process.env` for Vite projects (use `import.meta.env` instead)
- ❌ Share your `.env.local` file with others

---

## 🐛 Common Deployment Issues & Fixes

### Issue 1: Build Fails with "npm run build exited with 126"

**Cause:** Missing dependencies or build script issues

**Fix:**
```bash
# Clean and reinstall locally
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 2: "Cannot find module" errors after deployment

**Cause:** Environment variables not set in Vercel

**Fix:**
1. Go to Vercel Settings → Environment Variables
2. Verify all `VITE_*` variables are added
3. Redeploy (Settings → Deployments → Redeploy)

### Issue 3: 404 Errors on page refresh for `/admin`, `/dashboard`, etc.

**Cause:** Client-side routing not configured

**Fix:**
- ✅ Already fixed in `vercel.json` with rewrites
- If issue persists, verify `vercel.json` is in project root
- Redeploy after updating `vercel.json`

### Issue 4: Firebase Auth not working after deployment

**Cause:** Firebase security rules or CORS configuration

**Fix:**
1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to **Authorized domains:**
   - Example: `versa-123abc.vercel.app`
3. Also add domain for local testing: `localhost:3000`

### Issue 5: Image Upload Not Working

**Cause:** Firebase Storage security rules or CORS

**Fix:**
1. Go to Firebase Console → Storage → Rules
2. Ensure rules allow authenticated users to upload:
   ```
   match /submissions/{document=**} {
     allow read, write: if request.auth != null;
   }
   ```
3. Verify CORS configuration in Firebase (if needed for browser uploads)

### Issue 6: "Cannot find Firebase configuration"

**Cause:** Incorrect environment variable names

**Fix:**
- Variables MUST start with `VITE_`
- Vite only exposes variables with `VITE_` prefix
- Verify in code: `import.meta.env.VITE_FIREBASE_API_KEY`

---

## 🔄 Continuous Deployment (CD)

After initial setup, Vercel automatically redeploys when you push to GitHub:

1. **Push to main branch:**
   ```bash
   git push origin main
   ```

2. **Automatic deployment:**
   - Vercel detects the push
   - Runs build automatically
   - Deploys new version

3. **Monitor deployments:**
   - Go to Vercel dashboard
   - View "Deployments" tab
   - Each push creates a new deployment

---

## 📊 Performance & Analytics

### Monitor Your Deployment
1. Go to Vercel Dashboard → Your Project
2. View:
   - **Analytics:** Traffic, performance metrics
   - **Function Logs:** Any serverless function errors
   - **Deployments:** All past deployments

### Enable Vercel Analytics (Optional)
1. Click **Settings** → **Analytics**
2. Enable **Web Analytics**
3. View real-time performance data

---

## ✅ Final Verification Checklist

After deployment, verify:

- [ ] Website loads at Vercel URL
- [ ] All pages accessible (login, signup, reset-password, admin, dashboard)
- [ ] Page refresh doesn't cause 404 errors
- [ ] Firebase Auth works (login/signup)
- [ ] Profile image upload works
- [ ] Admin/User role-based routing works
- [ ] Environment variables loaded correctly
- [ ] Console shows no errors
- [ ] Firestore reads/writes work correctly
- [ ] Storage file uploads work correctly

---

## 🎯 Production URL

After deployment, your Versa app will be available at:

```
https://versa-[random-id].vercel.app
```

You can:
- **Set custom domain:** Settings → Domains
- **Preview deployments:** Get URL for each push to GitHub
- **Rollback:** Revert to any previous deployment instantly

---

## 📞 Support & Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev
- **Firebase Docs:** https://firebase.google.com/docs
- **React Router Docs:** https://reactrouter.com

---

## ✨ Next Steps

1. ✅ Commit `vercel.json` and updated `.gitignore`
2. ✅ Push to GitHub
3. ✅ Import project in Vercel
4. ✅ Add environment variables
5. ✅ Deploy and test
6. ✅ Monitor performance

**You're ready to deploy! 🚀**
