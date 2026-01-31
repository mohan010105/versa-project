import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../Firebase/Auth'
import { saveUserProfile } from '../Firebase/Firestore'
import { uploadFile } from '../Firebase/Storage'
import AuthLayout from './AuthLayout'
import Card from '../components/Card'
import Input from '../components/Input'
import PasswordInput from '../components/PasswordInput'
import Button from '../components/Button'
import { motion } from 'framer-motion'

/**
 * Signup Page
 * Premium account creation with email, password, optional profile image
 * Features:
 * - Real-time password strength indicator
 * - Profile image upload with preview
 * - Smooth form animations
 * - Proper error handling
 */

const getPasswordStrength = (pwd) => {
  if (!pwd) return { level: 0, text: '', color: 'bg-slate-600' }
  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd)) strength++
  if (/[^A-Za-z0-9]/.test(pwd)) strength++

  return strength <= 1
    ? { level: 1, text: 'Weak', color: 'bg-red-500' }
    : strength === 2
      ? { level: 2, text: 'Fair', color: 'bg-yellow-500' }
      : strength === 3
        ? { level: 3, text: 'Good', color: 'bg-emerald-500' }
        : { level: 4, text: 'Strong', color: 'bg-cyan-500' }
}

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const strength = getPasswordStrength(password)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      setError(null)
    } else {
      setError('Only JPEG and PNG images are supported')
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!name || !email || !password) {
      setError('Please fill in all required fields')
      return
    }

    if (strength.level < 2) {
      setError('Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers')
      return
    }

    setLoading(true)

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      let photoURL = null
      if (image) {
        photoURL = await uploadFile(`users/${user.uid}/profile`, image)
      }

      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      })

      await saveUserProfile(user.uid, {
        email: email,
        displayName: name,
        photoURL: photoURL,
        createdAt: new Date(),
      })

      setSuccess(true)
      setTimeout(() => navigate('/'), 2500)
    } catch (err) {
      const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password is too weak (min 6 characters)',
      }

      setError(errorMessages[err.code] || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="Welcome aboard!" subtitle="Account created successfully">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border border-white/10 bg-gradient-to-br from-emerald-500/10 via-white/8 to-white/8 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
              className="mb-4"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <p className="text-lg font-semibold text-slate-100">Account created!</p>
              <p className="text-sm text-slate-400">
                Redirecting you to the dashboard in a moment...
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </AuthLayout>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join our platform and start collaborating">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        <Card className="border border-white/10 bg-white/8 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <motion.div custom={0} variants={containerVariants} initial="hidden" animate="visible">
              <Input
                name="name"
                type="text"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={loading}
              />
            </motion.div>

            {/* Email Input */}
            <motion.div custom={1} variants={containerVariants} initial="hidden" animate="visible">
              <Input
                name="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
              />
            </motion.div>

            {/* Password Input with Eye Toggle */}
            <motion.div custom={2} variants={containerVariants} initial="hidden" animate="visible">
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="new-password"
              />

              {/* Password Strength Indicator */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          i < strength.level ? strength.color : 'bg-white/10'
                        }`}
                        animate={{
                          scale: i < strength.level ? 1 : 0.95,
                        }}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.level <= 1
                      ? 'text-red-400'
                      : strength.level === 2
                        ? 'text-yellow-400'
                        : 'text-cyan-400'
                  }`}>
                    Password strength: {strength.text}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Profile Photo Upload */}
            <motion.div custom={3} variants={containerVariants} initial="hidden" animate="visible">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Profile Photo <span className="text-xs text-slate-500">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  disabled={loading}
                  className="hidden"
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="block border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:border-cyan-500/50 hover:bg-cyan-500/5"
                >
                  {imagePreview ? (
                    <div className="space-y-3">
                      <motion.img
                        src={imagePreview}
                        alt="preview"
                        className="w-24 h-24 mx-auto rounded-lg object-cover border border-cyan-500/30"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      />
                      <p className="text-xs text-slate-400">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-3xl">📸</p>
                      <p className="text-sm text-slate-300">
                        Drop your photo or click to browse
                      </p>
                      <p className="text-xs text-slate-500">
                        JPG or PNG (max 5MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {imagePreview && (
                <motion.button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={loading}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-red-400 hover:text-red-300 font-medium"
                >
                  Remove photo
                </motion.button>
              )}
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/15 border border-red-500/30 rounded-lg p-3 flex items-start gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Create Account Button */}
            <motion.div custom={4} variants={containerVariants} initial="hidden" animate="visible">
              <Button type="submit" size="md" loading={loading} className="w-full">
                Create account
              </Button>
            </motion.div>

            {/* Login Link */}
            <motion.div custom={5} variants={containerVariants} initial="hidden" animate="visible" className="text-center pt-2">
              <p className="text-sm text-white">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </AuthLayout>
  )
}
