# 🚀 Quick Start Guide - Role-Based Dashboard

## ⚡ 5-Minute Setup

### Step 1: Firebase Configuration
```javascript
// src/Firebase/FirebaseConfig.js - Update with your credentials
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_AUTH",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
}
```

### Step 2: Apply Firestore Rules
```
Firebase Console → Firestore → Rules
→ Copy from FIRESTORE_SECURITY_RULES.txt
```

### Step 3: Apply Storage Rules
```
Firebase Console → Storage → Rules
→ Allow authenticated users to upload to their folders
→ Max 5MB, images only
```

### Step 4: Create Admin User
```
Firebase Console → Authentication → Create user
Firebase Console → Firestore → Create /users/{uid}
→ Set role: "admin"
```

### Step 5: Run Application
```bash
npm install
npm run dev
```

---

## 🔑 Key Features

### For Users:
✅ Sign up (auto-role: "user")
✅ Submit profile with photo
✅ Update existing profile
✅ View own submissions
✅ Automatic redirect to /dashboard

### For Admins:
✅ View all user submissions
✅ See user details & profiles
✅ Submit own profile
✅ View statistics
✅ Automatic redirect to /admin

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/hooks/useAuth.js` | Fetches user & role |
| `src/routes/AdminRoute.jsx` | Protects admin routes |
| `src/routes/RoleBasedRedirect.jsx` | Auto-routes by role |
| `src/components/AdminDashboard.jsx` | Admin panel |
| `src/components/UserDashboard.jsx` | User panel |
| `src/components/ProfileSubmissionForm.jsx` | Profile form |
| `src/Firebase/Firestore.js` | Database functions |
| `src/Firebase/Storage.js` | Image upload |

---

## 🔐 Security Checklist

- [ ] Firestore Rules applied
- [ ] Storage Rules applied
- [ ] Firebase credentials not hardcoded
- [ ] Admin user created
- [ ] Test admin access (/admin)
- [ ] Test user redirect (/dashboard)
- [ ] Test image upload validation
- [ ] Test permission restrictions

---

## 🧪 Test Scenarios

### Test 1: New User Signup
```
1. Go to /auth/signup
2. Create account (email & password)
3. Should auto-redirect to /dashboard
4. Should see "Submit Profile" form
5. Should NOT see /admin in URL
✓ PASS
```

### Test 2: Admin User Login
```
1. Go to /auth/login
2. Login with admin account
3. Should auto-redirect to /admin
4. Should see all submissions
5. Should see statistics
✓ PASS
```

### Test 3: Image Upload
```
1. In dashboard, select JPG/PNG image
2. Click "Submit Profile"
3. Image should upload to Firebase Storage
4. Should show success message
5. Image should appear immediately
6. After refresh, image should persist
✓ PASS
```

### Test 4: Security
```
1. As regular user, try to access /admin
2. Should redirect to /dashboard
3. Try accessing other user's submission data
4. Firestore rules should block access
✓ PASS
```

---

## 🐛 Common Issues & Fixes

### Issue: "No submissions yet" (for admin)
**Fix:** Check if submissions actually exist in Firestore. Submit a profile first.

### Issue: Image upload fails
**Fix:** 
- Check file is JPG/PNG
- Check file size < 5MB
- Check Storage rules are applied

### Issue: Can't access /admin
**Fix:**
- Verify user role is "admin" in Firestore
- Check AdminRoute component
- Check Firestore has /users/{uid} document

### Issue: User not redirected after login
**Fix:**
- Check useAuth hook is fetching role
- Verify /users/{uid} document exists
- Check RoleBasedRedirect component

---

## 📊 Database Collections

### /users/{uid}
```json
{
  "email": "user@example.com",
  "displayName": "User Name",
  "photoURL": "https://...",
  "phone": "+1234567890",
  "role": "admin|user",
  "location": "City",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### /submissions/{id}
```json
{
  "userId": "firebase_uid",
  "name": "John Doe",
  "email": "john@example.com",
  "description": "About me...",
  "photoURL": "https://...",
  "phone": "+1234567890",
  "location": "City",
  "timestamp": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 🔄 User Flow Diagram

```
Guest
  ↓
/auth/login → Create Account
  ↓
Firebase Auth validates
  ↓
useAuth fetches role from /users/{uid}
  ↓
RoleBasedRedirect checks role
  ↓
┌─────────────────────┐
│   Admin User        │      │   Normal User      │
│        ↓            │      │        ↓           │
│  /admin Dashboard   │      │  /dashboard        │
│  ├─View Submissions │      │  ├─Submit Profile  │
│  ├─View Stats       │      │  ├─View My Subs    │
│  └─Submit Profile   │      │  └─Update Profile  │
└─────────────────────┘      └────────────────────┘
```

---

## 📱 Component Props Reference

### ProfileSubmissionForm
```jsx
<ProfileSubmissionForm
  initialData={submission || null}    // For editing
  onSuccess={() => refreshData()}     // Callback
  showPhoneField={true}               // Optional phone field
/>
```

### AdminRoute / ProtectedRoute
```jsx
<Route path="/admin" element={<AdminRoute><Content /></AdminRoute>} />
<Route path="/dashboard" element={<ProtectedRoute><Content /></ProtectedRoute>} />
```

---

## 🛠️ Useful Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Debug - Check Firebase config
console.log(firebaseApp)

# Debug - Check current user
firebase.auth().currentUser

# Debug - Check Firestore rules
Firebase Console → Firestore → Rules → Simulator
```

---

## 💡 Pro Tips

1. **Use Firestore Emulator** for local development
2. **Enable Firestore logging** to debug rules:
   ```javascript
   import { enableLogging } from 'firebase/firestore'
   enableLogging(true)
   ```
3. **Test Storage** with browser DevTools Network tab
4. **Use Firestore Rules Simulator** to test security rules
5. **Monitor costs** - Image uploads use bandwidth

---

## 📞 Need Help?

1. Check browser console for errors (F12)
2. Check Firebase Console → Logs
3. Review ROLE_BASED_IMPLEMENTATION_GUIDE.md
4. Test Firestore rules in Simulator
5. Use browser DevTools Network tab to debug

---

## ✨ Next Steps

- [ ] Deploy to production
- [ ] Setup email verification
- [ ] Add user analytics
- [ ] Implement image optimization
- [ ] Add export functionality
- [ ] Setup automated backups

---

**Good luck! 🚀**
