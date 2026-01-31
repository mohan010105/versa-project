# 🧪 Comprehensive Test Plan - Role-Based Dashboard

## Test Overview

This document provides comprehensive test cases for the role-based dashboard system.

---

## 🎯 Test Scenarios

### 1. AUTHENTICATION TESTS

#### 1.1 User Signup (New User = "user" Role)
```
Test: New User Registration
Steps:
  1. Navigate to /auth/signup
  2. Enter email: testuser@example.com
  3. Enter password: SecurePass123!
  4. Confirm password: SecurePass123!
  5. Click "Sign Up"

Expected:
  ✓ User created in Firebase Auth
  ✓ User document created in /users/{uid} with role: "user"
  ✓ Redirect to /dashboard
  ✓ No /admin access

Result: PASS/FAIL
```

#### 1.2 User Login
```
Test: Existing User Login
Steps:
  1. Navigate to /auth/login
  2. Enter email: testuser@example.com
  3. Enter password: SecurePass123!
  4. Click "Login"

Expected:
  ✓ Firebase Auth validates credentials
  ✓ useAuth hook fetches user role
  ✓ Redirect to /dashboard (user role) or /admin (admin role)
  ✓ User display name shows in header

Result: PASS/FAIL
```

#### 1.3 Admin Login
```
Test: Admin User Login
Steps:
  1. Navigate to /auth/login
  2. Enter email: admin@example.com (pre-created admin)
  3. Enter password: AdminPass123!
  4. Click "Login"

Expected:
  ✓ Redirect to /admin (not /dashboard)
  ✓ See "Admin Dashboard" header
  ✓ See submissions list
  ✓ See statistics cards

Result: PASS/FAIL
```

#### 1.4 Invalid Credentials
```
Test: Login with Invalid Credentials
Steps:
  1. Go to /auth/login
  2. Enter wrong email or password
  3. Click "Login"

Expected:
  ✓ Error message appears
  ✓ User not authenticated
  ✓ Stay on /auth/login page

Result: PASS/FAIL
```

---

### 2. ROLE-BASED ROUTING TESTS

#### 2.1 User Auto-Redirect to Dashboard
```
Test: Normal User Redirect
Steps:
  1. Login as normal user
  2. Go to /
  3. Observe redirect

Expected:
  ✓ Redirect to /dashboard automatically
  ✓ Should NOT go to /admin

Result: PASS/FAIL
```

#### 2.2 Admin Auto-Redirect to Admin
```
Test: Admin User Redirect
Steps:
  1. Login as admin user
  2. Go to /
  3. Observe redirect

Expected:
  ✓ Redirect to /admin automatically
  ✓ Should NOT go to /dashboard

Result: PASS/FAIL
```

#### 2.3 Prevent User Access to /admin
```
Test: Non-Admin Access Prevention
Steps:
  1. Login as normal user
  2. Manually type /admin in URL
  3. Press Enter

Expected:
  ✓ Redirect to /dashboard
  ✓ See message or just redirect silently
  ✓ Cannot access admin features

Result: PASS/FAIL
```

#### 2.4 Prevent Admin Access to /dashboard
```
Test: Admin Dashboard Access
Steps:
  1. Login as admin user
  2. Manually type /dashboard in URL
  3. Press Enter

Expected:
  ✓ Should allow admin to /dashboard (optional)
  OR
  ✓ Redirect back to /admin
  
Behavior depends on implementation

Result: PASS/FAIL
```

---

### 3. PROFILE SUBMISSION FORM TESTS

#### 3.1 Submit Profile with Valid Data
```
Test: Create First Profile
Steps:
  1. Login as normal user
  2. Go to /dashboard
  3. Fill "Submit Profile" form:
     - Name: John Doe
     - Email: john@example.com (auto-filled)
     - Description: I am a software developer
     - Phone: +1-234-567-8900
     - Location: San Francisco, CA
  4. Select JPG image (< 5MB)
  5. Click "Submit Profile"

Expected:
  ✓ Image uploads to Firebase Storage
  ✓ Success message appears
  ✓ Submission appears in Firestore /submissions
  ✓ User profile updated in /users/{uid}
  ✓ Auth.currentUser.photoURL updated
  ✓ Image displays immediately

Result: PASS/FAIL
```

#### 3.2 Image Validation - File Type
```
Test: Reject Invalid Image Type
Steps:
  1. In Profile Form, select GIF or BMP image
  2. Click upload

Expected:
  ✓ Error message: "Invalid file type. Only JPG and PNG are allowed."
  ✓ Image not uploaded
  ✓ Form not submitted

Result: PASS/FAIL
```

#### 3.3 Image Validation - File Size
```
Test: Reject Large Image
Steps:
  1. In Profile Form, select image > 5MB
  2. Click upload

Expected:
  ✓ Error message: "File size exceeds 5MB limit"
  ✓ Image not uploaded
  ✓ Form not submitted

Result: PASS/FAIL
```

#### 3.4 Require Name and Description
```
Test: Validate Required Fields
Steps:
  1. Open Profile Form
  2. Leave Name blank
  3. Fill Description
  4. Click "Submit Profile"

Expected:
  ✓ Error message: "Name is required"
  ✓ Form not submitted

Result: PASS/FAIL
```

#### 3.5 Update Existing Profile
```
Test: Edit Submitted Profile
Steps:
  1. Login as user who has existing submission
  2. Go to /dashboard → "Submit Profile"
  3. Should show previous data in form
  4. Change description: "New description"
  5. Select different image
  6. Click "Update Profile"

Expected:
  ✓ Previous image removed from form
  ✓ New image uploaded
  ✓ Submission updated in Firestore
  ✓ Success message appears
  ✓ Changes appear immediately

Result: PASS/FAIL
```

#### 3.6 Location Auto-Detection
```
Test: Geolocation Feature
Steps:
  1. Open Profile Form
  2. Browser requests location permission
  3. Grant permission
  4. Wait for location to load

Expected:
  ✓ Location field auto-fills with city name
  ✓ User can still edit location manually
  ✓ If location denied, field stays empty

Result: PASS/FAIL
```

---

### 4. ADMIN DASHBOARD TESTS

#### 4.1 View All Submissions
```
Test: Admin Submissions List
Steps:
  1. Login as admin
  2. Go to /admin
  3. Check "Submissions" tab
  4. Look at grid of submissions

Expected:
  ✓ All users' submissions visible
  ✓ Each card shows:
    - Submission photo thumbnail
    - User profile photo
    - User name
    - Submission name
    - Description snippet
    - Location
  ✓ Statistics show correct count

Result: PASS/FAIL
```

#### 4.2 View Submission Details
```
Test: Admin Detail View
Steps:
  1. In Admin Dashboard, click on any submission card
  2. View detail page

Expected:
  ✓ Large submission image
  ✓ Full description visible
  ✓ User profile card on right sidebar
  ✓ All metadata visible (name, email, phone, location, date)
  ✓ "Back" button works

Result: PASS/FAIL
```

#### 4.3 Statistics Display
```
Test: Admin Statistics
Steps:
  1. Login as admin
  2. Go to /admin
  3. Look at top statistics cards

Expected:
  ✓ "Total Submissions" card shows correct count
  ✓ "Total Users" card shows correct count
  ✓ Numbers update when new submission added

Result: PASS/FAIL
```

#### 4.4 Admin Can Submit Profile
```
Test: Admin Profile Submission
Steps:
  1. Login as admin
  2. Go to /admin
  3. Click "Submit Profile" tab
  4. Fill profile form
  5. Submit

Expected:
  ✓ Admin profile submission created
  ✓ Appears in submissions grid
  ✓ Admin can see own submission in detail

Result: PASS/FAIL
```

---

### 5. USER DASHBOARD TESTS

#### 5.1 User Profile Submission Tab
```
Test: User Profile Form
Steps:
  1. Login as normal user
  2. Go to /dashboard
  3. Check "Submit Profile" tab

Expected:
  ✓ Form visible with all fields
  ✓ Email field is read-only (auto-filled)
  ✓ Location auto-detection works
  ✓ Phone field visible (optional)

Result: PASS/FAIL
```

#### 5.2 User Submissions History
```
Test: User View Own Submissions
Steps:
  1. Login as user with multiple submissions
  2. Go to /dashboard
  3. Click "My Submissions" tab

Expected:
  ✓ All user's own submissions visible
  ✓ Each item shows:
    - Thumbnail image
    - Name, email, phone, location
    - "Latest" badge on most recent
    - Submission date
  ✓ Cannot see other users' submissions

Result: PASS/FAIL
```

#### 5.3 No Admin Access from User Dashboard
```
Test: User Cannot Access Admin Features
Steps:
  1. Login as normal user
  2. Look for "View All Submissions" button
  3. Try accessing /admin via URL

Expected:
  ✓ No admin features visible
  ✓ /admin redirects to /dashboard
  ✓ Only see own submissions

Result: PASS/FAIL
```

---

### 6. FIREBASE INTEGRATION TESTS

#### 6.1 Firestore User Document Creation
```
Test: Verify User Document
Steps:
  1. Create new user account
  2. Open Firebase Console → Firestore
  3. Go to /users collection

Expected:
  ✓ New document created with user UID as ID
  ✓ Contains fields:
    - email
    - displayName
    - photoURL (if uploaded)
    - role: "user"
    - createdAt
    - updatedAt

Result: PASS/FAIL
```

#### 6.2 Firestore Submission Document
```
Test: Verify Submission Document
Steps:
  1. Submit profile as user
  2. Open Firebase Console → Firestore
  3. Go to /submissions collection

Expected:
  ✓ New document created
  ✓ Contains fields:
    - userId (matches current user)
    - name
    - email
    - description
    - photoURL (Firebase Storage URL)
    - location
    - phone
    - timestamp
    - updatedAt

Result: PASS/FAIL
```

#### 6.3 Firebase Storage Image Upload
```
Test: Verify Image in Storage
Steps:
  1. Upload profile with image
  2. Open Firebase Console → Storage
  3. Navigate to profile-photos/{userId}/

Expected:
  ✓ Image file uploaded
  ✓ Filename is timestamped
  ✓ File size correct
  ✓ File type preserved (JPG/PNG)

Result: PASS/FAIL
```

#### 6.4 Firebase Auth PhotoURL
```
Test: Verify Auth Profile Update
Steps:
  1. Upload profile with image
  2. Open browser Console
  3. Run: firebase.auth().currentUser.photoURL

Expected:
  ✓ PhotoURL is Firebase Storage URL
  ✓ Matches URL in Firestore /users document
  ✓ Matches URL in /submissions document

Result: PASS/FAIL
```

---

### 7. SECURITY TESTS

#### 7.1 Firestore Rules - User Data
```
Test: User Can Only Read Own Profile
Steps:
  1. Login as User A
  2. Open Console
  3. Try: db.collection('users').doc('user_b_id').get()

Expected:
  ✓ Permission denied error (Firestore rules)
  ✓ User cannot access other user's data

Result: PASS/FAIL
```

#### 7.2 Firestore Rules - User Submissions
```
Test: Users Cannot See Others' Submissions
Step:
  1. Login as User A in console
  2. Query: db.collection('submissions').where('userId','==','user_b_id').get()

Expected:
  ✓ Rules allow the query (frontend handles filtering)
  ✓ Frontend filters to show only own

Result: PASS/FAIL
```

#### 7.3 Storage Rules - Upload Restrictions
```
Test: Only Authenticated Users Can Upload
Steps:
  1. Logout
  2. Try uploading file to Storage via Console

Expected:
  ✓ Permission denied
  ✓ Unauthenticated users cannot upload

Result: PASS/FAIL
```

#### 7.4 Prevent Role Escalation
```
Test: User Cannot Change Own Role
Steps:
  1. Login as normal user
  2. Open Console
  3. Try: db.collection('users').doc(user.uid).update({role: 'admin'})

Expected:
  ✓ Permission denied (Firestore rules)
  ✓ Only owner/admin can update

Result: PASS/FAIL
```

---

### 8. PERSISTENCE TESTS

#### 8.1 Image Persists After Refresh
```
Test: Image Upload Persistence
Steps:
  1. Upload profile with image
  2. See image displayed
  3. Refresh page (F5)
  4. Navigate to submission again

Expected:
  ✓ Image still visible
  ✓ No data lost
  ✓ Image loads from Firebase Storage

Result: PASS/FAIL
```

#### 8.2 Submission Data Persists
```
Test: Form Data Persistence
Steps:
  1. Submit profile
  2. Logout
  3. Login as same user
  4. Go to /dashboard

Expected:
  ✓ Submission data still visible
  ✓ Image still there
  ✓ All fields populated from Firestore

Result: PASS/FAIL
```

#### 8.3 Session Persistence
```
Test: Auth State Persists
Steps:
  1. Login to application
  2. Refresh page
  3. Close and reopen browser

Expected:
  ✓ Still logged in
  ✓ Firebase Auth session persists
  ✓ useAuth hook retrieves role

Result: PASS/FAIL
```

---

### 9. LOADING & ERROR STATES

#### 9.1 Loading State During Auth
```
Test: Auth Loading Indicator
Steps:
  1. Click login
  2. Observe screen while loading

Expected:
  ✓ Loader component visible
  ✓ Cannot interact with page
  ✓ After auth, loader disappears

Result: PASS/FAIL
```

#### 9.2 Error Message on Failed Upload
```
Test: Upload Error Handling
Steps:
  1. Try uploading with bad network
  2. Observe error handling

Expected:
  ✓ Error message displayed
  ✓ Form remains editable
  ✓ Can retry submission

Result: PASS/FAIL
```

#### 9.3 Empty State - No Submissions
```
Test: Empty Submissions List
Steps:
  1. Login as user with no submissions
  2. Go to /dashboard → "My Submissions"

Expected:
  ✓ Friendly message: "No submissions yet"
  ✓ Link to submit profile
  ✓ Clear next steps

Result: PASS/FAIL
```

---

### 10. RESPONSIVENESS TESTS

#### 10.1 Mobile View - Admin Dashboard
```
Test: Responsive Admin Dashboard
Steps:
  1. Login as admin
  2. Open DevTools (F12)
  3. Toggle device toolbar
  4. Test on iPhone 12 view

Expected:
  ✓ Grid becomes single column
  ✓ All content readable
  ✓ Buttons clickable
  ✓ Images responsive

Result: PASS/FAIL
```

#### 10.2 Mobile View - Profile Form
```
Test: Responsive Profile Form
Steps:
  1. Open profile form
  2. Toggle device toolbar
  3. Test on mobile view

Expected:
  ✓ Form fields stack vertically
  ✓ Image upload works
  ✓ All buttons accessible
  ✓ No horizontal scroll

Result: PASS/FAIL
```

---

## 📋 Test Results Summary

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | User Signup | PASS/FAIL | |
| 1.2 | User Login | PASS/FAIL | |
| 1.3 | Admin Login | PASS/FAIL | |
| 1.4 | Invalid Credentials | PASS/FAIL | |
| 2.1 | User Auto-Redirect | PASS/FAIL | |
| 2.2 | Admin Auto-Redirect | PASS/FAIL | |
| 2.3 | Prevent User /admin | PASS/FAIL | |
| 2.4 | Admin /dashboard | PASS/FAIL | |
| 3.1 | Submit Profile | PASS/FAIL | |
| 3.2 | Reject Invalid Type | PASS/FAIL | |
| 3.3 | Reject Large File | PASS/FAIL | |
| 3.4 | Require Fields | PASS/FAIL | |
| 3.5 | Update Profile | PASS/FAIL | |
| 3.6 | Location Auto | PASS/FAIL | |
| 4.1 | View All Submissions | PASS/FAIL | |
| 4.2 | View Details | PASS/FAIL | |
| 4.3 | Statistics | PASS/FAIL | |
| 4.4 | Admin Submit | PASS/FAIL | |
| 5.1 | User Form | PASS/FAIL | |
| 5.2 | User History | PASS/FAIL | |
| 5.3 | No Admin Access | PASS/FAIL | |
| 6.1 | User Document | PASS/FAIL | |
| 6.2 | Submission Doc | PASS/FAIL | |
| 6.3 | Storage Upload | PASS/FAIL | |
| 6.4 | Auth PhotoURL | PASS/FAIL | |
| 7.1 | User Privacy | PASS/FAIL | |
| 7.2 | Submission Privacy | PASS/FAIL | |
| 7.3 | Storage Security | PASS/FAIL | |
| 7.4 | Role Escalation | PASS/FAIL | |
| 8.1 | Image Persistence | PASS/FAIL | |
| 8.2 | Data Persistence | PASS/FAIL | |
| 8.3 | Session Persistence | PASS/FAIL | |
| 9.1 | Loading State | PASS/FAIL | |
| 9.2 | Error Handling | PASS/FAIL | |
| 9.3 | Empty State | PASS/FAIL | |
| 10.1 | Mobile Admin | PASS/FAIL | |
| 10.2 | Mobile Form | PASS/FAIL | |

---

## ✅ Sign-Off

**Tested By:** _________________
**Date:** _________________
**Overall Result:** ☐ PASS ☐ FAIL

**Notes:**
```
_________________________________________
_________________________________________
_________________________________________
```

---
