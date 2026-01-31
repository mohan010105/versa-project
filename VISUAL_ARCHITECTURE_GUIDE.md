# 🎨 Visual Architecture Guide - Role-Based Dashboard

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        VERSA APPLICATION                             │
│                     (React + Firebase)                               │
└──────────────────────────────────────────────────────────────────────┘

                              Frontend (React)
                    ┌─────────────────────────────────┐
                    │                                 │
           ┌────────┴──────┐              ┌──────────┴───────┐
           │                │              │                  │
        Auth Routes       Protected       Admin           User
        /auth/*          Routes           Routes         Routes
           │              ├─ /           ├─ /admin       ├─ /dashboard
           ├─ login       ├─ Home        └─ Detail view  ├─ Submissions
           ├─ signup      └─ Generic                      └─ Form
           └─ reset                                          │
                          RoleBasedRedirect                  │
                                  │                          │
                ┌───────────────┬──┴──────────────┬─────────┘
                │               │                 │
            (Checks role)    ADMIN             USER
                │               │                 │
        Role = "admin"?         ↓                 ↓
                │          AdminDashboard   UserDashboard
            YES/NO         ├─ View All      ├─ Submit Form
                │          │   Submissions  ├─ My Submissions
                ├──────→ ├─ Statistics     └─ Edit Profile
                │        └─ Admin Submit        │
                │               │              │
                └──────────────┬┴──────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                Firebase Functions    Firebase Hooks
               ┌─────────────────┐   (useAuth)
               │ Firestore.js    │   │
               ├─ Users          │   ├─ Fetch user
               ├─ Submissions    │   ├─ Fetch role
               └─ Roles          │   └─ Auto-init
                                 │
                    ┌────────────┴─────────────┐
                    │                          │
                Firebase Backend         Storage
               ┌──────────────────┐   ┌────────────────┐
               │ Authentication   │   │ Profile Photos │
               ├─ Email/Password  │   ├─ Upload        │
               ├─ JWT Tokens      │   ├─ Validation    │
               └─ User Sessions   │   └─ Download URLs │
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
               Firestore Database         Security Rules
              ┌──────────────────┐      ┌───────────────────┐
              │ /users           │      │ /users/{uid}      │
              │ /submissions     │      │ - Read own only   │
              │ /roles (implicit)│      │ - Write own only  │
              │                  │      │                   │
              │ Collections      │      │ /submissions      │
              │ - Documents      │      │ - Read all (auth) │
              │ - Fields         │      │ - Write own only  │
              │ - Timestamps     │      │                   │
              └──────────────────┘      └───────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  USER AUTHENTICATION FLOW                   │
└─────────────────────────────────────────────────────────────┘

START: User visits application
  │
  ↓
Is user logged in? (Check Firebase Auth)
  │
  ├─→ NO: Redirect to /auth/login
  │        │
  │        ↓
  │     User enters email & password
  │        │
  │        ↓
  │     Firebase Auth validates
  │        │
  │        ├─→ Invalid: Show error
  │        │
  │        └─→ Valid: Create session
  │
  └─→ YES: Session exists
           │
           ↓
       useAuth hook triggers
           │
           ↓
       onAuthStateChanged fires
           │
           ├─→ Get current user
           │
           ↓
       New user? Check /users/{uid} in Firestore
           │
           ├─→ Does NOT exist: Create with role: "user"
           │
           └─→ Exists: Fetch role from Firestore
               │
               ↓
           Return { user, role, loading }
               │
               ├─ user: Firebase User object
               ├─ role: "admin" | "user"
               └─ loading: boolean
               
           │
           ↓
       RoleBasedRedirect component
           │
           ├─→ Check role
           │
           ├─→ role === "admin" → Redirect to /admin
           │
           └─→ role === "user" → Redirect to /dashboard
               │
               ↓
           Dashboard loads
               │
               ├─→ AdminDashboard: Shows all submissions
               │
               └─→ UserDashboard: Shows profile form
```

---

## Image Upload Process

```
┌──────────────────────────────────────────────────────────────┐
│              PROFILE IMAGE UPLOAD FLOW                        │
└──────────────────────────────────────────────────────────────┘

User clicks image input in ProfileSubmissionForm
  │
  ↓
handleImageChange() event fired
  │
  ├─→ Get file from input
  │
  ├─→ validateImageFile(file)
  │    │
  │    ├─→ Check file type
  │    │   ├─ Allowed: image/jpeg, image/png
  │    │   └─ Rejected: Other types (GIF, BMP, etc.)
  │    │
  │    ├─→ Check file size
  │    │   ├─ Allowed: < 5MB
  │    │   └─ Rejected: > 5MB
  │    │
  │    └─→ Return result or throw error
  │
  ├─→ If error: Show error message
  │
  └─→ If valid: Set image state & show preview
                │
                ↓
        User clicks "Submit Profile"
                │
                ↓
        handleSubmit() function
                │
                ├─→ Validate form fields
                │    ├─ Name required
                │    ├─ Description required
                │    └─ Location required
                │
                ├─→ If validation fails: Show error
                │
                └─→ If validation passes:
                     │
                     ├─→ uploadProfileImage(userId, file)
                     │    │
                     │    ├─→ Validate again
                     │    │
                     │    ├─→ Create unique filename
                     │    │    └─ pattern: {timestamp}_{filename}
                     │    │
                     │    ├─→ Upload to Firebase Storage
                     │    │    └─ path: profile-photos/{userId}/*
                     │    │
                     │    └─→ getDownloadURL()
                     │        └─ Returns: https://storage.firebase.com/...
                     │
                     ├─→ Save user profile to Firestore
                     │    └─ /users/{uid}
                     │       {
                     │         name, email, description,
                     │         photoURL, phone, location
                     │       }
                     │
                     ├─→ Create submission in Firestore
                     │    └─ /submissions/{auto_id}
                     │       {
                     │         userId, name, email, description,
                     │         photoURL, phone, location, timestamp
                     │       }
                     │
                     ├─→ Update Firebase Auth.photoURL
                     │    └─ updateProfile(user, { photoURL })
                     │
                     └─→ Show success message
                         │
                         ↓
                     Image displays immediately
                     (from memory & Firestore)
                         │
                         ↓
                     After refresh, image loads
                     from Firebase Storage
```

---

## Role-Based Access Control

```
┌───────────────────────────────────────────────────────────┐
│          ROLE-BASED ACCESS CONTROL (RBAC)                │
└───────────────────────────────────────────────────────────┘

                    User Logs In
                         │
                         ↓
            Fetch role from Firestore
                (/users/{uid}.role)
                         │
         ┌───────────────┴─────────────┐
         │                             │
      role="user"                 role="admin"
         │                             │
         ↓                             ↓
    /dashboard                     /admin
    (UserDashboard)            (AdminDashboard)
         │                             │
    Can do:                       Can do:
    ├─ Submit profile            ├─ View all submissions
    ├─ Update own profile        ├─ View user details
    ├─ View own submissions      ├─ See statistics
    ├─ Upload own image          ├─ Submit own profile
    └─ Edit own data             ├─ Update own profile
                                  └─ See all user data
    Cannot do:                   Cannot do:
    ├─ View /admin               ├─ Restrict to /dashboard
    ├─ See other users           ├─ Limited to user features
    ├─ See all submissions       └─ (none - admins have all)
    └─ Access admin features


    FIRESTORE ENFORCEMENT:
    
    /users/{userId}
    ├─ READ: isOwner(userId) OR isAdmin()
    ├─ WRITE: isOwner(userId) only
    └─ DELETE: isOwner(userId) only
    
    /submissions/{submissionId}
    ├─ READ: isAuthenticated()
    ├─ WRITE: userId must match request.auth.uid
    │         OR isAdmin()
    └─ DELETE: isOwner(userId) OR isAdmin()
```

---

## Component Hierarchy

```
App.jsx
├── BrowserRouter
│   └── Routes
│       ├── /auth/login → Login.jsx
│       ├── /auth/signup → Signup.jsx
│       ├── /auth/reset-password → ResetPassword.jsx
│       │
│       ├── / → ProtectedRoute
│       │   └── RoleBasedRedirect
│       │       ├── if admin → /admin
│       │       └── if user → /dashboard
│       │
│       ├── /admin → AdminRoute
│       │   └── AdminDashboard.jsx
│       │       ├── Header
│       │       │   ├── Title & user info
│       │       │   └── Logout button
│       │       ├── Navigation tabs
│       │       │   ├── "Submissions" → SubmissionsList
│       │       │   └── "Submit Profile" → ProfileSubmissionForm
│       │       └── Main content
│       │           ├── SubmissionGrid
│       │           │   ├── SubmissionCard (repeating)
│       │           │   │   ├── Image thumbnail
│       │           │   │   ├── User avatar & name
│       │           │   │   ├── Description
│       │           │   │   └── Location
│       │           │   └── Statistics cards
│       │           └── DetailView (onClick card)
│       │               ├── Large image
│       │               ├── Full description
│       │               ├── Metadata grid
│       │               └── User sidebar
│       │
│       └── /dashboard → ProtectedRoute
│           └── UserDashboard.jsx
│               ├── Header
│               │   ├── Title & user info
│               │   └── Logout button
│               ├── Navigation tabs
│               │   ├── "Submit Profile" → ProfileSubmissionForm
│               │   └── "My Submissions" → SubmissionsList
│               └── Main content
│                   ├── ProfileSubmissionForm.jsx
│                   │   ├── Image upload
│                   │   │   ├── File input
│                   │   │   ├── Image preview
│                   │   │   └── Validation error
│                   │   ├── Form fields
│                   │   │   ├── Name (Input)
│                   │   │   ├── Email (Input, read-only)
│                   │   │   ├── Description (textarea)
│                   │   │   ├── Phone (Input, optional)
│                   │   │   └── Location (Input, auto-detect)
│                   │   └── Submit button
│                   └── SubmissionsList
│                       ├── Empty state (if no submissions)
│                       └── SubmissionItem (repeating)
│                           ├── Thumbnail image
│                           ├── Name & date
│                           ├── "Latest" badge
│                           └── Metadata (email, phone, location)

SHARED COMPONENTS:
├── Button.jsx - Primary, secondary, ghost, danger variants
├── Card.jsx - Container with styling
├── Input.jsx - Text input with floating label
├── PasswordInput.jsx - Masked password input
└── Loader.jsx - Loading spinner
```

---

## Data Flow Diagram

```
STATE MANAGEMENT & DATA FLOW

┌─────────────────────────────────────────────────────────┐
│               React State Management                    │
└─────────────────────────────────────────────────────────┘

useAuth Hook (Global User State)
  ├─ user: Firebase User object
  │   ├─ uid: "firebase_user_id"
  │   ├─ email: "user@example.com"
  │   ├─ displayName: "User Name"
  │   └─ photoURL: "https://storage.firebase.com/..."
  ├─ role: "admin" | "user"
  ├─ loading: boolean
  └─ error: string | null

Component Local State
  ├── AdminDashboard
  │   ├─ submissions: [Submission]
  │   ├─ userProfiles: { [userId]: UserProfile }
  │   ├─ selectedId: string
  │   ├─ view: "submissions" | "detail" | "profile"
  │   └─ stats: { totalSubmissions, totalUsers }
  │
  ├── UserDashboard
  │   ├─ submissions: [Submission]
  │   ├─ latestSubmission: Submission | null
  │   └─ view: "form" | "history"
  │
  └── ProfileSubmissionForm
      ├─ formData: { name, email, description, phone, location }
      ├─ image: File | null
      ├─ imagePreview: string | null
      ├─ imageError: string | null
      ├─ loading: boolean
      ├─ success: boolean
      └─ error: string | null

Data Flow Arrows:
  useAuth ←→ Firestore (/users)
  Dashboard ←→ Firestore (/submissions)
  Form ←→ Firebase Storage (images)
  Form ←→ Firestore (/users, /submissions)
  Form ←→ Firebase Auth (photoURL)
```

---

## Security Model

```
┌────────────────────────────────────────────────────┐
│            SECURITY LAYERS                         │
└────────────────────────────────────────────────────┘

LAYER 1: Authentication
  ├─ Firebase Auth handles login/signup
  ├─ Email/password validation
  ├─ JWT tokens issued
  └─ Session management

LAYER 2: Role Assignment
  ├─ Roles stored in Firestore (/users)
  ├─ Fetched on user auth
  ├─ New users = "user" role
  └─ Admins manually set to "admin"

LAYER 3: Frontend Protection
  ├─ ProtectedRoute blocks non-auth
  ├─ AdminRoute blocks non-admin
  ├─ RoleBasedRedirect prevents manual URL access
  └─ Components check role for conditional rendering

LAYER 4: Firestore Rules
  ├─ /users access controlled
  ├─ /submissions access controlled
  ├─ Write operations validated
  └─ Unauthenticated requests blocked

LAYER 5: Storage Rules
  ├─ Only authenticated users upload
  ├─ Max 5MB files
  ├─ Only images allowed
  └─ Upload to own folder only

LAYER 6: Input Validation
  ├─ Image type validation (JPG/PNG)
  ├─ Image size validation (< 5MB)
  ├─ Form field validation
  └─ Error messages

ATTACK PREVENTION:
├─ Cannot fake role (backend validated)
├─ Cannot access other users' data (rules block)
├─ Cannot upload large files (validated)
├─ Cannot upload non-images (validated)
└─ Cannot bypass frontend (Firestore rules enforce)
```

---

## File Organization

```
versa-project/
│
├── 📁 src/
│   ├── 📁 Firebase/
│   │   ├── Auth.js
│   │   ├── FirebaseConfig.js (NEEDS UPDATE)
│   │   ├── Firestore.js (ENHANCED)
│   │   └── Storage.js (ENHANCED)
│   │
│   ├── 📁 hooks/
│   │   └── useAuth.js (ENHANCED)
│   │
│   ├── 📁 routes/
│   │   ├── ProtectedRoute.jsx (UPDATED)
│   │   ├── AdminRoute.jsx (NEW)
│   │   └── RoleBasedRedirect.jsx (NEW)
│   │
│   ├── 📁 components/
│   │   ├── AdminDashboard.jsx (NEW)
│   │   ├── UserDashboard.jsx (NEW)
│   │   ├── ProfileSubmissionForm.jsx (NEW)
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── PasswordInput.jsx
│   │   └── Loader.jsx
│   │
│   ├── 📁 auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ResetPassword.jsx
│   │   └── auth.css
│   │
│   ├── 📁 pages/
│   │   ├── Home.jsx
│   │   ├── Admin.jsx (legacy)
│   │   └── Collector.jsx (legacy)
│   │
│   ├── App.jsx (REFACTORED)
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── 📁 public/
│
├── 📄 ROLE_BASED_IMPLEMENTATION_GUIDE.md (NEW)
├── 📄 QUICK_START.md (NEW)
├── 📄 TEST_PLAN.md (NEW)
├── 📄 DEPLOYMENT_CHECKLIST.md (NEW)
├── 📄 IMPLEMENTATION_SUMMARY.md (NEW)
├── 📄 FINAL_REPORT.md (NEW)
├── 📄 FIRESTORE_SECURITY_RULES.txt (NEW)
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── other config files...
```

---

## User Journey Map

```
ADMIN USER JOURNEY:

Sign Up / Log In
    ↓
Firebase validates
    ↓
Fetch role = "admin"
    ↓
Redirect to /admin
    ↓
See Admin Dashboard
    ├─ View all submissions
    │   ├─ Grid of cards
    │   └─ Click for details
    ├─ View statistics
    └─ Submit own profile
        ├─ Fill form
        ├─ Upload image
        └─ Submit
    ↓
Done!


NORMAL USER JOURNEY:

Sign Up
    ↓
Firebase creates user
    ↓
Auto-init with role = "user"
    ↓
Redirect to /dashboard
    ↓
See User Dashboard
    ├─ Submit Profile section
    │   ├─ Fill form fields
    │   ├─ Upload image (JPG/PNG)
    │   ├─ Auto-detect location
    │   └─ Click "Submit Profile"
    │       ├─ Image validates
    │       ├─ Upload to Storage
    │       ├─ Save to Firestore
    │       └─ Show success
    └─ View My Submissions
        ├─ List own submissions
        └─ See submission details
    ↓
Edit existing submission
    ├─ Go to form
    ├─ Data pre-fills
    ├─ Update form
    ├─ Upload new image
    └─ Click "Update Profile"
    ↓
Done!
```

---

This visual guide should help understand the complete system architecture and data flows!
