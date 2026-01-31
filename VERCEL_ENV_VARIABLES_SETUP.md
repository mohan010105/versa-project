# Vercel Environment Variables Setup - Complete Guide

> **For:** React + Vite + Firebase + Vercel
> **Purpose:** Configure Firebase credentials in Vercel for auth/invalid-api-key fix
> **Time:** 10-15 minutes

---

## 📋 Pre-Setup Checklist

Before you start, have these ready:

- [ ] Your Firebase project open in [Firebase Console](https://console.firebase.google.com)
- [ ] Your Vercel project open in [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] 6 Firebase credentials (API Key, Auth Domain, Project ID, Storage Bucket, Messaging ID, App ID)

---

## 🔑 Step 1: Get Your Firebase Credentials

### Open Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project from the list
3. Click **⚙️ Project Settings** (gear icon, top right)

### Find Your Credentials

Click **Your Apps** tab and find your **Web** app. You should see:

```json
{
  "apiKey": "AIzaSyD...",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc123def456"
}
```

**Copy these exact values. You'll need them in Step 2.**

---

## 🚀 Step 2: Add Variables to Vercel

### Open Vercel Dashboard

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Find and click your **Versa Project**

### Navigate to Environment Variables

1. Click **Settings** (top menu bar)
2. In left sidebar, click **Environment Variables**

You should see this page:

```
┌─────────────────────────────────────────────────────────────┐
│ Environment Variables                                        │
├─────────────────────────────────────────────────────────────┤
│ Edit Production, Preview, Development environments            │
│                                                              │
│ [Name]  [Value]  [Environment dropdown]  [Edit] [Delete]   │
│                                                              │
│ + Add new...                                                │
└─────────────────────────────────────────────────────────────┘
```

### Add Variable #1: API Key

Click **Add New...**

| Field | Value |
|-------|-------|
| Name | `VITE_FIREBASE_API_KEY` |
| Value | `AIzaSyD...` (copy from Firebase Console) |
| Environment | **All** ← CLICK THIS |

Click **Save**

### Add Variable #2: Auth Domain

Click **Add New...**

| Field | Value |
|-------|-------|
| Name | `VITE_FIREBASE_AUTH_DOMAIN` |
| Value | `your-project.firebaseapp.com` |
| Environment | **All** |

Click **Save**

### Add Variable #3: Project ID

Click **Add New...**

| Field | Value |
|-------|-------|
| Name | `VITE_FIREBASE_PROJECT_ID` |
| Value | `your-project` |
| Environment | **All** |

Click **Save**

### Add Variable #4: Storage Bucket

Click **Add New...**

| Field | Value |
|-------|-------|
| Name | `VITE_FIREBASE_STORAGE_BUCKET` |
| Value | `your-project.appspot.com` |
| Environment | **All** |

Click **Save**

### Add Variable #5: Messaging Sender ID

Click **Add New...**

| Field | Value |
|-------|-------|
| Name | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| Value | `123456789` (numeric ID from Firebase) |
| Environment | **All** |

Click **Save**

### Add Variable #6: App ID

Click **Add New...**

| Field | Value |
|-------|-------|
| Name | `VITE_FIREBASE_APP_ID` |
| Value | `1:123456789:web:abc123def456` |
| Environment | **All** |

Click **Save**

### Result

Your Vercel Environment Variables page should now show:

```
✅ VITE_FIREBASE_API_KEY              ••••••••••••••••  All
✅ VITE_FIREBASE_AUTH_DOMAIN          your-project...  All
✅ VITE_FIREBASE_PROJECT_ID           your-project     All
✅ VITE_FIREBASE_STORAGE_BUCKET       your-project...  All
✅ VITE_FIREBASE_MESSAGING_SENDER_ID  ••••••••••       All
✅ VITE_FIREBASE_APP_ID               1:123456789...   All
```

---

## 🔄 Step 3: Trigger a Redeploy

**IMPORTANT:** Your current build doesn't have these variables yet. You must redeploy.

### Option A: Redeploy via Dashboard (Recommended)

1. Click **Deployments** (top menu)
2. Find your latest deployment (top of list)
3. Click the three-dots menu **"..."**
4. Click **"Redeploy"**
5. Confirm: Click **"Redeploy"** again

**Wait 1-2 minutes for the build to complete.**

### Option B: Redeploy via Git Push

```bash
# Make a tiny change to trigger redeploy
git add .
git commit -m "chore: redeploy with Firebase env vars"
git push origin main
```

Vercel will automatically redeploy when you push to your main branch.

---

## ✅ Step 4: Verify the Fix

### Check Build Logs

1. Go to **Deployments**
2. Click your new deployment
3. Click **View Build Logs**
4. Look for these good signs:

```
✓ Retrieving dependencies...
✓ Installing dependencies...
✓ Building application...
✓ Build completed in 45s
```

❌ Bad signs to watch for:
```
⚠ Warning: undefined VITE_FIREBASE_API_KEY
⚠ Warning: environment variables not found
```

### Test in Production

1. Open your Vercel URL (e.g., `https://versa-project.vercel.app`)
2. Scroll down and wait for page to load completely
3. Open **DevTools** → **Console** tab
4. Attempt to **Sign Up**:
   - Enter email
   - Enter password
   - Click "Sign Up"
   - Should see either:
     - ✅ Success message + redirect to dashboard
     - ✅ Error about email already exists (good - means Firebase is working)

### Test All Features

| Feature | How to Test | Expected Result |
|---------|------------|-----------------|
| **Sign Up** | Create new email/password | User created, can log in |
| **Login** | Sign in with existing account | Logged in, dashboard loads |
| **Logout** | Click logout button | Redirected to login |
| **Admin Access** | Login as admin, go to `/admin` | Admin dashboard loads (if admin user) |
| **File Upload** | Upload profile image | Image appears immediately |
| **Database** | View user data in dashboard | Data loads from Firestore |

---

## 🐛 Troubleshooting

### Issue: Still Getting `auth/invalid-api-key`

**Checklist:**

1. **Did you redeploy?**
   - [ ] After adding variables, you clicked "Redeploy"?
   - [ ] New deployment completed successfully (check build logs)?

2. **Are all 6 variables present?**
   - [ ] Go to Settings → Environment Variables
   - [ ] Count: Should see exactly 6 `VITE_FIREBASE_*` variables
   - [ ] If missing any, add them now and redeploy again

3. **Are they set to "All" environment?**
   - [ ] Each variable shows "All" (not just "Production" or "Development")
   - [ ] If not, edit each one and change to "All", then redeploy

4. **Are the values correct?**
   - [ ] Check each value against Firebase Console
   - [ ] No extra spaces at start/end
   - [ ] No quotation marks around values
   - [ ] No line breaks or special formatting

5. **Clear browser cache**
   - [ ] Open your Vercel URL in **incognito/private mode**
   - [ ] OR: Open DevTools → Application → Clear storage → Clear all
   - [ ] Refresh page
   - [ ] Try signing in again

6. **Check Firebase project status**
   - [ ] Firebase Console → Your project
   - [ ] Project status shows "OK" (not disabled or deleted)
   - [ ] All services (Auth, Firestore, Storage) are enabled

### Issue: Build Logs Show Variable Warnings

**Example warning:**
```
⚠ Warning: VITE_FIREBASE_API_KEY is undefined
```

**Causes:**
- Variables added AFTER last build started
- Wrong environment selected (e.g., "Development" only)
- Typo in variable name

**Fix:**
1. Go to Environment Variables → check all 6 are there
2. Edit each variable → ensure "All" is selected
3. Go to Deployments → Redeploy latest
4. Wait for new build to complete

---

## 📋 Verification Checklist

Complete this checklist to confirm everything is working:

### Pre-Deploy
- [ ] All 6 Firebase variables added to Vercel
- [ ] All variables set to "All" environment
- [ ] No typos in variable names
- [ ] No spaces or quotes in values
- [ ] Redeploy triggered

### Post-Deploy (5 minutes after redeploy)
- [ ] New build completed successfully
- [ ] Build logs show no variable warnings
- [ ] Can access Vercel deployment URL
- [ ] Page loads without Firebase errors
- [ ] Console doesn't show red error messages

### Functionality
- [ ] Sign up page loads
- [ ] Can create new account
- [ ] Can log in with account
- [ ] Dashboard loads after login
- [ ] Can upload profile image
- [ ] Can view user data
- [ ] Admin panel accessible (if admin user)

### Edge Cases
- [ ] Tested in incognito mode (no cache issues)
- [ ] Tested on mobile device
- [ ] Tested logout/login cycle
- [ ] Tested password reset (if implemented)

---

## 🔐 Security Notes

### About Firebase API Keys

Your Firebase API key is **semi-public** because it's embedded in your frontend code. This is normal and expected. Security relies on:

1. **API Key Restrictions** (Firebase Console)
   - Restrict to specific domains (whitelist your Vercel domain)
   - Restrict to specific APIs (Web API)

2. **Firestore Security Rules**
   - Only authenticated users can read/write
   - Users can only access their own data

3. **Storage Rules**
   - Only authenticated users can upload
   - Only creators can delete

### Setting API Key Restrictions

1. Firebase Console → Project Settings → Keys and Certificates
2. Find your Web API key
3. Click on it
4. Under "Web API restrictions", click "Add domain"
5. Add your Vercel domain (e.g., `versa-project.vercel.app`)
6. Save

This ensures the API key only works from your deployed domain.

---

## 📚 Related Documentation

| Document | Purpose |
|----------|---------|
| [FIREBASE_DEPLOYMENT_FIX.md](FIREBASE_DEPLOYMENT_FIX.md) | Complete troubleshooting guide |
| [ENV_VARIABLES_SETUP.md](ENV_VARIABLES_SETUP.md) | General environment variables info |
| [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md) | Vercel deployment issues |
| [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md) | General Vercel setup guide |

---

## ❓ Common Questions

**Q: How many times do I need to do this?**
A: Once per project. These variables are permanent until you delete them.

**Q: Can I use different API keys for dev and prod?**
A: Not recommended. Use the same Firebase project for consistency.

**Q: What if I change Firebase projects?**
A: Update all 6 variables in Vercel with credentials from the new project, then redeploy.

**Q: How long does a redeploy take?**
A: Usually 1-3 minutes. Check Deployments page for status.

**Q: Will changing these variables break my app?**
A: Only if you use invalid credentials. Correct credentials should always work.

**Q: Can users see my API key?**
A: Yes, it's in the public browser code. But it's restricted to your Firebase project and domain.

---

## 🆘 Still Need Help?

If you've completed all steps and still see errors:

1. **Screenshot the error** (full browser console)
2. **Screenshot Vercel environment variables** (Settings → Environment Variables)
3. **Screenshot Vercel build logs** (Deployments → Latest → View Build Logs)
4. **Check Firebase Console** - ensure project still exists and is active
5. **Review** [FIREBASE_DEPLOYMENT_FIX.md](FIREBASE_DEPLOYMENT_FIX.md) → Troubleshooting section

---

**Last Updated:** January 31, 2026
**For:** Firebase + React + Vite + Vercel
