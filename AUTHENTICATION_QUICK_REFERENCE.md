# Premium Authentication - Quick Reference

## Key Features at a Glance

✨ **Split-Screen Layout**
- Animated left-side visual (wireframe sphere, particles, mesh)
- Professional form on the right
- Responsive on all devices

🎨 **Design Elements**
- Dark theme with cyan/blue accents
- Glassmorphism cards
- Smooth Framer Motion animations
- Premium gradient effects

🔐 **Authentication Pages**
1. **Login** - Email/password sign-in with password recovery link
2. **Signup** - Full account creation with optional profile image
3. **Reset Password** - Secure password recovery with email verification

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Component Usage Examples

### Login with Authentication
```jsx
import Login from './auth/Login'

// Automatically integrates with Firebase
<Route path="/auth/login" element={<Login />} />
```

### Signup with Profile
```jsx
import Signup from './auth/Signup'

// Includes image upload and password strength indicator
<Route path="/auth/signup" element={<Signup />} />
```

### Password Reset Flow
```jsx
import ResetPassword from './auth/ResetPassword'

// Email-based password recovery
<Route path="/auth/reset-password" element={<ResetPassword />} />
```

### Custom Form Input
```jsx
import Input from './components/Input'

<Input 
  name="email"
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  error={errorMsg}
/>
```

### Custom Button
```jsx
import Button from './components/Button'

<Button 
  type="submit" 
  variant="primary" 
  size="md"
  loading={isLoading}
>
  Sign in
</Button>
```

### Auth Layout Wrapper
```jsx
import AuthLayout from './auth/AuthLayout'

<AuthLayout 
  title="Welcome back" 
  subtitle="Sign in to continue"
>
  {/* Your form content */}
</AuthLayout>
```

## Component Props Reference

### Input Component
```jsx
{
  name: string,              // Input name attribute
  type: string,              // HTML input type (default: 'text')
  label: string,             // Floating label text
  placeholder: string,       // Placeholder text
  value: string,             // Current value
  onChange: function,        // Change handler
  disabled: boolean,         // Disabled state
  error: string,             // Error message
  icon: Component,           // Optional icon component
}
```

### Button Component
```jsx
{
  children: node,            // Button text/content
  variant: string,           // 'primary' | 'secondary' | 'ghost' | 'danger'
  size: string,              // 'sm' | 'md' | 'lg'
  loading: boolean,          // Show loading spinner
  disabled: boolean,         // Disabled state
  onClick: function,         // Click handler
  className: string,         // Additional Tailwind classes
}
```

### AuthLayout Component
```jsx
{
  children: node,            // Form content
  title: string,             // Page heading
  subtitle: string,          // Page subtitle
}
```

## Styling & Customization

### Theme Colors
Located in `tailwind.config.js`:
```javascript
colors: {
  slate: {
    950: '#03071e',   // Darkest background
    900: '#0f1724',   // Dark background
    // ... more colors
  }
}
```

### Button Variants
Edit `src/components/Button.jsx` - `variantStyles` object

### Animation Timings
- **Input focus**: 200-300ms
- **Button tap**: Spring physics (stiffness: 400)
- **Page entrance**: 600ms
- **Form stagger**: 100ms per field

### Particle Count
Adjust in `src/components/AuthVisual.jsx`:
```javascript
const particleCount = 80; // Change for performance
```

## Firebase Integration

### Auth Setup
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase/Auth'

await signInWithEmailAndPassword(auth, email, password)
```

### User Profile Save
```javascript
import { saveUserProfile } from '../Firebase/Firestore'

await saveUserProfile(userId, {
  email, 
  displayName, 
  photoURL
})
```

### Image Upload
```javascript
import { uploadFile } from '../Firebase/Storage'

const photoURL = await uploadFile(`users/${uid}/profile`, imageFile)
```

## Error Handling

Common error codes are mapped to user-friendly messages:
```javascript
const errorMessages = {
  'auth/invalid-email': 'Invalid email address',
  'auth/user-not-found': 'No account found',
  'auth/wrong-password': 'Incorrect password',
  'auth/email-already-in-use': 'Email already registered',
}
```

## Responsive Breakpoints

- **Mobile**: < 768px (form full width, no left visual)
- **Tablet**: 768px - 1024px (form adjusted)
- **Desktop**: > 1024px (full split-screen layout)

## File Locations

| Component | Path |
|-----------|------|
| Login Form | `src/auth/Login.jsx` |
| Signup Form | `src/auth/Signup.jsx` |
| Reset Password | `src/auth/ResetPassword.jsx` |
| Layout Wrapper | `src/auth/AuthLayout.jsx` |
| Animated Visual | `src/components/AuthVisual.jsx` |
| Input Field | `src/components/Input.jsx` |
| Button | `src/components/Button.jsx` |
| Card | `src/components/Card.jsx` |

## Performance Tips

1. **Lazy Load Images**: Profile uploads are validated client-side
2. **Canvas Optimization**: Particle count can be reduced for low-end devices
3. **Animation Reduction**: `prefers-reduced-motion` can be detected and respected
4. **Bundle Size**: Only essential Framer Motion features are used

## Debugging

### Enable Firebase Logging
```javascript
import { getAuth } from 'firebase/auth'
getAuth().onAuthStateChanged(user => {
  console.log('Auth state changed:', user)
})
```

### Check Canvas Performance
Open DevTools → Performance tab and record animations

### Inspect Input State
React DevTools → Components tab → Find Input component

## Best Practices

✅ **DO**:
- Use provided components for consistency
- Validate form data before submission
- Handle errors gracefully
- Test responsive layout on devices
- Secure Firebase rules

❌ **DON'T**:
- Store sensitive data in localStorage
- Skip form validation
- Use default Firebase rules in production
- Hardcode Firebase config
- Expose error details to users

## Common Tasks

### Add Custom Validation
```jsx
const handleChange = (e) => {
  const value = e.target.value
  if (value.length < 3) {
    setError('Too short')
  } else {
    setError(null)
  }
}
```

### Change Primary Color
1. Edit `tailwind.config.js` - replace cyan references
2. Update Button `variantStyles` in `Button.jsx`
3. Update Input focus colors in `Input.jsx`
4. Update SVG colors in `AuthVisual.jsx`

### Add Loading Skeleton
Wrap form in conditional:
```jsx
{loading ? <LoadingSkeleton /> : <Form />}
```

### Customize Success Message
Edit Signup.jsx success state rendering

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)

---

**Last Updated**: January 31, 2026
**Version**: 1.0
**Status**: Production Ready ✓
