# Firebase Deployment - Visual Walkthrough Guide

> **For:** Users who prefer step-by-step visual instructions
> **Includes:** Screenshots descriptions, button locations, expected outputs
> **Time:** 15 minutes with screenshots

---

## 📍 Navigation Map

```
START HERE
    ↓
STEP 1: Firebase Console (Get Credentials)
    ↓
STEP 2: Vercel Dashboard (Add Variables)
    ↓
STEP 3: Trigger Redeploy
    ↓
STEP 4: Verify Build Logs
    ↓
STEP 5: Test in Production
    ↓
SUCCESS! 🎉
```

---

## STEP 1️⃣: GET FIREBASE CREDENTIALS

### 1.1 Open Firebase Console

**URL:** [https://console.firebase.google.com](https://console.firebase.google.com)

**Expected Screen:**
```
╔═══════════════════════════════════════════════════════════╗
│  Google Cloud Console / Firebase                          │
├───────────────────────────────────────────────────────────┤
│  [Your Projects]                                          │
│  ├─ Versa Project     [Select this]                      │
│  ├─ Other Project                                        │
│  └─ ...                                                  │
└───────────────────────────────────────────────────────────┘
```

**Action:** Click on your Firebase project name

---

### 1.2 Click Project Settings

**Location:** Top right corner (⚙️ gear icon)

**Expected Screen:**
```
┌─────────────────────────────────────────┐
│ ⚙️ MENU                                  │
├─────────────────────────────────────────┤
│ Project Settings ← CLICK HERE            │
│ Service Accounts                        │
│ Billing                                 │
└─────────────────────────────────────────┘
```

**Action:** Click "Project Settings"

---

### 1.3 Find Your Apps

**Expected Screen After Click:**
```
┌─────────────────────────────────────────┐
│ Project Settings                         │
├─────────────────────────────────────────┤
│ Tabs:                                   │
│ [General] [Your Apps] ← CLICK HERE     │
│                                         │
│ Apps in this project:                   │
│ ├─ Versa Web App (web)  [Select]       │
│ └─ iOS App                             │
└─────────────────────────────────────────┘
```

**Action:** Click "Your Apps" tab if not already selected

---

### 1.4 Locate Firebase Config

**Expected Screen:**
```
┌─────────────────────────────────────────────────────────┐
│ Versa Web App - Firebase SDK snippet                    │
├─────────────────────────────────────────────────────────┤
│ <script type="module">                                  │
│   import { initializeApp } from                         │
│     "https://www.gstatic.com/firebasejs/9.0.0..."     │
│                                                         │
│   const firebaseConfig = {                             │
│     apiKey: "AIzaSyD...",        ← COPY THIS           │
│     authDomain: "versa...firebase...",                 │
│     projectId: "versa-proj",                           │
│     storageBucket: "versa...appspot.com",              │
│     messagingSenderId: "12345678",                     │
│     appId: "1:12345678:web:abcd1234"                   │
│   }                                                     │
│ </script>                                              │
└─────────────────────────────────────────────────────────┘
```

**Action:** Copy each value from the `firebaseConfig` object:

**Copy These 6 Values:**
```
1. apiKey
2. authDomain  
3. projectId
4. storageBucket
5. messagingSenderId
6. appId
```

**Save them somewhere temporary** (notepad, phone notes, etc.)

---

## STEP 2️⃣: ADD TO VERCEL DASHBOARD

### 2.1 Open Vercel Dashboard

**URL:** [https://vercel.com/dashboard](https://vercel.com/dashboard)

**Expected Screen:**
```
┌──────────────────────────────────────────┐
│ Vercel Dashboard                         │
├──────────────────────────────────────────┤
│ Recent Deployments:                      │
│ ├─ versa-project (main branch)          │
│ │   Status: Ready                       │
│ │   Last deployed: 2 hours ago          │
│ └─ [other projects]                     │
└──────────────────────────────────────────┘
```

**Action:** Click on your "Versa Project" name

---

### 2.2 Go to Settings

**Location:** Top navigation bar

**Expected Screen:**
```
┌────────────────────────────────────────┐
│ versa-project                          │
├────────────────────────────────────────┤
│ [Overview] [Deployments] [Settings] ← |
│                                        │
└────────────────────────────────────────┘
```

**Action:** Click "Settings" tab

---

### 2.3 Open Environment Variables

**Location:** Left sidebar menu

**Expected Screen:**
```
Left Sidebar:
├─ General
├─ Git
├─ Domains
├─ Environment Variables ← CLICK HERE
├─ Functions
├─ Analytics
└─ ...
```

**Action:** Click "Environment Variables"

---

### 2.4 See Environment Variables Page

**Expected Screen:**
```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables                                   │
├─────────────────────────────────────────────────────────┤
│ Name        Value           Environment      Actions    │
│                                                         │
│ (empty - if first time)                                 │
│                                                         │
│ [Add New...] button at bottom                          │
└─────────────────────────────────────────────────────────┘
```

**Action:** Click "Add New..." button to add first variable

---

### 2.5 Add Variable #1 (API Key)

**After clicking "Add New...", you'll see:**

```
┌──────────────────────────────────────┐
│ Add Environment Variable              │
├──────────────────────────────────────┤
│ Name: [________________]              │
│ Value: [________________]             │
│ Environment: [Dropdown]               │
│                                       │
│ [Cancel]  [Add]                       │
└──────────────────────────────────────┘
```

**Fill in:**
- **Name:** `VITE_FIREBASE_API_KEY`
- **Value:** `AIzaSyD...` (paste from Firebase)
- **Environment:** Click dropdown → Select **"All"** ← IMPORTANT

**Action:** Click "Add"

---

### 2.6 Add Variable #2 (Auth Domain)

**Click "Add New..." again**

**Fill in:**
- **Name:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Value:** `your-project.firebaseapp.com`
- **Environment:** **"All"**

**Action:** Click "Add"

---

### 2.7 Add Variable #3 (Project ID)

**Click "Add New..." again**

**Fill in:**
- **Name:** `VITE_FIREBASE_PROJECT_ID`
- **Value:** `your-project` (just the project ID)
- **Environment:** **"All"**

**Action:** Click "Add"

---

### 2.8 Add Variable #4 (Storage Bucket)

**Click "Add New..." again**

**Fill in:**
- **Name:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Value:** `your-project.appspot.com`
- **Environment:** **"All"**

**Action:** Click "Add"

---

### 2.9 Add Variable #5 (Messaging Sender ID)

**Click "Add New..." again**

**Fill in:**
- **Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** `123456789` (the numeric ID)
- **Environment:** **"All"**

**Action:** Click "Add"

---

### 2.10 Add Variable #6 (App ID)

**Click "Add New..." again**

**Fill in:**
- **Name:** `VITE_FIREBASE_APP_ID`
- **Value:** `1:123456789:web:abcd1234...`
- **Environment:** **"All"**

**Action:** Click "Add"

---

### 2.11 Verify All Variables Added

**Expected Screen After All 6 Added:**

```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables                                   │
├─────────────────────────────────────────────────────────┤
│ Name                         Value           Env   Δ    │
├─────────────────────────────────────────────────────────┤
│ ✓ VITE_FIREBASE_API_KEY      ••••••••••      All   ⋮   │
│ ✓ VITE_FIREBASE_AUTH_DOMAIN  your-proj...   All   ⋮   │
│ ✓ VITE_FIREBASE_PROJECT_ID   your-project   All   ⋮   │
│ ✓ VITE_FIREBASE_STORAGE_BKT  your-proj...   All   ⋮   │
│ ✓ VITE_FIREBASE_MESSAGING... 123456789      All   ⋮   │
│ ✓ VITE_FIREBASE_APP_ID       1:12345678...  All   ⋮   │
└─────────────────────────────────────────────────────────┘
```

**Verify:**
- [ ] All 6 variables present
- [ ] Each shows "All" in Environment column
- [ ] No typos in names

---

## STEP 3️⃣: TRIGGER REDEPLOY

### 3.1 Go to Deployments

**Location:** Top navigation bar

**Expected Screen:**
```
┌────────────────────────────────────────┐
│ versa-project                          │
├────────────────────────────────────────┤
│ [Overview] [Deployments] ← CLICK HERE  │
│                                        │
└────────────────────────────────────────┘
```

**Action:** Click "Deployments"

---

### 3.2 Find Latest Deployment

**Expected Screen:**
```
┌──────────────────────────────────────────────────────┐
│ Deployments                                          │
├──────────────────────────────────────────────────────┤
│ Latest                                               │
│ ├─ main (Just now)  ← THIS ONE (or most recent)    │
│ │  Status: ✓ Ready                                 │
│ │  Deployed: 2 minutes ago                         │
│ │  Commit: abc123def...                            │
│ │                                                  │
│ │  [... menu] ← CLICK HERE                         │
│ │                                                  │
│ └─ Older deployments below                         │
└──────────────────────────────────────────────────────┘
```

**Action:** Click the three dots menu **"..."** on latest deployment

---

### 3.3 Click Redeploy

**Menu appears:**
```
┌──────────────────────┐
│ Redeploy             │
│ Promote              │
│ View Source          │
│ Inspect              │
└──────────────────────┘
```

**Action:** Click "Redeploy"

---

### 3.4 Confirm Redeploy

**Dialog appears:**
```
┌──────────────────────────────────────┐
│ Redeploy                             │
├──────────────────────────────────────┤
│ Are you sure you want to redeploy    │
│ the latest commit?                   │
│                                      │
│ [Cancel]  [Redeploy] ← CLICK THIS   │
└──────────────────────────────────────┘
```

**Action:** Click "Redeploy" button

---

### 3.5 Wait for Build to Complete

**Build Progress Screen:**
```
┌──────────────────────────────────────────────────┐
│ Deployment Status: Building...                   │
├──────────────────────────────────────────────────┤
│                                                  │
│ ▓▓▓▓▓▓▓▓▓░░░░░░░░  50% Complete                │
│                                                  │
│ Building application...                         │
│ Compiling source code...                        │
│                                                  │
│ [View Build Logs]                               │
└──────────────────────────────────────────────────┘
```

**Wait 1-2 minutes** for "Ready" status

---

### 3.6 Build Complete

**Expected Screen:**
```
┌──────────────────────────────────────────────────┐
│ Deployment Status: ✓ Ready                       │
├──────────────────────────────────────────────────┤
│ Deployment URL: https://versa-project.vercel.app│
│ Commit: abc123def...                             │
│ Built: 2024-01-31 10:30:45                       │
│                                                  │
│ Build duration: 1 minute 45 seconds              │
│ Total size: 245 KB                               │
└──────────────────────────────────────────────────┘
```

**If you see "✓ Ready"** → Continue to Step 4

**If you see "✗ Error"** → Click "View Build Logs" and see troubleshooting section

---

## STEP 4️⃣: VERIFY BUILD LOGS

### 4.1 Check Build Log Output

**Location:** Click "View Build Logs" (or at deployment details)

**Expected Good Output:**
```
11:45:23.123 Found file: package.json
11:45:24.456 Found file: vite.config.js
11:45:25.789 Installing dependencies...
11:45:30.101 npm install completed
11:45:31.234 Running build: npm run build
11:45:32.567 > vite build
11:45:33.890 ✓ 1234 modules transformed
11:45:45.000 dist/index.html          45 KB
11:45:45.000 dist/assets/main.abc.js  234 KB
11:45:45.000 ✓ Build completed

11:45:46.000 Environment Variables Loaded:
11:45:46.001 ✓ VITE_FIREBASE_API_KEY
11:45:46.002 ✓ VITE_FIREBASE_AUTH_DOMAIN
11:45:46.003 ✓ VITE_FIREBASE_PROJECT_ID
11:45:46.004 ✓ VITE_FIREBASE_STORAGE_BUCKET
11:45:46.005 ✓ VITE_FIREBASE_MESSAGING_SENDER_ID
11:45:46.006 ✓ VITE_FIREBASE_APP_ID

11:45:47.000 ✓ Deployment complete
```

**Good Signs to Look For:**
- ✅ Build completed successfully
- ✅ Environment variables listed with checkmarks
- ✅ No "undefined" warnings
- ✅ No "VITE_FIREBASE_*" errors

**Bad Signs:**
- ❌ Build failed
- ❌ Missing VITE_FIREBASE variables
- ❌ Warnings about undefined environment variables

---

## STEP 5️⃣: TEST IN PRODUCTION

### 5.1 Open Your Deployment URL

**Get URL from:**
- Vercel Dashboard → Deployments → Latest → Copy deployment URL
- Or: Click "Visit" button

**Expected:**
```
https://versa-project.vercel.app
```

**Action:** Open this URL in your browser

---

### 5.2 Check for Errors (First Thing)

**Open DevTools:** Press `F12` or `Ctrl+Shift+I`

**Go to Console tab**

**Expected Good Result:**
```
Console (no red errors)

[optional info messages]
[optional warn messages]

No red ✗ errors visible
```

**Bad Result:**
```
Console shows:

✗ Uncaught Error: Firebase: Error (auth/invalid-api-key)

OR

✗ ReferenceError: Cannot read property of undefined
  (app.js:123)
```

---

### 5.3 Test Sign Up

**Try Creating a New Account:**

1. **Click "Sign Up"** if on login page
   - Or navigate to `/auth/signup`

2. **Enter test email:** `test@example.com`

3. **Enter password:** `TestPassword123!`

4. **Click "Sign Up"** button

**Expected Result:**
- ✅ Account created (or "Email already in use" if tested before)
- ✅ Auto-login happens
- ✅ Redirected to dashboard
- ✅ No Firebase errors in console

**Bad Result:**
- ❌ Error message appears
- ❌ auth/invalid-api-key error
- ❌ Nothing happens when clicking Sign Up

---

### 5.4 Test Login

1. **Navigate to Login page** (`/auth/login`)

2. **Enter email:** `test@example.com`

3. **Enter password:** `TestPassword123!`

4. **Click "Login"** button

**Expected Result:**
- ✅ "Logging in..." message appears
- ✅ Redirected to dashboard within 2 seconds
- ✅ User data displays
- ✅ No Firebase errors

---

### 5.5 Test Dashboard

**After logging in, you should see:**

```
┌──────────────────────────────────────┐
│ Dashboard / Home                     │
├──────────────────────────────────────┤
│ Welcome, [User Name]!                │
│                                      │
│ Profile Information:                 │
│ ├─ Email: test@example.com          │
│ ├─ Role: user/admin                 │
│ └─ Created: 2024-01-31              │
│                                      │
│ [Upload Profile Image]               │
│ [Edit Profile]                       │
│ [Logout]                             │
└──────────────────────────────────────┘
```

**Test:**
- [ ] Your user data displays correctly
- [ ] Profile image shows (or placeholder)
- [ ] All buttons clickable

---

### 5.6 Test File Upload (If Applicable)

**Click "Upload Profile Image" or similar:**

1. Select an image file from your computer
2. Click upload button
3. Wait for upload to complete

**Expected:**
- ✅ File uploads (progress shows)
- ✅ Image displays immediately
- ✅ Persists on page refresh
- ✅ No Firebase Storage errors

---

### 5.7 Test Logout

**Click "Logout"** button

**Expected:**
- ✅ Logged out successfully
- ✅ Redirected to login page
- ✅ Cannot access dashboard without logging in again

---

### 5.8 Test in Incognito Mode (IMPORTANT)

**Why?** Cache can hide issues

1. **Open a new Incognito/Private window**
2. **Go to your Vercel deployment URL**
3. **Repeat tests 5.3 - 5.7**

**Expected:** Same results as before

**If it works in regular mode but fails in incognito:**
- Clear browser cache (DevTools → Application → Clear Storage)
- Check for caching issues in Vercel config

---

## ✅ SUCCESS INDICATORS

You're done when you see:

✅ Page loads without red console errors  
✅ Can create new account (or "already exists" if tried before)  
✅ Can login with account  
✅ Dashboard shows user data  
✅ Can upload files  
✅ Logout works  
✅ Works in incognito mode too  
✅ Build logs show all 6 Firebase variables loaded  

---

## 🆘 VISUAL TROUBLESHOOTING

### Scenario 1: Still Seeing auth/invalid-api-key Error

**Screen shows:**
```
Uncaught FirebaseError: Firebase: Error (auth/invalid-api-key)
```

**Checklist:**

1. **Check Vercel Environment Variables**
   - [ ] Go back to Settings → Environment Variables
   - [ ] All 6 variables listed?
   - [ ] Each set to "All"?
   - [ ] No typos?

2. **Check Build Logs**
   - [ ] Go to Deployments → Latest → View Build Logs
   - [ ] See "Environment Variables Loaded"?
   - [ ] See all 6 listed with checkmarks?

3. **Redeploy Again**
   - [ ] Deployments → Latest → ... → Redeploy
   - [ ] Wait for build to complete
   - [ ] Hard refresh browser (Ctrl+Shift+R)

4. **Clear Cache**
   - [ ] DevTools → Application → Storage → Clear All
   - [ ] Close browser
   - [ ] Reopen and test

**If still not working:** See [FIREBASE_DEPLOYMENT_FIX.md](FIREBASE_DEPLOYMENT_FIX.md) troubleshooting section

---

### Scenario 2: Build Failed

**Screen shows:**
```
Deployment Status: ✗ Error
Build failed at step: npm run build
```

**Check:**
1. Click "View Build Logs"
2. Look for error message
3. Common causes:
   - Missing dependency in package.json
   - Environment variable causing build issue
   - Node version mismatch

**Solution:**
- If env vars issue: Delete invalid variable, redeploy
- If dependency issue: Push code fix to GitHub, will auto-redeploy
- If persistent: Contact Vercel support

---

### Scenario 3: Blank Page After Deployment

**Your Vercel URL shows nothing/blank page**

**Troubleshoot:**
1. Open DevTools → Console tab
2. Look for JavaScript errors
3. Check Network tab for failed requests
4. Check Vercel deployment health

**Most likely cause:** Build didn't include index.html properly
- Solution: Check vercel.json outputDirectory is "dist"

---

## 📱 TESTING ON MOBILE

**To test on your phone:**

1. Get your Vercel deployment URL
2. Open on phone browser
3. Test same flows as desktop
4. Check responsive layout works

**For local network testing:**
- Note: Can't access localhost from phone
- Must use deployed URL or expose local via ngrok

---

## 🎉 YOU'RE DONE!

If you've completed all steps and everything works:

1. **Document it:**
   - Note date of deployment
   - Note any issues found/fixed
   
2. **Celebrate:**
   - Your app is live in production! 🚀

3. **Monitor it:**
   - Check occasionally for errors
   - Keep Vercel dashboard open when making changes

4. **Share it:**
   - Share deployment URL with stakeholders
   - Let them test and provide feedback

---

**Last Updated:** January 31, 2026  
**Guide Version:** 1.0 (Visual)  
**For:** Non-technical users or visual learners
