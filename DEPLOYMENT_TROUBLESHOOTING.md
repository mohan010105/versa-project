# Versa Deployment - Troubleshooting Guide

## 🔧 Common Issues & Solutions

---

## Issue 1: Build Fails - "npm run build exited with 126"

### Symptoms:
- Deployment fails during build phase
- Error message shows exit code 126
- Build logs show "command not found" or permission error

### Causes:
1. Missing dependencies
2. Incorrect build script
3. Environment variables not available during build
4. Node.js version mismatch

### Solutions:

**Solution 1A: Verify locally**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Solution 1B: Check package.json scripts**
```json
"scripts": {
  "build": "vite build"
}
```

**Solution 1C: Update Node.js in Vercel**
1. Go to Vercel Dashboard → Settings
2. Under "General" → "Node.js Version"
3. Set to **18.x** or **20.x**
4. Redeploy

**Solution 1D: Clear Vercel cache**
1. Go to Deployments
2. Click Settings
3. Find "Build & Deployment"
4. Click "Clear Build Cache"
5. Redeploy

---

## Issue 2: "Cannot find module" or "Module not found"

### Symptoms:
- Build succeeds locally but fails on Vercel
- Error: "Cannot find module 'firebase'" or similar
- Dependencies seem to be missing

### Causes:
1. Dependency not listed in `package.json`
2. Lock file corruption
3. Missing build command

### Solutions:

**Solution 2A: Verify dependencies exist**
```bash
# Check package.json
cat package.json | grep -A 20 "dependencies"
```

**Solution 2B: Reinstall dependencies locally**
```bash
npm install
npm ci  # Clean install
```

**Solution 2C: Commit package-lock.json**
```bash
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

**Solution 2D: Clear Vercel cache and redeploy**
1. Vercel Dashboard → Project
2. Settings → Deployment
3. "Clear Build Cache"
4. Redeploy

---

## Issue 3: 404 Errors on Page Refresh

### Symptoms:
- `/admin`, `/dashboard`, `/login` routes work when clicking links
- Page refresh shows 404 error
- SPA routing not working

### Causes:
1. Missing `vercel.json` rewrites configuration
2. `vercel.json` not in project root
3. Incorrect rewrite rules

### Solutions:

**Solution 3A: Verify vercel.json exists**
```bash
# File should be at project root
ls vercel.json
```

Content should include:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Solution 3B: Commit vercel.json**
```bash
git add vercel.json
git commit -m "Add Vercel configuration"
git push
```

**Solution 3C: Redeploy**
1. Vercel Dashboard → Deployments
2. Click "..." on latest deployment
3. Select "Redeploy"

**Solution 3D: Alternative - Check Output Directory**
1. Vercel Dashboard → Settings → Build & Deployment
2. Verify "Output Directory" is set to `dist`

---

## Issue 4: Environment Variables Not Loading

### Symptoms:
- Firebase not initializing
- `import.meta.env.VITE_FIREBASE_API_KEY` is undefined
- Console errors about missing Firebase config

### Causes:
1. Variables not added to Vercel Dashboard
2. Variables missing `VITE_` prefix
3. Variables only set for specific environment
4. Typo in variable name

### Solutions:

**Solution 4A: Verify variable names**
✅ Correct:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`

❌ Wrong:
- `FIREBASE_API_KEY` (missing VITE_ prefix)
- `VITE_API_KEY` (incomplete name)

**Solution 4B: Add variables to Vercel**
1. Vercel Dashboard → Settings → Environment Variables
2. Add each variable:
   - Key: `VITE_FIREBASE_API_KEY`
   - Value: Your actual API key
   - Environment: **All** (Production, Preview, Development)
3. Click "Save"
4. Repeat for all 6 Firebase variables

**Solution 4C: Check Vercel logs**
1. Vercel Dashboard → Deployments
2. Click on your deployment
3. Check "Build" and "Runtime" logs
4. Look for environment variable warnings

**Solution 4D: Verify code uses import.meta.env**
✅ Correct in Vite:
```javascript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
```

❌ Wrong:
```javascript
const apiKey = process.env.VITE_FIREBASE_API_KEY  // Won't work in Vite
```

**Solution 4E: Redeploy after adding variables**
1. Settings → Environment Variables (verify all added)
2. Go to Deployments
3. Click "..." on latest deployment
4. Select "Redeploy"

---

## Issue 5: Firebase Authentication Not Working

### Symptoms:
- Login/Signup page loads but doesn't authenticate
- Firebase errors in console
- Auth state not persisting after deployment

### Causes:
1. Firebase credentials incorrect
2. Firebase security rules blocking requests
3. CORS issues
4. Authenticated domain not added

### Solutions:

**Solution 5A: Verify Firebase credentials**
1. Firebase Console → Project Settings
2. Copy firebaseConfig from your Web App
3. Verify credentials match Vercel environment variables
4. Compare character-by-character

**Solution 5B: Add Vercel domain to Firebase**
1. Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add your Vercel domain:
   - Example: `versa-123abc.vercel.app`
5. Also add: `localhost:3000` (for local development)
6. Click "Save"

**Solution 5C: Check Firebase Security Rules**
1. Firebase Console → Firestore Database → Rules
2. Verify rules allow authenticated users:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. If modified, click "Publish"

**Solution 5D: Check browser console for errors**
1. Open Vercel app in browser
2. Press F12 → Console tab
3. Look for Firebase error messages
4. Note the specific error and search [Firebase docs](https://firebase.google.com/docs)

**Solution 5E: Clear browser cache**
```
Ctrl+Shift+Delete → Clear all cookies and cached images/files
```

---

## Issue 6: Image Upload Not Working

### Symptoms:
- File upload form loads but doesn't upload
- No error message displayed
- Image doesn't appear after upload

### Causes:
1. Firebase Storage security rules blocking upload
2. Wrong storage bucket in config
3. User not authenticated
4. File size too large

### Solutions:

**Solution 6A: Check Storage Rules**
1. Firebase Console → Storage → Rules
2. Verify rules allow uploads:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /submissions/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click "Publish" if changes made

**Solution 6B: Verify Storage Bucket**
1. Firebase Console → Project Settings
2. Copy `storageBucket` from config
3. Verify it matches `VITE_FIREBASE_STORAGE_BUCKET` in Vercel

**Solution 6C: Test with authenticated user**
1. Login first before attempting upload
2. Check auth state in console:
```javascript
import { getAuth } from 'firebase/auth'
const auth = getAuth()
console.log(auth.currentUser)
```

**Solution 6D: Check file size**
- Limit file size to 5MB
- Add validation in form

**Solution 6E: Check browser console**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for Firebase Storage error messages
4. Check Network tab for failed uploads

---

## Issue 7: "Cannot find Firebase configuration"

### Symptoms:
- Error: "Configuration object missing"
- Firebase module loads but can't initialize
- App shows blank page

### Causes:
1. Environment variables not loaded
2. Variable names incorrect
3. FirebaseConfig.js has syntax error

### Solutions:

**Solution 7A: Check FirebaseConfig.js**
```javascript
// Should look like this:
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
```

**Solution 7B: Verify all variables added**
1. Vercel Dashboard → Settings → Environment Variables
2. Count total variables added (should be 6)
3. Verify each has `VITE_` prefix
4. Verify environment is set to "All"

**Solution 7C: Check variable values**
1. In browser console, run:
```javascript
Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
```

2. Should show 6 variables with non-empty values

**Solution 7D: Rebuild locally**
```bash
npm run build
npm run preview
```

Test in preview environment before pushing

---

## Issue 8: Slow Build Times

### Symptoms:
- Build takes longer than 5 minutes
- Timeout errors (builds take >15 minutes)
- Deployment keeps getting canceled

### Solutions:

**Solution 8A: Clear build cache**
1. Vercel Dashboard → Settings
2. "Build & Deployment" section
3. Click "Clear Build Cache"
4. Redeploy

**Solution 8B: Optimize dependencies**
```bash
# Remove unused packages
npm prune

# Update to latest
npm update
```

**Solution 8C: Check for large files**
```bash
# Find large files in src
find src -type f -exec ls -lh {} \; | sort -k5 -hr | head -10
```

Remove or optimize large files (images, videos, etc.)

---

## 🔍 Debug Checklist

Before seeking help, verify:

- [ ] `vercel.json` exists in project root
- [ ] `.gitignore` includes `.env` and `.env.local`
- [ ] All 6 `VITE_FIREBASE_*` variables added to Vercel
- [ ] Build succeeds locally: `npm run build`
- [ ] Preview works locally: `npm run preview`
- [ ] All routes work with page refresh locally
- [ ] Vercel domain added to Firebase authorized domains
- [ ] Node.js version set to 18.x or 20.x
- [ ] Latest deployment logs checked for errors
- [ ] Browser cache cleared in production

---

## 📞 Getting More Help

If issue persists:

1. **Check Vercel Logs:**
   - Deployment → Click on deployment → View logs
   - Check Build, Runtime, and Function logs

2. **Check Firebase Logs:**
   - Firebase Console → Authentication → Sign-in method
   - Check for blocked requests

3. **Enable Debug Mode:**
   ```bash
   # Redeploy with debug flag
   vercel deploy --debug
   ```

4. **Community Support:**
   - Vercel Discord: https://discord.gg/vercel
   - Firebase Support: https://firebase.google.com/support
   - React Router Issues: https://github.com/remix-run/react-router

---

**Still stuck? Check the main deployment guide: `VERCEL_DEPLOYMENT_GUIDE.md`**
