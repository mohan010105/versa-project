# Role-Based Dashboard Implementation Guide

## 🎯 Overview

This document outlines the complete implementation of a role-based dashboard system for the Versa application. The system supports two user roles: **Admin** and **User**, with different access levels and capabilities.

---

## 📋 Architecture Overview

### User Roles

```
┌─────────────────────────────────────────────────────────────┐
│                    USER ROLES                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. ADMIN                          2. USER                  │
│  ├── Submit profile                ├── Submit own profile   │
│  ├── View all submissions          ├── View only own        │
│  ├── Access /admin                 ├── Access /dashboard   │
│  └── Manage user data              └── Limited permissions  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Routing Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  User Logs In                                                │
│        ↓                                                      │
│  Firebase Auth validates credentials                         │
│        ↓                                                      │
│  useAuth hook fetches role from Firestore                    │
│        ↓                                                      │
│  RoleBasedRedirect component activated                       │
│        ↓                                                      │
│  ┌─────────────────────────────────────┐                     │
│  │ Check user role                     │                     │
│  └──────────────┬──────────────────────┘                     │
│                 │                                             │
│         ┌───────┴────────┐                                   │
│         ↓                ↓                                    │
│     ADMIN          NORMAL USER                               │
│         ↓                ↓                                    │
│    /admin          /dashboard                                │
│   Dashboard         Dashboard                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Firebase Setup Instructions

### 1. Enable Required Services

In Firebase Console:

1. **Enable Firebase Authentication**
   - Go to Authentication → Sign-in method
   - Enable Email/Password authentication

2. **Create Firestore Database**
   - Go to Firestore Database
   - Create database in Production mode
   - Start with secure rules (see next section)

3. **Setup Firebase Storage**
   - Go to Storage
   - Create bucket
   - Configure storage rules (see next section)

### 2. Apply Firestore Security Rules

Go to **Firestore → Rules** and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId);
      allow delete: if isAuthenticated() && isOwner(userId);
    }
    
    // Submissions collection
    match /submissions/{submissionId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && 
                        (isOwner(resource.data.userId) || isAdmin());
      allow delete: if isAuthenticated() && 
                        (isOwner(resource.data.userId) || isAdmin());
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. Setup Firebase Storage Rules

Go to **Storage → Rules** and replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Allow authenticated users to upload to their own folders
    match /{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow create, update: if request.auth.uid == userId &&
                              request.resource.size < 5 * 1024 * 1024 &&
                              request.resource.contentType.matches('image/.*');
      allow delete: if request.auth.uid == userId;
    }
  }
}
```

### 4. Initialize Admin User (IMPORTANT)

Use Firebase Admin SDK or directly in Firestore Console to create the first admin:

1. Create a user via Firebase Authentication
2. In Firestore, go to Collection `users` and add document with user ID
3. Set the following fields:
   ```json
   {
     "uid": "user_id_here",
     "email": "admin@example.com",
     "displayName": "Admin User",
     "role": "admin",
     "createdAt": "timestamp",
     "updatedAt": "timestamp"
   }
   ```

---

## 📁 Project Structure

```
src/
├── Firebase/
│   ├── Auth.js                 # Firebase Auth setup
│   ├── FirebaseConfig.js       # Firebase config
│   ├── Firestore.js            # Enhanced with role management
│   └── Storage.js              # Image upload with validation
│
├── hooks/
│   └── useAuth.js              # Enhanced with role fetching
│
├── routes/
│   ├── ProtectedRoute.jsx      # General auth protection
│   ├── AdminRoute.jsx          # Admin-only protection (NEW)
│   └── RoleBasedRedirect.jsx   # Automatic role-based routing (NEW)
│
├── components/
│   ├── AdminDashboard.jsx      # Admin dashboard (NEW)
│   ├── UserDashboard.jsx       # User dashboard (NEW)
│   ├── ProfileSubmissionForm.jsx # Profile submission form (NEW)
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   └── Loader.jsx
│
├── auth/
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── ResetPassword.jsx
│
├── pages/
│   ├── Admin.jsx               # (Legacy)
│   ├── Collector.jsx           # (Legacy)
│   └── Home.jsx
│
└── App.jsx                     # Updated routing
```

---

## 🔄 Data Flow

### Authentication & Role Fetching

```javascript
// 1. User logs in
Firebase Auth validates email/password

// 2. useAuth hook triggers
onAuthStateChanged() fires with currentUser

// 3. Fetch user role from Firestore
const userRole = await getUserRole(userId)

// 4. Return { user, role, loading }
useAuth returns role = 'admin' | 'user'

// 5. Components use role for conditional rendering
if (role === 'admin') → show AdminDashboard
else → show UserDashboard
```

### Image Upload Process

```javascript
// 1. User selects image in ProfileSubmissionForm
handleImageChange(e)
  → validateImageFile(file)
    ✓ Check type (JPG/PNG only)
    ✓ Check size (max 5MB)

// 2. On form submit
handleSubmit()
  → uploadProfileImage(userId, file)
    → Firebase Storage

// 3. Get download URL
const photoURL = await getDownloadURL(fileRef)

// 4. Save to Firestore
await saveUserProfile(userId, { photoURL })

// 5. Update Firebase Auth
await updateProfile(user, { photoURL })
```

### Submission Flow

```
┌──────────────────────────────────────────────────┐
│  User fills ProfileSubmissionForm                │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
         ┌───────────────────┐
         │ Validate input    │
         │ Validate image    │
         └────────┬──────────┘
                  │
                  ↓
         ┌───────────────────┐
         │ Upload image to   │
         │ Firebase Storage  │
         └────────┬──────────┘
                  │
                  ↓
         ┌───────────────────┐
         │ Get download URL  │
         └────────┬──────────┘
                  │
                  ↓
    ┌────────────────────────────┐
    │ Save to Firestore:         │
    │ 1. User profile in /users  │
    │ 2. Submission in /submit.  │
    │ 3. Auth profile photoURL   │
    └────────────────────────────┘
```

---

## 🛡️ Security Implementation

### 1. Role-Based Access Control (RBAC)

**Frontend Protection:**
- `AdminRoute` component blocks non-admin access
- `ProtectedRoute` blocks unauthenticated access
- `RoleBasedRedirect` auto-redirects based on role

**Backend Protection (Firestore Rules):**
```firestore
// Users can only read/write own profile
match /users/{userId} {
  allow read: if isOwner(userId) || isAdmin();
  allow write: if isOwner(userId);
}

// Users can only see own submissions (frontend filters)
// Admins can see all
match /submissions/{submissionId} {
  allow read: if isAuthenticated();
  allow write: if isOwner(resource.data.userId);
}
```

### 2. Image Upload Security

```javascript
// Validation before upload
validateImageFile(file)
  ✓ Type: Only JPG/PNG allowed
  ✓ Size: Max 5MB
  ✓ Prevents malicious uploads

// Storage rules enforce:
  ✓ Only authenticated users can upload
  ✓ Max 5MB file size
  ✓ Only image files
  ✓ Users can only upload to their folder
```

### 3. Firebase Credentials

**NOT hardcoded in frontend** - Config is in:
```javascript
// src/Firebase/FirebaseConfig.js
// Read-only API key with Firestore/Storage restrictions
```

**Security rules** enforce:
- Users can't access other users' data
- Admins have elevated privileges
- All operations logged in Firestore

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
npm install firebase framer-motion react-router-dom
```

### 2. Update Firebase Config

Edit `src/Firebase/FirebaseConfig.js`:

```javascript
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}

export const firebaseApp = initializeApp(firebaseConfig)
```

### 3. Apply Firestore Rules

- Copy rules from `FIRESTORE_SECURITY_RULES.txt`
- Paste in Firebase Console → Firestore → Rules

### 4. Create Admin User

Use Firebase Console or Admin SDK to create first admin user with `role: "admin"`

### 5. Test the Application

```bash
npm run dev
```

**Test Cases:**

1. **Sign up new user**
   - Should auto-initialize with role: "user"
   - Redirect to /dashboard

2. **Login as admin**
   - Should redirect to /admin
   - Should see all submissions

3. **Upload profile**
   - Select image (test JPG/PNG validation)
   - Submit form
   - Image should upload to Storage
   - Appear in Firestore
   - Display immediately

4. **Test security**
   - Try accessing /admin as normal user → redirect to /dashboard
   - Try accessing other users' data → Firestore rules block

---

## 📊 Database Schema

### Users Collection

```json
{
  "uid": "firebase_user_id",
  "email": "user@example.com",
  "displayName": "User Name",
  "photoURL": "https://storage.firebase.com/...",
  "phone": "+1234567890",
  "role": "admin|user",
  "location": "City, Country",
  "createdAt": "2024-01-31T10:00:00Z",
  "updatedAt": "2024-01-31T10:00:00Z"
}
```

### Submissions Collection

```json
{
  "id": "auto_generated",
  "userId": "firebase_user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "description": "About the user",
  "photoURL": "https://storage.firebase.com/...",
  "phone": "+1234567890",
  "location": "City, Country",
  "timestamp": "2024-01-31T10:00:00Z",
  "updatedAt": "2024-01-31T10:00:00Z"
}
```

---

## 🎨 Component Reference

### AdminDashboard

**Location:** `src/components/AdminDashboard.jsx`

**Features:**
- View all submissions in grid/list view
- View submission details
- Submit own admin profile
- View statistics (total submissions, total users)
- Protected to admin role only

**Props:** None (uses useAuth hook)

### UserDashboard

**Location:** `src/components/UserDashboard.jsx`

**Features:**
- Submit profile form
- View own submissions history
- Update existing profile
- Protected to normal user role

**Props:** None (uses useAuth hook)

### ProfileSubmissionForm

**Location:** `src/components/ProfileSubmissionForm.jsx`

**Features:**
- Profile photo upload with validation
- Form validation
- Firestore submission
- Firebase Auth photoURL update
- Error handling
- Loading states

**Props:**
```javascript
{
  initialData: null,           // For editing existing submission
  onSuccess: () => {},         // Callback after submission
  showPhoneField: true         // Toggle phone field visibility
}
```

### AdminRoute

**Location:** `src/routes/AdminRoute.jsx`

**Features:**
- Protects admin-only routes
- Redirects non-admin users
- Shows loading state

**Usage:**
```jsx
<Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
```

---

## 🔧 API Reference

### Firestore Functions (Enhanced)

```javascript
// User management
initializeUserProfile(userId, userData)    // Create new user profile
saveUserProfile(userId, userData)          // Update user profile
getUserProfile(userId)                     // Get user profile
getUserRole(userId)                        // Get user role
updateUserRole(userId, role)               // Update role (admin only)

// Submission management
addSubmission(userId, data)                // Create new submission
updateSubmission(submissionId, data)       // Update submission
getSubmissions()                           // Get all submissions (filter on client)
getUserSubmissions(userId)                 // Get user's own submissions
getLatestUserSubmission(userId)            // Get most recent submission
```

### Storage Functions (Enhanced)

```javascript
// Image validation and upload
validateImageFile(file)                    // Validate file type/size
uploadProfileImage(userId, file)           // Upload to profile-photos
uploadSubmissionImage(userId, file)        // Upload to submissions
deleteImage(path)                          // Delete image from storage
uploadFile(path, file)                     // Generic upload (legacy)
```

### useAuth Hook (Enhanced)

```javascript
const { user, role, loading, error } = useAuth()

// Returns:
// user:    Firebase User object or null
// role:    'admin' | 'user' | null
// loading: boolean
// error:   Error message or null
```

---

## 🐛 Troubleshooting

### Issue: User role not loading

**Solution:**
1. Check Firestore Security Rules are applied
2. Verify user document exists in `/users/{uid}`
3. Check browser console for errors
4. Clear browser cache and reload

### Issue: Image upload fails

**Solution:**
1. Check file size < 5MB
2. Check file type is JPG or PNG
3. Check Firebase Storage bucket exists
4. Check Storage Rules are applied
5. Check browser console for error message

### Issue: Submissions not appearing

**Solution:**
1. Check Firestore Rules allow read access
2. Verify submission documents exist
3. Check userId matches
4. Use browser DevTools → Network tab to debug

### Issue: User gets redirected on every page

**Solution:**
1. Check role is properly fetched from Firestore
2. Verify Firebase Auth is initialized
3. Check useAuth hook for errors
4. Clear local storage and reauthenticate

---

## 📝 Best Practices

1. **Never hardcode roles in frontend** - Always fetch from Firestore
2. **Always validate user input** - Check file types, sizes, etc.
3. **Use Firestore rules** - Don't rely only on frontend checks
4. **Handle loading states** - Show loaders while fetching
5. **Error handling** - Always catch errors and show user-friendly messages
6. **Test security** - Manually test accessing restricted routes
7. **Monitor Firestore costs** - Image uploads can be expensive
8. **Clean up unused images** - Implement image deletion

---

## 🚀 Future Enhancements

1. **Email Verification** - Require email verification before accessing dashboard
2. **User Management** - Admin panel to promote/demote users
3. **Image Cropping** - Allow users to crop images before upload
4. **Submission Approval** - Admin approval workflow
5. **Analytics Dashboard** - View submission statistics
6. **Batch Operations** - Admin bulk delete/export
7. **Audit Logging** - Track all user actions
8. **Rate Limiting** - Prevent submission spam

---

## 📞 Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console for debugging
3. Verify Firestore Rules and Security Rules
4. Check network requests in DevTools
5. Review this guide's troubleshooting section

---

## ✅ Implementation Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] Firestore Security Rules applied
- [ ] Storage Rules applied
- [ ] Firebase Config updated in code
- [ ] Admin user created
- [ ] Dependencies installed
- [ ] Application tested locally
- [ ] Role-based routing verified
- [ ] Image upload tested
- [ ] Submissions verified in Firestore
- [ ] Deployed to production

---

**Last Updated:** January 31, 2024
**Version:** 1.0
