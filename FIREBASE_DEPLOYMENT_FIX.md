# Firebase auth/invalid-api-key Fix Guide - Vite + Vercel

> **Status:** Production Critical
> **Error:** `FirebaseError: Firebase: Error (auth/invalid-api-key)`
> **Affected Environments:** Vercel Deployment Only
> **Root Cause:** Incorrect environment variable setup in Vercel

---

## 📋 Table of Contents
1. [Root Cause Analysis](#root-cause-analysis)
2. [Quick Fix Checklist](#quick-fix-checklist)
3. [Step-by-Step Solution](#step-by-step-solution)
4. [Verification Steps](#verification-steps)
5. [Common Mistakes](#common-mistakes)
6. [FAQ](#faq)

---

## 🔍 Root Cause Analysis

### Why This Error Occurs

The `auth/invalid-api-key` error means Firebase received an **invalid, missing, or incorrectly formatted API key**. In your Vite + Vercel setup, this happens because:

| Cause | Why It Only Happens in Production |
|-------|----------------------------------|
| **Environment variables not set in Vercel** | Local `.env.local` works fine, but Vercel has no access to it |
| **Missing `VITE_` prefix in variable names** | Vite requires `VITE_` prefix to expose env vars to the browser at build time |
| **Variables set to wrong environment** | Set only for "Development" but not "Production" |
| **Typo in variable names** | `FIREBASE_API_KEY` instead of `VITE_FIREBASE_API_KEY` |
| **Variables added AFTER last deployment** | Old build was made before variables were available |
| **Incorrect key value** | API key contains spaces, special characters, or is truncated |

### How Your Current Setup Works

```
┌─────────────────────────────────────────────────────────┐
│  1. Build Time (Vercel)                                │
│     ├─ Read VITE_FIREBASE_API_KEY from Vercel env vars │
│     ├─ Bundle it into dist/index.html                  │
│     └─ Upload to Vercel CDN                            │
├─────────────────────────────────────────────────────────┤
│  2. Runtime (Browser)                                  │
│     ├─ Browser loads dist/index.html                   │
│     ├─ App calls: import.meta.env.VITE_FIREBASE_API_KEY│
│     ├─ If undefined → Firebase init fails              │
│     └─ auth/invalid-api-key error                      │
└─────────────────────────────────────────────────────────┘
```

**Key Point:** Environment variables must be set in Vercel BEFORE deployment, not after.

---

## ✅ Quick Fix Checklist

### Pre-Flight Check (5 minutes)

- [ ] Firebase API key is valid in Firebase Console (> 30 characters)
- [ ] Vercel project is connected to your GitHub repo
- [ ] You have access to Vercel Dashboard settings
- [ ] You have Firebase Console access

### Main Fix (10 minutes)

- [ ] Go to Vercel Dashboard
- [ ] Navigate to Settings → Environment Variables
- [ ] Add all 6 Firebase variables with exact names
- [ ] Set environment to **All** (Production + Preview + Development)
- [ ] Verify each variable value (no spaces, typos)
- [ ] Trigger a redeploy

### Verification (5 minutes)

- [ ] Check Vercel build logs for variable warnings
- [ ] Test auth in production (sign up / login)
- [ ] Check browser console for errors
- [ ] Verify Firestore queries work
- [ ] Test image upload functionality

---

## 🛠️ Step-by-Step Solution

### Step 1: Verify Your Firebase API Key Locally

Before adding to Vercel, confirm the key works:

```bash
# 1. Check your local .env.local file exists
cat .env.local

# Expected format:
# VITE_FIREBASE_API_KEY=AIzaSyD... (30+ characters)
# VITE_FIREBASE_PROJECT_ID=your-project-id
# etc.

# 2. Ensure keys are NOT wrapped in quotes
# ✅ VITE_FIREBASE_API_KEY=AIzaSyDl...
# ❌ VITE_FIREBASE_API_KEY="AIzaSyDl..."
```

### Step 2: Access Vercel Dashboard Environment Variables

**Desktop Instructions:**

1. Open [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **Versa Project**
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. You should see this page:

```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ Name          Value        Environment  │
│                                         │
│ [Add Variable Button]                   │
└─────────────────────────────────────────┘
```

### Step 3: Add Firebase Variables to Vercel

Add **each** of these 6 variables. Repeat 6 times:

#### Variable 1: API Key

| Field | Value |
|-------|-------|
| **Name** | `VITE_FIREBASE_API_KEY` |
| **Value** | Your actual API key from Firebase Console |
| **Environment** | Select **All** (★★★ IMPORTANT ★★★) |

**How to get the value:**
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click "Project Settings" (⚙️ icon)
4. Click "Your Apps" tab
5. Find your Web app
6. Copy the `apiKey` value (starts with `AIzaSy...`)

#### Variable 2: Auth Domain

| Field | Value |
|-------|-------|
| **Name** | `VITE_FIREBASE_AUTH_DOMAIN` |
| **Value** | `your-project-id.firebaseapp.com` |
| **Environment** | Select **All** |

**From Firebase Console → Project Settings:** Copy `authDomain` field

#### Variable 3: Project ID

| Field | Value |
|-------|-------|
| **Name** | `VITE_FIREBASE_PROJECT_ID` |
| **Value** | `your-project-id` (usually hyphenated) |
| **Environment** | Select **All** |

#### Variable 4: Storage Bucket

| Field | Value |
|-------|-------|
| **Name** | `VITE_FIREBASE_STORAGE_BUCKET` |
| **Value** | `your-project-id.appspot.com` |
| **Environment** | Select **All** |

#### Variable 5: Messaging Sender ID

| Field | Value |
|-------|-------|
| **Name** | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| **Value** | Numeric ID (from Firebase Console) |
| **Environment** | Select **All** |

#### Variable 6: App ID

| Field | Value |
|-------|-------|
| **Name** | `VITE_FIREBASE_APP_ID` |
| **Value** | `1:123456789:web:abc...` format |
| **Environment** | Select **All** |

### Step 4: Verify Variable Names and Values

After adding all variables, your Vercel dashboard should show:

```
✓ VITE_FIREBASE_API_KEY          ••••••••••    All
✓ VITE_FIREBASE_AUTH_DOMAIN      your-proj...  All
✓ VITE_FIREBASE_PROJECT_ID       your-proje... All
✓ VITE_FIREBASE_STORAGE_BUCKET   your-proj...  All
✓ VITE_FIREBASE_MESSAGING_SEN... ••••••••••    All
✓ VITE_FIREBASE_APP_ID           1:123456...   All
```

### Step 5: Trigger a Redeploy

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots **"..."** menu
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"** again

**Option B: Via Git Push**

```bash
# Push a small change to trigger redeploy
git add .
git commit -m "chore: trigger redeploy with updated env vars"
git push origin main
```

---

## ✔️ Verification Steps

### Step 1: Monitor the Build

1. Go to Vercel Dashboard → **Deployments**
2. Click on the new deployment (should be at top)
3. Watch the **Build** logs:
   - ✅ Should see `npm run build` running
   - ✅ Should complete without Firebase warnings
   - ❌ If you see warnings about undefined `VITE_FIREBASE_*`, variables didn't load

### Step 2: Check Build Logs for Environment Variables

In the Vercel build logs, look for output like:

```
✓ Building application...
✓ Resolving dependencies...
✓ Using Node.js version X.X.X
✓ Environment variables loaded
  - VITE_FIREBASE_API_KEY: ••••••••••
  - VITE_FIREBASE_PROJECT_ID: your-project
  [rest of variables]
✓ Running build command: npm run build
✓ Build completed successfully
```

### Step 3: Test in Production

1. Open your Vercel deployment URL (e.g., `https://versa-project.vercel.app`)
2. Open **Browser DevTools** → **Console** tab
3. Attempt to **Sign Up** or **Log In**
4. Check for errors:
   - ✅ **Success:** Auth works, no Firebase errors
   - ❌ **Still broken:** See [Troubleshooting](#troubleshooting) section

### Step 4: Quick Functionality Test

| Feature | Test | Expected |
|---------|------|----------|
| **Sign Up** | Create new user | User created, redirects to dashboard |
| **Login** | Sign in with email | User logged in, role-based redirect works |
| **File Upload** | Upload profile image | Image appears in Firestore and Storage |
| **Firestore Read** | View user data | Data loads from database |
| **Admin Panel** | Access `/admin` as admin | Admin panel loads |

### Step 5: Verify in Console (Advanced)

Open browser DevTools and run:

```javascript
// Check if Firebase config is loaded
console.log(import.meta.env.VITE_FIREBASE_PROJECT_ID)

// Should output: your-project-id (not undefined)
// If undefined, env vars didn't make it to build
```

---

## ❌ Common Mistakes

### Mistake 1: Using `process.env` Instead of `import.meta.env`

```javascript
// ❌ WRONG - Won't work in Vite
const apiKey = process.env.VITE_FIREBASE_API_KEY

// ✅ CORRECT - Works in Vite
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
```

**Why:** Vite is ESM-based and uses `import.meta.env` at build time.

**Current Code Status:** ✅ Your code is correct (using `import.meta.env`)

---

### Mistake 2: Wrong Environment Variable Names

```javascript
// ❌ WRONG in Vercel
FIREBASE_API_KEY=...     // Missing VITE_ prefix
VITE_API_KEY=...         // Incomplete name
vite_firebase_api_key=...// Wrong case

// ✅ CORRECT
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
```

**Current Code Status:** ✅ Your variables are correctly named

---

### Mistake 3: Setting Variables to Only "Development" Environment

```
❌ WRONG: Environment = "Development only"
   Result: Variables available locally, but NOT in production

✅ CORRECT: Environment = "All"
   Result: Variables available in production, preview, AND development
```

**Critical:** Always select **All** unless you have specific staging needs.

---

### Mistake 4: Deploying Before Adding Variables

```
Timeline that FAILS:
1. Deploy to Vercel (no env vars configured)
2. Get auth/invalid-api-key error
3. Add env vars to Vercel
4. Refresh browser
5. Still broken (old build is cached)
6. Must redeploy

Timeline that WORKS:
1. Add env vars to Vercel
2. Redeploy
3. New build includes vars
4. Works immediately
```

---

### Mistake 5: Including Quotes in Variable Values

```
❌ WRONG
VITE_FIREBASE_API_KEY = "AIzaSyD..." (with quotes)
VITE_FIREBASE_PROJECT_ID = "my-project" (with quotes)

✅ CORRECT
VITE_FIREBASE_API_KEY = AIzaSyD... (no quotes)
VITE_FIREBASE_PROJECT_ID = my-project (no quotes)
```

---

### Mistake 6: Spaces in Variable Values

```
❌ WRONG
VITE_FIREBASE_API_KEY = AIzaSyD... abc (with trailing space)

✅ CORRECT
VITE_FIREBASE_API_KEY = AIzaSyD...abc (no spaces)
```

---

### Mistake 7: Forgetting to Redeploy

```
Common sequence:
1. Add variables to Vercel ✓
2. Refresh production site ✗ (uses old build)
3. Still see error ✗
4. Don't realize old build is cached

FIX: After adding variables, ALWAYS redeploy:
1. Add variables
2. Go to Deployments
3. Click "..." → "Redeploy"
4. Wait for new build to complete
5. Test again
```

---

## 🔧 Troubleshooting

### Issue: Still Getting `auth/invalid-api-key` After These Steps?

#### Diagnosis 1: Check if Variables Are Actually Loaded

1. Go to Vercel Dashboard → **Deployments**
2. Click your latest deployment
3. Scroll to **Environment** section
4. You should see all 6 `VITE_FIREBASE_*` variables listed

**If NOT listed:**
- Variables were added AFTER this build
- Need to redeploy again
- OR variables are set to "Development" only

**If listed:**
- Variables made it to build
- Problem is with the values themselves
- Proceed to Diagnosis 2

#### Diagnosis 2: Verify Variable Values Are Correct

In Vercel Dashboard, click on each variable and verify:

1. **No extra spaces** at beginning or end
2. **No quotes** wrapping the value
3. **Correct format:**
   - `VITE_FIREBASE_API_KEY`: Starts with `AIzaSy`, 30+ characters
   - `VITE_FIREBASE_AUTH_DOMAIN`: Ends with `.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID`: Only letters, hyphens, numbers
   - `VITE_FIREBASE_APP_ID`: Format `1:numbers:web:...`

#### Diagnosis 3: Check Firebase Project Hasn't Been Deleted

1. Open [Firebase Console](https://console.firebase.google.com)
2. Verify your project still exists
3. Verify project hasn't been disabled
4. Verify project hasn't exceeded quota limits

#### Diagnosis 4: Verify API Key Has Required Permissions

1. Firebase Console → Project Settings → Keys & Certificates
2. Find your Web API key
3. Click on it
4. Verify:
   - ✅ Status shows "Active"
   - ✅ Web API restrictions are NOT enabled (or include your Vercel domain)
   - ✅ Application restrictions are NOT enabled (or include your domain)

#### Diagnosis 5: Check Browser Cache

Sometimes browsers cache old assets. Clear everything:

```
1. Open your Vercel URL in incognito/private mode
2. OR use DevTools → Application → Clear storage → Clear all
3. Refresh page
4. Try logging in again
```

#### Diagnosis 6: Verify Deployment Actually Used New Build

```javascript
// In browser console, run:
console.log(import.meta.env.VITE_FIREBASE_PROJECT_ID)

// If undefined, the build didn't include variables
// If shows project ID, build is correct but Firebase config issue
```

---

## ❓ FAQ

### Q: Why does it work locally but not on Vercel?

**A:** Your local `.env.local` file doesn't exist on Vercel's servers. Vercel must have its own copy of the variables. During build time, Vercel injects them into the code.

### Q: Can I hardcode the API key?

**A:** **NO.** Never hardcode sensitive keys. Even though Firebase Web API keys appear "public-facing," they should still be environment variables for security and flexibility.

### Q: How do I know if my API key is correct?

**A:** 
- Open [Firebase Console](https://console.firebase.google.com)
- Project Settings → Your Apps
- Copy the exact `apiKey` field
- Ensure:
  - Starts with `AIzaSy`
  - No spaces or quotes
  - 30+ characters

### Q: Do I need a different API key for production vs development?

**A:** No. Use the same API key everywhere (it's for the same Firebase project).

### Q: What if I'm using the wrong Firebase project?

**A:** 
- Check Vercel env vars match Firebase Console project
- All 6 values must be from the SAME Firebase project
- Project ID (e.g., `my-project`) should match across all credentials

### Q: How long does redeploy take?

**A:** Usually 1-2 minutes. Check Vercel Deployments page for status.

### Q: Do I need to update my code?

**A:** **No.** Your code is correct. This is purely an environment variable issue.

### Q: What if a variable has a special character?

**A:** Should be fine. Vercel accepts any character. Ensure no accidental spaces or line breaks.

### Q: Can I test locally with Vercel variables?

**A:** Yes! Create a `.env.local` file locally with the same variables (but never commit it to GitHub):

```bash
# .env.local (never commit this)
VITE_FIREBASE_API_KEY=your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# etc.
```

Then run:
```bash
npm run dev
```

### Q: What's the difference between `VITE_` and `REACT_APP_`?

**A:** `VITE_` is for Vite. `REACT_APP_` is for Create React App. Your project uses Vite, so use `VITE_`.

---

## 🚀 Final Checklist Before Going Live

- [ ] All 6 Firebase variables added to Vercel
- [ ] All variables set to environment "All"
- [ ] No typos in variable names
- [ ] No spaces or quotes in variable values
- [ ] Latest deployment includes all variables (check build logs)
- [ ] Redeploy triggered AFTER adding variables
- [ ] Tested sign up/login in production
- [ ] Tested file uploads work
- [ ] Tested Firestore reads/writes work
- [ ] No Firebase errors in console
- [ ] Tested with incognito/private browser mode (to bypass cache)

---

## 📞 Support Resources

**If still having issues:**

1. **Vercel Docs:** [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
2. **Firebase Docs:** [https://firebase.google.com/docs/projects/learn-more](https://firebase.google.com/docs/projects/learn-more)
3. **Vite Docs:** [https://vitejs.dev/guide/env-and-modes.html](https://vitejs.dev/guide/env-and-modes.html)
4. **Your Project Docs:** Check [ENV_VARIABLES_SETUP.md](ENV_VARIABLES_SETUP.md) and [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md)

---

**Document Version:** 1.0  
**Last Updated:** January 31, 2026  
**Status:** Production Ready  
