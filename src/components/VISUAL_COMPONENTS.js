/**
 * AUTHENTICATION VISUAL COMPONENTS SHOWCASE
 * 
 * This file documents all the premium visual components used
 * in the authentication system and how they work together.
 */

// ============================================================================
// 1. ANIMATED LEFT-SIDE VISUAL (AuthVisual.jsx)
// ============================================================================

/**
 * COMPONENTS:
 * ├─ Wireframe Sphere
 * │  ├─ Rotating SVG (20s cycle)
 * │  ├─ Radial gradient glow
 * │  ├─ Concentric circles (latitude)
 * │  └─ Longitude lines (longitude grid)
 * │
 * ├─ Particle Mesh System (Canvas-based)
 * │  ├─ 80 particles with physics
 * │  ├─ Particle movement & bounce
 * │  ├─ Distance-based line connections
 * │  └─ Fade effect on canvas redraw
 * │
 * ├─ Floating Gradient Orbs
 * │  ├─ Top-right pulsing orb
 * │  └─ Bottom-left floating orb
 * │
 * └─ Grid Overlay
 *    └─ SVG pattern for tech aesthetic
 * 
 * ANIMATIONS USED:
 * - rotate: Continuous sphere rotation
 * - y position: Floating motion (20px range)
 * - opacity: Breathing effect
 * - canvas: Requestanimationframe for particles
 */

// ============================================================================
// 2. FORM INPUT COMPONENT (Input.jsx)
// ============================================================================

/**
 * INTERACTIVE ELEMENTS:
 * 
 * ├─ Input Field
 * │  ├─ Backdrop blur background
 * │  ├─ Border color transition on focus
 * │  ├─ Focus shadow glow
 * │  └─ Disabled state handling
 * │
 * ├─ Floating Label
 * │  ├─ Position: static (-top-2) when focused
 * │  ├─ Scale: xs (12px) when focused
 * │  ├─ Color: cyan when focused
 * │  └─ Smooth transition timing (200ms)
 * │
 * ├─ Focus Ring
 * │  ├─ Cyan border glow
 * │  ├─ Appears on focus
 * │  └─ Fades on blur
 * │
 * └─ Error Message
 *    ├─ Animated entrance (opacity 0→1)
 *    ├─ Red text with icon
 *    └─ Appears below input
 * 
 * ANIMATION STATES:
 * - Focus: Label up, border color, glow appears
 * - Blur: Label down, border reset, glow fades
 * - Error: Red styling, shake effect (optional)
 * - Disabled: Reduced opacity, no interactions
 */

// ============================================================================
// 3. BUTTON COMPONENT (Button.jsx)
// ============================================================================

/**
 * VARIANTS:
 * 
 * PRIMARY (Cyan-Blue Gradient)
 * ├─ Normal: from-cyan-500 to-blue-500
 * ├─ Hover: from-cyan-600 to-blue-600 (darker)
 * ├─ Tap: Scale down 0.98x
 * └─ Shadow: cyan-500/20 glow
 * 
 * SECONDARY (Glassmorphic)
 * ├─ Background: white/10
 * ├─ Border: white/20
 * ├─ Hover: white/20 background
 * └─ Focus: white/50 ring
 * 
 * GHOST (Minimal)
 * ├─ Background: transparent
 * ├─ Text: slate-300
 * └─ Hover: white/10 background
 * 
 * DANGER (Red Gradient)
 * ├─ Normal: from-red-500 to-red-600
 * ├─ Hover: from-red-600 to-red-700
 * └─ Shadow: red-500/20 glow
 * 
 * INTERACTIONS:
 * - Hover: Scale 1.02x (spring physics)
 * - Tap: Scale 0.98x
 * - Loading: Spinner animation + opacity pulse
 * - Disabled: 50% opacity + no-cursor
 */

// ============================================================================
// 4. CARD COMPONENT (Card.jsx)
// ============================================================================

/**
 * VISUAL PROPERTIES:
 * 
 * Glassmorphism Effect:
 * ├─ Background: white/8 (semi-transparent)
 * ├─ Backdrop filter: blur(10px)
 * ├─ Border: white/10 (subtle)
 * ├─ Border radius: rounded-2xl
 * └─ Shadow: black/40 with 40px blur
 * 
 * ANIMATIONS:
 * - Entrance: opacity 0→1, y 20→0 (500ms)
 * - Container: smooth transitions
 * - Content: positioned absolutely with z-index
 * 
 * EFFECTS:
 * - Gradient border glow (optional, on hover)
 * - Depth perception from shadow
 * - Light refraction effect from blur
 */

// ============================================================================
// 5. AUTHlayout WRAPPER (AuthLayout.jsx)
// ============================================================================

/**
 * LAYOUT STRUCTURE:
 * 
 * Desktop (grid-cols-2):
 * ┌─────────────────┬──────────────────┐
 * │                 │                  │
 * │   LEFT VISUAL   │   AUTH FORM      │
 * │  (Hidden on     │ (Full Width)     │
 * │   mobile)       │                  │
 * │                 │                  │
 * └─────────────────┴──────────────────┘
 * 
 * Mobile (single column):
 * ┌──────────────────────┐
 * │   AUTH FORM          │
 * │   (Full Width)       │
 * │                      │
 * └──────────────────────┘
 * 
 * ANIMATIONS:
 * - Container: fade 0→1 (800ms)
 * - Left visual: opacity + entrance
 * - Form: y slide + fade (600ms)
 * - Header: y slide down (delay: 200ms)
 * 
 * BACKGROUND:
 * - Gradient: from-slate-950 → via-slate-900 → to-slate-950
 * - Direction: radial (135deg)
 * - Additional floating orbs animate in background
 */

// ============================================================================
// 6. ANIMATED BACKGROUND ELEMENTS
// ============================================================================

/**
 * GRADIENT ORBS (AuthLayout):
 * 
 * Orb 1 (Top-Right):
 * ├─ Color: cyan-500/20 to blue-500/10
 * ├─ Position: top-20 right-20
 * ├─ Size: w-16 h-16
 * ├─ Blur: blur-2xl
 * ├─ Animation:
 * │  ├─ Y movement: 0 → 20 → 0 (6s)
 * │  └─ Opacity: 0.3 → 0.5 → 0.3
 * │
 * Orb 2 (Bottom-Left):
 * ├─ Color: teal-500/10 to cyan-500/5
 * ├─ Position: bottom-20 left-10
 * ├─ Size: w-20 h-20
 * ├─ Blur: blur-2xl
 * ├─ Animation:
 * │  ├─ Y movement: 0 → -20 → 0 (8s)
 * │  └─ Opacity: 0.2 → 0.4 → 0.2
 * │
 * GRID OVERLAY:
 * ├─ SVG pattern (40px squares)
 * ├─ Color: cyan-500
 * ├─ Opacity: 10%
 * └─ Non-interactive pointer-events-none
 */

// ============================================================================
// 7. FORM ANIMATIONS (Page-Specific)
// ============================================================================

/**
 * LOGIN PAGE:
 * 
 * Container animations (staggered, delay: i * 100ms):
 * ├─ Card entrance: 500ms fade + slide
 * ├─ Email input: 500ms (index 0)
 * ├─ Password input: 500ms (index 1)
 * ├─ Error message: 500ms (if present)
 * ├─ Forgot link + button: 500ms (index 2)
 * ├─ Primary button: 500ms (index 3)
 * └─ Signup link: 500ms (index 4)
 * 
 * SIGNUP PAGE:
 * 
 * Additional animations:
 * ├─ Image upload section: custom animation
 * ├─ Password strength indicator:
 * │  ├─ Bar animation: smooth scale
 * │  └─ Color change: opacity-based
 * ├─ Image preview: scale 0→1 (spring)
 * └─ Success state:
 *    ├─ Card: scale 0.9→1
 *    ├─ Checkmark: scale 0→1 + rotate
 *    └─ Text: fade in with delay
 * 
 * RESET PASSWORD PAGE:
 * 
 * Success state animations:
 * ├─ Email icon: rotate -180→0 + scale (spring)
 * ├─ Message section: fade + slide (delay: 300ms)
 * ├─ Instructions: fade + slide (delay: 400ms)
 * └─ Buttons: fade + slide (delay: 500ms)
 */

// ============================================================================
// 8. INTERACTIVE STATE FEEDBACK
// ============================================================================

/**
 * LOADING STATES:
 * 
 * Button Loading:
 * ├─ Spinner visible
 * ├─ Opacity pulse animation
 * ├─ Button disabled (no interaction)
 * └─ Inputs disabled
 * 
 * Form Submission:
 * ├─ All buttons disabled
 * ├─ Inputs disabled
 * ├─ Loading state shows spinner
 * └─ Error prevention
 * 
 * ERROR STATES:
 * 
 * Input Error:
 * ├─ Border: red-500/50
 * ├─ Background: red-500/5
 * ├─ Text: red-400
 * └─ Message: animated entrance
 * 
 * Form Error:
 * ├─ Red background container
 * ├─ Red border (30% opacity)
 * ├─ Small glow indicator
 * └─ Smooth reveal animation
 * 
 * SUCCESS STATES:
 * 
 * Signup Success:
 * ├─ Gradient background change
 * ├─ Checkmark animation
 * ├─ Success message
 * └─ Auto-redirect after 2.5s
 * 
 * Reset Success:
 * ├─ Email icon animation
 * ├─ Confirmation message
 * ├─ Instructions list
 * └─ Back to login button
 */

// ============================================================================
// 9. ACCESSIBILITY & TOUCH INTERACTIONS
// ============================================================================

/**
 * KEYBOARD NAVIGATION:
 * - Tab through inputs and buttons
 * - Enter submits forms
 * - Escape cancels operations (future enhancement)
 * 
 * FOCUS INDICATORS:
 * - Input fields: cyan glow + border change
 * - Buttons: ring-2 ring-offset-slate-950
 * - Links: underline + color change
 * 
 * TOUCH INTERACTIONS:
 * - Buttons scale down on tap (0.98x)
 * - Input fields respond to touch focus
 * - Larger touch targets on mobile
 * 
 * ARIA ATTRIBUTES:
 * - aria-invalid for error inputs
 * - aria-describedby for error messages
 * - aria-label for icon-only elements
 */

// ============================================================================
// 10. COLOR PALETTE REFERENCE
// ============================================================================

/**
 * PRIMARY COLORS:
 * Cyan (Interactive):
 * ├─ 500: #22d3ee (Primary)
 * ├─ 400: #06b6d4 (Darker variant)
 * └─ 300: #67e8f9 (Lighter variant)
 * 
 * BACKGROUND:
 * Slate (Dark):
 * ├─ 950: #03071e (Darkest)
 * ├─ 900: #0f1724 (Dark)
 * ├─ 800: #1a202c (Medium)
 * └─ 700: #334155 (Lighter)
 * 
 * TEXT:
 * Slate (Light):
 * ├─ 400: #94a3b8 (Tertiary text)
 * ├─ 300: #cbd5e1 (Secondary text)
 * └─ 100: #f1f5f9 (Primary text)
 * 
 * ACCENT COLORS:
 * ├─ Emerald-500: #10b981 (Success/Password good)
 * ├─ Red-500: #ef4444 (Error)
 * ├─ Yellow-500: #eab308 (Warning)
 * └─ Blue-500: #3b82f6 (Info)
 */

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * COMPONENT HIERARCHY:
 * 
 * AuthLayout
 * ├─ AuthVisual (Left side)
 * │  ├─ SVG Wireframe Sphere
 * │  ├─ Canvas Particle System
 * │  ├─ Floating Gradient Orbs
 * │  └─ Grid Overlay
 * │
 * └─ Right Side Form
 *    ├─ Header (h1 + subtitle)
 *    └─ Card
 *       ├─ Multiple Input components
 *       ├─ Error Message (optional)
 *       └─ Button component
 * 
 * TOTAL ANIMATIONS:
 * - 20+ unique animation sequences
 * - Spring physics for natural motion
 * - Staggered entrance effects
 * - Continuous background animations
 * - Interactive feedback animations
 * 
 * PERFORMANCE:
 * - Canvas uses requestAnimationFrame
 * - GPU-accelerated transforms
 * - Optimized repaints
 * - Reduced motion support (can be added)
 */

export const AnimationTimings = {
  fast: { duration: 0.2 },
  normal: { duration: 0.5 },
  slow: { duration: 0.8 },
  sphereRotation: { duration: 20 },
  particleFloat: { duration: 6 },
}

export const SpringPhysics = {
  bounce: { type: 'spring', stiffness: 300, damping: 10 },
  standard: { type: 'spring', stiffness: 400, damping: 17 },
  smooth: { type: 'spring', stiffness: 100, damping: 20 },
}

export const ColorScheme = {
  primary: '#22d3ee', // cyan-500
  primaryDark: '#06b6d4', // cyan-600
  background: '#0f1724', // slate-900
  backgroundDark: '#03071e', // slate-950
  textPrimary: '#f1f5f9', // slate-100
  textSecondary: '#cbd5e1', // slate-300
  success: '#10b981', // emerald-500
  error: '#ef4444', // red-500
  warning: '#eab308', // yellow-500
}
