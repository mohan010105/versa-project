# Versa Project — Setup Checklist

Follow this checklist to get the project fully running locally and ready to deploy.

## Pre-Setup
- [ ] Clone/download the project
- [ ] Open terminal in project root: `d:\Projects\versa\versa-project`

## Step 1: Install Dependencies
```bash
npm install
```
- [ ] Command completes without errors
- [ ] `node_modules/` folder created (~500MB)

## Step 2: Firebase Project Setup

### 2.1 Create Firebase Project
- [ ] Visit [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Click "Add Project" → name it "Versa" → create

### 2.2 Get Firebase Config
- [ ] In Firebase Console: **Project Settings** (⚙️ icon top-left)
- [ ] Scroll to "Your apps" section
- [ ] Click "Web" app icon
- [ ] Copy the config object (apiKey, authDomain, projectId, etc.)

### 2.3 Create `.env.local`
- [ ] In project root, create file `.env.local`
- [ ] Copy content from `.env.local.example`
- [ ] Paste Firebase credentials:
  ```env
  VITE_FIREBASE_API_KEY=your_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  ```
- [ ] Save file (do NOT commit to git)

## Step 3: Firebase Authentication Setup

- [ ] In Firebase Console: **Authentication** tab
- [ ] Click "Get Started"
- [ ] Select "Email/Password" → enable → save
- [ ] All other methods can stay disabled for now

## Step 4: Firestore Database Setup

- [ ] In Firebase Console: **Firestore Database** tab
- [ ] Click "Create Database"
- [ ] Choose region (closest to you)
- [ ] Start in **Test mode** (we'll lock it down later)
- [ ] Create database
- [ ] Once created, click **+ Create collection**
  - Collection ID: `submissions`
  - Document ID: Auto-generate (leave blank) → click next
  - No fields needed → save

## Step 5: Cloud Storage Setup

- [ ] In Firebase Console: **Cloud Storage** tab
- [ ] Click "Get Started"
- [ ] Choose region (same as Firestore)
- [ ] Start in **Test mode**
- [ ] Create bucket

## Step 6: Apply Security Rules (Important!)

### Firestore Rules
- [ ] Go to Firestore → **Rules** tab
- [ ] Clear default rules
- [ ] Paste content from `FIRESTORE_RULES.txt`
- [ ] Click "Publish"

### Storage Rules
- [ ] Go to Cloud Storage → **Rules** tab
- [ ] Clear default rules
- [ ] Paste content from `STORAGE_RULES.txt`
- [ ] Click "Publish"

## Step 7: Run Locally

```bash
npm run dev
```
- [ ] Terminal shows: `Local: http://localhost:5173`
- [ ] Browser opens (or manually navigate to that URL)

## Step 8: Test Full Flow

1. **Signup Page**
   - [ ] Click "Create Account"
   - [ ] Fill in: Name, Email, Password
   - [ ] Upload profile image (optional)
   - [ ] Password strength bar shows 3+ colors
   - [ ] Click submit
   - [ ] Success animation appears
   - [ ] Redirects to login after 2 seconds

2. **Login Page**
   - [ ] Email & password auto-filled
   - [ ] Click "Sign in"
   - [ ] Success → Redirects to `/collector`

3. **Collector Page** (`/collector`)
   - [ ] Page loads with form
   - [ ] Location auto-detects (may ask permission)
   - [ ] Fill in description, upload image
   - [ ] Click submit
   - [ ] Success animation + redirects to admin

4. **Admin Dashboard** (`/admin`)
   - [ ] Shows "Submissions" heading with count
   - [ ] Your submission appears as a card
   - [ ] Click card → detail view opens
   - [ ] Click "← Back" → returns to grid
   - [ ] Click "Logout" → returns to login

5. **Reset Password**
   - [ ] Go to `/auth/reset`
   - [ ] Enter your email
   - [ ] Click submit
   - [ ] Confirmation card shows
   - [ ] Email sent to inbox (check spam)

## Step 9: Verify Firebase Integration

In Firebase Console:
- [ ] Authentication → Users shows your test account
- [ ] Firestore → submissions collection has your submission doc
- [ ] Storage → submissions folder has your image file

## Step 10: Production Build

```bash
npm run build
```
- [ ] Builds without errors
- [ ] Creates `dist/` folder (~1MB gzipped)

## Step 11: Deploy to Vercel

### Option A: Via GitHub
1. [ ] Push to GitHub: `git push origin main`
2. [ ] Visit [vercel.com](https://vercel.com)
3. [ ] Click "New Project" → Import repo
4. [ ] Select project → continue
5. [ ] Add environment variables:
   - [ ] `VITE_FIREBASE_API_KEY`
   - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
   - [ ] `VITE_FIREBASE_PROJECT_ID`
   - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
   - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - [ ] `VITE_FIREBASE_APP_ID`
6. [ ] Click "Deploy"
7. [ ] Wait ~2 min for deployment
8. [ ] Live URL provided (e.g., `https://versa.vercel.app`)

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```
- [ ] Follow prompts to deploy

## Step 12: Test Live App

- [ ] Visit your Vercel URL
- [ ] Signup with a new email
- [ ] Submit a profile
- [ ] View in admin dashboard
- [ ] Logout & login again

## Troubleshooting

**"Firebase is not defined"**
- [ ] Check `.env.local` exists with correct keys
- [ ] Restart dev server: `npm run dev`

**Geolocation not working**
- [ ] Requires HTTPS (works on Vercel, not localhost)
- [ ] User must grant permission
- [ ] Can manually enter location as fallback

**Tailwind styles missing**
- [ ] Clear cache: `rm -rf .next dist .vite`
- [ ] Reinstall: `npm install`
- [ ] Restart dev server

**Firestore rules error**
- [ ] Check rules don't have typos
- [ ] Switch to Test mode temporarily to debug
- [ ] Verify collection name is exactly `submissions`

**Image upload fails**
- [ ] Check Storage rules are deployed
- [ ] Verify Firebase Storage bucket exists
- [ ] Try with smaller image (<5MB)

## Final Checklist

- [ ] All env vars set correctly
- [ ] Firebase Auth, Firestore, Storage all enabled
- [ ] Security rules deployed
- [ ] Local dev server works
- [ ] Can signup → submit → view admin → logout → login
- [ ] Build succeeds
- [ ] Deployed to Vercel
- [ ] Live URL accessible and functional

## You're Done! 🎉

Your Versa project is now:
- ✅ Running locally
- ✅ Connected to Firebase
- ✅ Deployed to Vercel
- ✅ Ready for internship review

---

**Questions?** Check README.md for more details.
