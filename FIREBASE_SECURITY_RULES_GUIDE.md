# Firebase Production Security Rules for Versa

## 🔐 Overview

These security rules ensure that:
- Only authenticated users can read/write data
- Users can only modify their own submissions
- Admins have full access
- Storage is protected

---

## 📋 Firestore Database Rules

### Production Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read/write their own user document
    match /users/{userId} {
      allow read, create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false; // Users cannot delete their own profile
    }
    
    // Submissions collection
    match /submissions/{submissionId} {
      // Users can create submissions
      allow create: if request.auth != null;
      
      // Users can read all submissions they own
      // Admins can read all submissions
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Users can update their own submissions
      // Admins can update any submission
      allow update: if request.auth != null && 
                       (resource.data.userId == request.auth.uid || 
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Only admins can delete submissions
      allow delete: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your Versa project
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace existing rules with the code above
5. Click **Publish**
6. Wait for confirmation message

---

## 🗄️ Firebase Storage Rules

### Production Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Allow authenticated users to upload and read their own files
    match /submissions/{userId}/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
    
    // Allow only authenticated users to access profile images
    match /profiles/{userId}/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 2 * 1024 * 1024; // 2MB limit
    }
  }
}
```

### How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your Versa project
3. Navigate to **Storage** → **Rules** tab
4. Replace existing rules with the code above
5. Click **Publish**
6. Wait for confirmation message

---

## 🔑 Authentication Security

### Enable Required Sign-In Methods

1. Firebase Console → **Authentication** → **Sign-in method**
2. Enable:
   - ✅ **Email/Password** (for Signup/Login)
   - ✅ **Password reset** (for Reset Password feature)

### Add Authorized Domains

1. Firebase Console → **Authentication** → **Settings**
2. Scroll to "Authorized domains"
3. Add:
   - `versa-[your-id].vercel.app` (production)
   - `localhost:3000` (local development)

### Password Requirements

Current Firebase defaults:
- Minimum 6 characters
- Consider enforcing stronger requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 number

To enforce, add validation in your Signup component:
```javascript
const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const isLongEnough = password.length >= 8;
  
  return hasUpperCase && hasNumbers && isLongEnough;
};
```

---

## 👥 User Roles & Admin Setup

### Creating the Admin User

1. Go to Firebase Console → **Authentication**
2. Find your email in "Users" list
3. Copy the `UID`
4. Go to **Firestore** → **users** collection
5. Find your user document (ID = UID)
6. Add/Update field:
   - Field: `role`
   - Type: `string`
   - Value: `admin`

### Verifying Admin Access

Test that admin can access all submissions:

1. Login with admin user
2. Visit `/admin` route
3. Should see dashboard with all user submissions
4. Can edit/delete any submission

### Revoking Admin Access

1. Go to Firestore → **users** collection
2. Edit user document
3. Change `role` from `admin` to `user`
4. User loses admin access immediately

---

## 🛡️ Security Best Practices

### ✅ DO:

- ✅ Keep security rules restrictive by default
- ✅ Test rules with Firebase Security Rules simulator
- ✅ Review rules quarterly for changes needed
- ✅ Use authentication to prevent anonymous access
- ✅ Validate data on both client and server
- ✅ Use HTTPS for all connections (Vercel enforces this)
- ✅ Rotate API keys periodically
- ✅ Monitor Firebase console for unusual activity

### ❌ DON'T:

- ❌ Allow anonymous access to Firestore
- ❌ Allow users to access others' data
- ❌ Expose API keys in code or GitHub
- ❌ Disable security rules for "testing"
- ❌ Store sensitive data (passwords, tokens) in Firestore
- ❌ Allow unlimited file uploads (always set size limits)
- ❌ Skip authentication checks

---

## 🧪 Testing Rules Locally

### Using Firebase Emulator Suite

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize emulator:
```bash
firebase init emulator
```

3. Start emulator:
```bash
firebase emulators:start
```

4. Connect your app to emulator in development:
```javascript
// In FirebaseConfig.js (development only)
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

### Test in Firebase Console

Before deploying to production:

1. Firebase Console → **Firestore** → **Rules** tab
2. Click "**Rules playground**" button
3. Test different scenarios:
   - Authenticated user can read own submission
   - Authenticated user cannot read others' submission
   - Admin can read all submissions
   - Unauthenticated user cannot read anything

---

## 📊 Monitoring & Alerts

### Set Up Alerts

1. Firebase Console → **Usage & analytics**
2. Check for:
   - Unusual spike in read/write operations
   - Large uploads exceeding 5MB
   - Failed authentication attempts

### Monitor Storage Usage

1. Firebase Console → **Storage** → **Files**
2. View:
   - Total storage used
   - Largest files
   - Upload activity

### Review Access Logs

1. Firebase Console → **Firestore** → **Audit logs**
2. View:
   - Who accessed what data
   - When data was modified
   - Failed access attempts

---

## 🚨 Incident Response

### If Security Issue Detected

**Immediate Actions:**
1. Review Firebase console for unauthorized access
2. Disable affected user accounts
3. Rotate API keys if compromised
4. Review and update security rules
5. Notify affected users

**Recovery:**
1. Update security rules
2. Force password reset for affected users
3. Re-enable accounts after verification
4. Deploy updated rules to production

---

## 📝 Security Checklist

- [ ] Firestore rules applied and tested
- [ ] Storage rules applied and tested
- [ ] Only email/password auth enabled
- [ ] Vercel domain added to authorized domains
- [ ] No sensitive data in rules
- [ ] User can only access own data
- [ ] Admins have elevated privileges
- [ ] File upload size limits enforced (5MB)
- [ ] Rules tested in simulator before production
- [ ] Monitoring alerts configured

---

## 🔄 Regular Security Review

**Monthly:**
- Review Firestore audit logs
- Check for unusual access patterns
- Verify no new security issues

**Quarterly:**
- Update security rules if needed
- Review and rotate API keys
- Update Firebase SDKs

**Annually:**
- Full security audit
- Penetration testing (optional)
- Update documentation

---

## 📚 Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Storage Security Rules Documentation](https://firebase.google.com/docs/storage/security/start)
- [Firebase Authentication Best Practices](https://firebase.google.com/docs/auth/best-practices)
- [OWASP Web Application Security](https://owasp.org/www-project-top-ten/)

---

**Apply these rules before deploying to production! Security is critical.**
