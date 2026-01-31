import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase/Auth'
import AuthLayout from './AuthLayout'
import Card from '../components/Card'
import Input from '../components/Input'
import PasswordInput from '../components/PasswordInput'
import Button from '../components/Button'
import { motion } from 'framer-motion'

/**
 * Login Page
 * Premium authentication experience with email/password sign-in
 * Features:
 * - Smooth form animations
 * - Real-time error handling
 * - Loading states
 * - Links to signup and password reset
 */
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
      const errorMessages = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
      }

      setError(errorMessages[err.code] || err.message)
    } finally {
      setLoading(false)
    }
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
    <AuthLayout title="Welcome back" subtitle="Sign in to manage submissions">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        <Card className="border border-white/10 bg-white/8 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div custom={0} variants={containerVariants} initial="hidden" animate="visible">
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
            <motion.div custom={1} variants={containerVariants} initial="hidden" animate="visible">
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
              />
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

            {/* Actions */}
            <motion.div custom={2} variants={containerVariants} initial="hidden" animate="visible" className="flex items-center justify-between pt-2">
              <Link to="/auth/reset-password" className="text-sm text-white hover:text-cyan-300 transition-colors duration-200 font-medium">
                Forgot password?
              </Link>
            </motion.div>

            {/* Sign In Button */}
            <motion.div custom={3} variants={containerVariants} initial="hidden" animate="visible">
              <Button type="submit" size="md" loading={loading} className="w-full">
                Sign in
              </Button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div custom={4} variants={containerVariants} initial="hidden" animate="visible" className="text-center pt-2">
              <p className="text-sm text-white">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-semibold">
                  Create one
                </Link>
              </p>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </AuthLayout>
  )
}
