# Firebase auth/invalid-api-key - QUICK REFERENCE CARD

> Print this page or bookmark it for quick reference during troubleshooting

---

## 🚨 THE ERROR

```
Uncaught FirebaseError: Firebase: Error (auth/invalid-api-key)
```

**Only appears on Vercel, not locally?** → Environment variables not set in Vercel

---

## ⚡ QUICK FIX (10 minutes)

### Step 1: Get Firebase Credentials
- Open [Firebase Console](https://console.firebase.google.com)
- Select your project → ⚙️ Project Settings → Your Apps tab
- Copy these 6 values:
  1. `apiKey` (AIzaSy...)
  2. `authDomain` (your-project.firebaseapp.com)
  3. `projectId` (your-project)
  4. `storageBucket` (your-project.appspot.com)
  5. `messagingSenderId` (numbers)
  6. `appId` (1:numbers:web:...)

### Step 2: Add to Vercel
- Open [Vercel Dashboard](https://vercel.com/dashboard)
- Click your project → Settings → Environment Variables
- Click "Add New" and add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_FIREBASE_API_KEY` | From Firebase | **All** |
| `VITE_FIREBASE_AUTH_DOMAIN` | From Firebase | **All** |
| `VITE_FIREBASE_PROJECT_ID` | From Firebase | **All** |
| `VITE_FIREBASE_STORAGE_BUCKET` | From Firebase | **All** |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From Firebase | **All** |
| `VITE_FIREBASE_APP_ID` | From Firebase | **All** |

### Step 3: Redeploy
- Vercel Dashboard → Deployments
- Click latest deployment → "..." menu → "Redeploy"
- Wait 1-2 minutes for build to complete

### Step 4: Test
- Open your Vercel URL
- Try signing up / logging in
- Should work without Firebase errors

---

## ❌ COMMON MISTAKES

| ❌ WRONG | ✅ CORRECT |
|---------|----------|
| Using `process.env` | Using `import.meta.env` |
| `FIREBASE_API_KEY` | `VITE_FIREBASE_API_KEY` |
| Environment = "Development" | Environment = **All** |
| `"AIzaSy..."` (with quotes) | `AIzaSy...` (no quotes) |
| Values with spaces | Values without spaces |
| Not redeploying after adding vars | Redeploy after adding vars |

---

## 🔍 DIAGNOSTIC CHECKS

**Is the error ONLY in production?**
- [ ] Yes → Environment variables not in Vercel
- [ ] No → Problem with local Firebase config

**Are all 6 variables in Vercel?**
- Go to Settings → Environment Variables
- Count the `VITE_FIREBASE_*` variables
- Should be exactly 6

**Are they set to "All"?**
- Each variable should show "All" (not "Production" only)

**Did you redeploy after adding variables?**
- Deployments → Click latest → "..." → "Redeploy"
- Wait for build to complete

**Are variable values correct?**
- Compare each value to Firebase Console
- No spaces at start/end
- No quotes wrapping values

---

## 📱 QUICK TEST

After redeploying:

```javascript
// Open DevTools Console and run:
console.log(import.meta.env.VITE_FIREBASE_PROJECT_ID)

// If you see your project ID → variables loaded ✅
// If you see "undefined" → variables not loaded ❌
```

---

## 🆘 NOT FIXED YET?

1. **Clear browser cache**
   - Open in incognito/private mode
   - OR: DevTools → Application → Clear storage → Clear all

2. **Check build logs**
   - Deployments → Latest → View Build Logs
   - Look for variable warnings

3. **Verify Firebase project**
   - Firebase Console → Is project still there?
   - Is it enabled (not disabled)?

4. **Check API key value**
   - Firebase Console → Project Settings → Keys
   - Verify the key is "Active" status

5. **Read full guide**
   - See [FIREBASE_DEPLOYMENT_FIX.md](FIREBASE_DEPLOYMENT_FIX.md)

---

## 📚 DOCS

| Quick Link | For |
|-----------|-----|
| [FIREBASE_DEPLOYMENT_FIX.md](FIREBASE_DEPLOYMENT_FIX.md) | Full troubleshooting |
| [VERCEL_ENV_VARIABLES_SETUP.md](VERCEL_ENV_VARIABLES_SETUP.md) | Step-by-step setup |
| [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md) | General Vercel issues |

---

## 💾 LOCAL SETUP (Reference)

Your local `.env.local` file should look like:

```dotenv
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

**Never commit this file to GitHub.**

---

## 🔧 VERIFY SCRIPT

Run this locally to check your setup:

```bash
node verify-firebase-config.js
```

This script checks:
- [ ] `.env.local` file exists and is valid
- [ ] All 6 variables present
- [ ] No quotes or spaces in values
- [ ] `FirebaseConfig.js` uses `import.meta.env`
- [ ] `vite.config.js` is configured correctly

---

## 📋 INSTANT CHECKLIST

- [ ] Added all 6 variables to Vercel
- [ ] Each set to environment "All"
- [ ] Redeployed (not just refreshed)
- [ ] Build logs show success (no warnings)
- [ ] Tested in incognito mode
- [ ] Can sign up / log in
- [ ] Console shows no Firebase errors

If all checked → **You're done! ✅**

---

**Version:** 1.0 | **Updated:** January 31, 2026
