# Vercel Deployment Readiness Checklist

**Project:** Versa (React + Vite + Firebase)  
**Date:** January 31, 2026  
**Purpose:** Ensure all components are properly configured before pushing to production  

---

## ✅ Phase 1: Pre-Deployment (Local Verification)

### Code Quality
- [ ] No console errors in development (`npm run dev`)
- [ ] No console warnings related to Firebase
- [ ] Build completes successfully (`npm run build`)
- [ ] No build errors or warnings related to dependencies
- [ ] ESLint passes (`npm run lint` - optional but recommended)

### Environment Configuration
- [ ] `.env.local` file exists in project root
- [ ] `.env.local` is in `.gitignore` (not committed to GitHub)
- [ ] All 6 Firebase variables present in `.env.local`:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
- [ ] All variable values are correct (copied from Firebase Console)
- [ ] No spaces, quotes, or line breaks in variable values

### Local Testing
- [ ] Authentication works:
  - [ ] Sign up creates new user
  - [ ] Login with existing account works
  - [ ] Logout clears authentication
  - [ ] Password reset flow works
- [ ] Protected routes work:
  - [ ] Non-authenticated users redirected to login
  - [ ] Authenticated users can access dashboard
  - [ ] Admin users can access admin panel
- [ ] Database operations work:
  - [ ] User data saved to Firestore
  - [ ] User data retrieves from Firestore
  - [ ] Data displays correctly in UI
- [ ] File uploads work:
  - [ ] Profile image uploads to Storage
  - [ ] Uploaded image displays immediately
  - [ ] File persists across sessions
- [ ] Role-based access works:
  - [ ] Regular users see user dashboard
  - [ ] Admin users see admin dashboard
  - [ ] Redirect happens based on role

### Diagnostic Tools
- [ ] Run diagnostic script: `node verify-firebase-config.js`
- [ ] Script shows all variables configured correctly
- [ ] Script shows no warnings or errors

---

## 📤 Phase 2: GitHub Repository Check

### Git Configuration
- [ ] `.gitignore` includes `.env.local`
- [ ] `.gitignore` includes `node_modules/`
- [ ] `.gitignore` includes `dist/`
- [ ] No `.env.local` file in git history (`git log --all -- .env.local` returns nothing)

### Code Quality
- [ ] All code is committed to `main` branch
- [ ] No uncommitted changes (`git status` is clean)
- [ ] No untracked files that should be committed
- [ ] README.md exists and is up to date
- [ ] package.json is correct

### Git History
- [ ] Meaningful commit messages (not "wip", "fix", etc)
- [ ] No sensitive data in commit history (API keys, passwords)
- [ ] No large files committed (> 50MB)
- [ ] No binary files unnecessarily committed

---

## 🔧 Phase 3: Vercel Project Setup

### Project Connection
- [ ] Vercel project connected to GitHub repository
- [ ] Correct GitHub account selected
- [ ] Correct repository selected
- [ ] Deploy on push is enabled

### Build Configuration
- [ ] Framework: Set to "Vite"
- [ ] Build command: Set to `npm run build` or `vite build`
- [ ] Output directory: Set to `dist`
- [ ] Install command: Set to `npm install` (default)
- [ ] Development command: Not needed (deployment-only)

### Environment Variables
- [ ] All 6 Firebase variables added to Vercel:
  - [ ] `VITE_FIREBASE_API_KEY` = (from Firebase Console)
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN` = (from Firebase Console)
  - [ ] `VITE_FIREBASE_PROJECT_ID` = (from Firebase Console)
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET` = (from Firebase Console)
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` = (from Firebase Console)
  - [ ] `VITE_FIREBASE_APP_ID` = (from Firebase Console)
- [ ] Each variable environment set to "All" (not just Production)
- [ ] No spaces or quotes in variable values
- [ ] All values match Firebase Console exactly

### Vercel Configuration File
- [ ] `vercel.json` exists in project root
- [ ] Contains correct `buildCommand`: `npm run build`
- [ ] Contains correct `outputDirectory`: `dist`
- [ ] Contains correct `framework`: `vite`
- [ ] Rewrites configured for SPA (single-page app):
  ```json
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
  ```

---

## 🔐 Phase 4: Firebase Project Verification

### Firebase Console
- [ ] Firebase project exists and is active
- [ ] Project status shows "OK" (not disabled or deleted)
- [ ] Web app is registered in the project
- [ ] Authentication enabled (Email/Password at minimum)
- [ ] Firestore Database enabled
- [ ] Cloud Storage enabled

### API Key Restrictions
- [ ] Go to Project Settings → Keys and Certificates
- [ ] Find your Web API key
- [ ] **API Restrictions** set to "Web API"
- [ ] **Application Restrictions**:
  - [ ] Restriction type: HTTP referrers (Websites)
  - [ ] Domains: Include your Vercel domain (e.g., `versa-project.vercel.app`)
  - [ ] Domains: Include `localhost` (for local testing)

### Security Rules
- [ ] Firestore Security Rules configured:
  - [ ] Authenticated users can read their own data
  - [ ] Authenticated users can write their own data
  - [ ] Admin users can read/write all data
  - [ ] Rules match your app's logic
- [ ] Storage Security Rules configured:
  - [ ] Authenticated users can upload files
  - [ ] Users can only delete their own files
  - [ ] Files are readable (check your requirements)

---

## 🚀 Phase 5: Pre-Deployment Final Checks

### 24 Hours Before Deployment
- [ ] Tested all features locally
- [ ] All team members aware of deployment
- [ ] Have rollback plan if needed (can redeploy previous commit)
- [ ] Firebase project backup/export (optional but recommended)

### 1 Hour Before Deployment
- [ ] Latest code pushed to GitHub main branch
- [ ] All tests passing locally
- [ ] All environment variables verified in Vercel
- [ ] Browser DevTools closed (won't interfere)
- [ ] Have Firefox or another browser ready for testing

### Just Before Clicking Deploy
- [ ] `.env.local` NOT in git
- [ ] All 6 Firebase variables in Vercel
- [ ] Build configuration correct
- [ ] Vercel project healthy (no pending deployments)

---

## 🚀 Phase 6: Deployment Process

### Initial Deployment
- [ ] Create new GitHub release or tag (optional)
- [ ] Push to main branch: `git push origin main`
- [ ] **OR** Trigger redeploy from Vercel Deployments if variables just added
- [ ] Watch Vercel build logs
- [ ] Wait for "Deployment Complete" message

### Build Verification
- [ ] Build logs show no critical errors
- [ ] Build logs show Firebase variables loaded (check Environment section)
- [ ] Build time reasonable (usually 1-3 minutes)
- [ ] No warnings about missing dependencies
- [ ] No warnings about undefined variables

---

## ✅ Phase 7: Post-Deployment Testing

### Immediate (First 5 minutes)
- [ ] Vercel deployment URL loads without errors
- [ ] No red errors in browser DevTools console
- [ ] Page layout renders correctly
- [ ] Images load (if any)
- [ ] Navigation works (links clickable)

### Authentication Testing
- [ ] Open in incognito/private mode (bypass cache)
- [ ] Navigate to `/auth/login`
- [ ] Login form renders correctly
- [ ] Try signing in:
  - [ ] Invalid email shows error
  - [ ] Correct credentials = login successful
  - [ ] Redirect to dashboard happens
- [ ] Navigate to `/auth/signup`
- [ ] Try signing up:
  - [ ] Validation works
  - [ ] Email already exists = error
  - [ ] New account creation = successful
  - [ ] Auto-login happens
  - [ ] Redirect based on role works

### Role-Based Access Testing
- [ ] Regular user:
  - [ ] Can access `/dashboard`
  - [ ] Cannot access `/admin`
  - [ ] Redirected away from `/admin`
- [ ] Admin user:
  - [ ] Can access `/admin`
  - [ ] Can access `/dashboard`
  - [ ] Admin panel loads correctly

### Data Operations Testing
- [ ] User data displays:
  - [ ] Profile information shows correctly
  - [ ] Data matches what's in Firestore
- [ ] User data can be updated:
  - [ ] Edit profile functionality works
  - [ ] Changes saved to Firestore
  - [ ] Changes display immediately
- [ ] File uploads work:
  - [ ] Can select file
  - [ ] Upload completes
  - [ ] File appears in UI
  - [ ] File persists on refresh

### Browser Compatibility Testing
- [ ] Chrome/Edge: Works
- [ ] Firefox: Works
- [ ] Safari (if available): Works
- [ ] Mobile browser: Works
- [ ] Responsive design works at different breakpoints

### Network Testing
- [ ] Works on fast connection
- [ ] Works on slow 3G (DevTools → Network → Slow 3G)
- [ ] Works on offline + online transition
- [ ] Error messages display for failed requests

---

## 🔍 Phase 8: Monitoring & Analytics

### Error Monitoring
- [ ] Setup error logging (Sentry, LogRocket, etc. - optional but recommended)
- [ ] No JavaScript errors in console
- [ ] No 4xx or 5xx HTTP errors
- [ ] Firebase errors cleared (no auth/invalid-api-key)

### Performance Monitoring
- [ ] Page loads in < 3 seconds
- [ ] Authentication happens in < 2 seconds
- [ ] File uploads show progress feedback
- [ ] No UI freezing or lag

### User Feedback
- [ ] Share deployment URL with stakeholders
- [ ] Collect feedback on functionality
- [ ] Test with actual use cases
- [ ] Document any issues found

---

## 🆘 Phase 9: Issue Resolution

### If Seeing `auth/invalid-api-key` Error
- [ ] Check Vercel Environment Variables (all 6 present? set to "All"?)
- [ ] Check build logs for variable warnings
- [ ] Clear browser cache or test in incognito mode
- [ ] Verify Firebase credentials in Vercel match Firebase Console
- [ ] Redeploy again if variables were just added
- [ ] See [FIREBASE_DEPLOYMENT_FIX.md](FIREBASE_DEPLOYMENT_FIX.md)

### If Seeing Other Errors
1. **Check browser console** for error message
2. **Check Vercel build logs** for build errors
3. **Compare to local development** (does it happen locally?)
4. **Read related documentation**:
   - Authentication issues → [AUTH_README.md](AUTH_README.md)
   - Database issues → Check Firestore Security Rules
   - Storage issues → Check Storage Security Rules
5. **Search documentation** for the error message

### If Deployment Fails
1. Check Vercel build logs for specific error
2. Ensure all environment variables are present
3. Ensure package.json dependencies are correct
4. Try redeploy
5. If still failing, rollback: Deploy previous commit

---

## 📋 Final Verification Checklist

Before considering deployment complete:

- [ ] All auth flows tested end-to-end
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] All user roles can access appropriate areas
- [ ] File uploads tested
- [ ] No Firebase errors in console
- [ ] No build warnings
- [ ] Responsive design works
- [ ] Navigation works
- [ ] Logout works
- [ ] Tested in incognito/private mode
- [ ] Monitored for 24 hours without issues

---

## 📞 Deployment Support

### Quick Links
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com)
- [Vercel Deployments Guide](https://vercel.com/docs/concepts/deployments/overview)
- [FIREBASE_DEPLOYMENT_FIX.md](FIREBASE_DEPLOYMENT_FIX.md) - If auth/invalid-api-key error

### Rollback Procedure (If Needed)
1. Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click "..." menu → "Redeploy"
4. Previous version will be live within 1-2 minutes

### Get Help
1. Check [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md)
2. Check Vercel build logs (Deployments → Latest → View Build Logs)
3. Check Firebase Console for project status
4. Check browser DevTools console for error messages

---

## 🎯 Success Criteria

Deployment is **SUCCESSFUL** when:

✅ Application loads on Vercel domain  
✅ No Firebase errors in console  
✅ Can sign up with new account  
✅ Can login with existing account  
✅ Can access protected routes  
✅ Role-based access works  
✅ Database operations work  
✅ File uploads work  
✅ No build warnings  
✅ 24-hour stability confirmed  

---

## 📝 Post-Deployment Handoff

After deployment is complete and verified:

- [ ] Document deployment date and time
- [ ] Note any issues encountered and how they were resolved
- [ ] Save deployment URL for reference
- [ ] Share Vercel project access with team if needed
- [ ] Archive this checklist with deployment notes
- [ ] Brief next developer on deployment process

---

**Checklist Version:** 1.0  
**Last Updated:** January 31, 2026  
**Status:** Ready for use  
**Deployment Date:** _______________  
**Deployed By:** _______________  
**Notes:** _______________________________________________
