# Versa — Internship Project

A modern, professional web application for collecting and managing user submissions with real-world functionality. Built with React, Firebase, and Tailwind CSS for a premium, production-ready experience.

## Features

✨ **Modern Authentication**
- Email/password login with custom UI
- User registration with password strength indicator
- Forgot password / reset flow
- Session persistence with Firebase Auth

🎨 **Professional UI/UX**
- Dark mode with glassmorphism design
- Smooth animations via Framer Motion
- Responsive layout (mobile-first)
- High-contrast, accessible forms
- Floating label inputs with validation feedback

📝 **User Submission**
- Profile creation with image upload
- Browser geolocation auto-detect (with manual fallback)
- Image storage in Firebase Storage
- Real-time database storage in Firestore
- Loading states and error handling

👨‍💼 **Admin Dashboard**
- Protected routes (authentication required)
- Card grid view of submissions
- Detail view with full submission info
- Real-time data fetch from Firestore
- Clean logout functionality

## Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS + custom animations
- **Animation:** Framer Motion
- **Routing:** React Router v6
- **Backend/Auth:** Firebase Authentication
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Deployment:** Vercel

## Project Structure

```
src/
├── auth/
│   ├── Login.jsx              # Login page
│   ├── Signup.jsx             # Registration with password strength
│   ├── ResetPassword.jsx      # Password reset flow
│   └── AuthLayout.jsx         # Shared auth layout template
├── pages/
│   ├── Collector.jsx          # User submission form (geolocation + upload)
│   ├── Admin.jsx              # Admin dashboard with grid/detail view
├── components/
│   ├── Input.jsx              # Floating label input with error handling
│   ├── Button.jsx             # Reusable button with loading state
│   ├── Card.jsx               # Glass pane container
│   └── Loader.jsx             # Spinning loader component
├── routes/
│   └── ProtectedRoute.jsx     # Route guard for authenticated pages
├── hooks/
│   └── useAuth.js             # Auth state hook
├── Firebase/
│   ├── Auth.js                # Firebase auth setup
│   ├── Firestore.js           # Firestore utilities + helpers
│   ├── Storage.js             # Firebase storage utilities
│   └── FirebaseConfig.js      # Firebase config (uses env vars)
├── App.jsx                    # Main router
├── main.jsx                   # Entry point
└── index.css                  # Tailwind + custom styles
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `react`, `react-dom`, `react-router-dom`
- `firebase`
- `framer-motion`
- `tailwindcss`, `postcss`, `autoprefixer`

### 2. Configure Firebase

Create a `.env.local` file in the project root with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

You can find these values in your Firebase project settings (Project Settings → General → Your apps).

### 3. Setup Firestore & Storage

In Firebase Console:

1. **Enable Authentication**
   - Sign-in method: Email/Password
   
2. **Create Firestore Database**
   - Start in Test mode (or configure security rules)
   - Create collection: `submissions`

3. **Setup Storage**
   - Enable Cloud Storage
   - Create bucket

### 4. Run Development Server

```bash
npm run dev
```

App will be available at `http://localhost:5173`

## Key Features & Implementation

### Authentication Flow

1. **Login** (`/auth/login`) — Email + password sign-in
2. **Signup** (`/auth/signup`) — New user registration with password strength meter
3. **Reset Password** (`/auth/reset`) — Recover account via email link
4. **Session** — Auto-restored on page refresh via `onAuthStateChanged`

**Components Used:**
- `useAuth()` hook maintains auth state globally
- `ProtectedRoute` wraps admin + collector pages
- Loading skeleton shown while auth state resolves

### User Submission (Collector Page)

- **Location:** `/collector` (protected)
- **Features:**
  - Auto-detect location via browser Geolocation API
  - Fallback to manual input
  - Image upload with preview (JPG/PNG only)
  - Images stored in Firebase Storage
  - Metadata (name, bio, location, image URL) stored in Firestore
  - Form validation + error handling

### Admin Dashboard

- **Location:** `/admin` (protected, auth required)
- **Features:**
  - Fetches submissions from Firestore on mount
  - Grid card view with image thumbnails
  - Click card → detail view (full image, bio, location, timestamp)
  - Logout button
  - Empty state when no submissions

## Design System

### Colors
- **Dark base:** `#0f1724` (slate-900)
- **Accent:** `#10b981` (emerald-500) — primary actions
- **Text:** `#cbd5e1` (slate-300) — readable on dark
- **Borders:** `rgba(255,255,255,0.06)` — subtle glass effect

### Typography
- **Font:** System UI (native to OS)
- **Headings:** Bold, large (3xl-2xl), high contrast
- **Body:** Regular weight, slate-300 color
- **Inputs:** Small labels, large padding for touch targets

### Motion
- **Page transitions:** Fade + slide (100ms)
- **Input focus:** Subtle scale + glow
- **Buttons:** Loading spinner on submit
- **Notifications:** Fade in/out for errors

### Accessibility
- Form labels properly associated with inputs
- ARIA attributes (`aria-invalid`, `aria-describedby`) on errors
- High contrast text (WCAG AA compliant)
- Keyboard navigable forms
- Clear focus outlines

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/versa.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project" → import your GitHub repo
3. Select the project, click "Deploy"
4. Add environment variables (same as `.env.local`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - (etc.)
5. Deploy!

Your app is now live at `https://your-project.vercel.app`

## Environment Variables

These **must** be set for the app to work:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

These are safe to expose (they're client-side config). Never commit secrets to git.

## Security Best Practices

1. **Firebase Rules** — Secure your Firestore + Storage with proper rules:

   **Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /submissions/{document=**} {
         allow read: if request.auth != null;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```

   **Storage Rules:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /submissions/{userId}/{allPaths=**} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

2. **No hardcoded secrets** — All config in environment variables
3. **HTTPS only** — Vercel enforces this automatically
4. **Input validation** — All forms validated client-side + server rules enforce

## Common Issues & Solutions

**"Cannot find module 'react-router-dom'"**
```bash
npm install react-router-dom
```

**Tailwind styles not showing**
- Ensure `tailwind.config.js` has correct `content` paths
- Run `npm install` to get PostCSS plugins
- Clear cache: `rm -rf node_modules/.vite`

**Firebase auth not persisting**
- Check `useAuth()` hook — should call `onAuthStateChanged`
- Verify Firebase config in `.env.local`

**Geolocation not working**
- Requires HTTPS in production (Vercel handles this)
- User must grant permission in browser
- App gracefully falls back to manual input

## Testing Locally

1. Create a test user account via signup
2. Navigate to `/collector` to submit a profile
3. Navigate to `/admin` to view submissions
4. Test logout and re-login

## Next Steps for Production

- [ ] Add email verification on signup
- [ ] Implement submission edit/delete
- [ ] Add filters/search to admin dashboard
- [ ] Analytics tracking (Vercel Analytics)
- [ ] Dark mode toggle (optional)
- [ ] Rate limiting on forms
- [ ] Image cropping tool
- [ ] User profiles page

## Support & Questions

- Firebase docs: https://firebase.google.com/docs
- Tailwind docs: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion
- Vercel deployment: https://vercel.com/docs

---

**Built with ❤️ for modern, professional web experiences.**
