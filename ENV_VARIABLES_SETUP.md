# Versal Environment Variables - Quick Reference

## 📋 Required Environment Variables for Vercel

All variables must be prefixed with `VITE_` to be accessible in your React application.

### Variables to Add in Vercel Dashboard

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyD...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `versa-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `versa-project` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `versa-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123456789:web:abc123...` |

---

## 🔑 Where to Find Your Firebase Credentials

### Step 1: Go to Firebase Console
https://console.firebase.google.com

### Step 2: Select Your Project
Click on "Versa Project" (or your project name)

### Step 3: Access Project Settings
1. Click **⚙️ (Settings icon)** in the left sidebar
2. Select **"Project Settings"**

### Step 4: Navigate to Your Apps
1. Click on **"Your apps"** section
2. Select your **Web App** (look for the `</>` icon)

### Step 5: Copy Firebase Config
You'll see a config object like this:

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

---

## ✅ Adding Variables to Vercel Dashboard

### Step 1: Open Vercel Project Settings
1. Go to [vercel.com](https://vercel.com)
2. Select your **Versa project**
3. Click **Settings** (top navigation)

### Step 2: Navigate to Environment Variables
1. Click **Environment Variables** in the left sidebar

### Step 3: Add Each Variable
For each Firebase variable:

1. **Key:** Enter the variable name (e.g., `VITE_FIREBASE_API_KEY`)
2. **Value:** Paste the value from Firebase Console
3. **Environment:** Select **All** (Production, Preview, Development)
4. Click **Save**

### Step 4: Repeat for All Variables
Add all 6 variables listed above

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Select **Redeploy**

---

## 🔐 Security Notes

✅ **Safe to Share:**
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_STORAGE_BUCKET`

❌ **NEVER Share:**
- `VITE_FIREBASE_API_KEY` (treat as password)
- `.env.local` file

---

## 🧪 Verify Variables are Loaded

After deployment, check if variables are loaded correctly:

1. Visit your Vercel app: `https://your-app.vercel.app`
2. Open **DevTools** (F12 → Console)
3. Type this command:
```javascript
console.log({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 5) + "...",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
})
```

4. You should see your Firebase credentials loaded (partially shown for security)

---

## 🚀 Deployment Commands

After adding variables, redeploy:

```bash
# From Vercel Dashboard
1. Go to Deployments
2. Click ... on latest deployment
3. Select "Redeploy"

# OR from CLI
vercel redeploy
```

---

## 📞 Troubleshooting

**Issue:** Variables show as undefined in browser console

**Solution:**
1. Verify variable names start with `VITE_`
2. Verify environments are set to **All**
3. Trigger redeploy
4. Clear browser cache (Ctrl+Shift+Delete)

---

**Ready to deploy? Follow the main deployment guide: `VERCEL_DEPLOYMENT_GUIDE.md`**
