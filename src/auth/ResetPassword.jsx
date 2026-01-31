import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../Firebase/Auth'
import AuthLayout from './AuthLayout'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { motion } from 'framer-motion'

/**
 * ResetPassword Page
 * Premium password reset flow with email verification
 * Features:
 * - Single email input
 * - Calm, reassuring UX
 * - Success confirmation with next steps
 * - Back to login option
 */

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err) {
      const errorMessages = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-not-found': 'No account found with this email',
      }

      setError(errorMessages[err.code] || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a password reset link"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border border-white/10 bg-white/8 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
            <div className="space-y-6 text-center">
              {/* Email Icon Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <span className="text-2xl">✉️</span>
                </div>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-3"
              >
                <p className="text-slate-300">
                  We've sent a password reset link to:
                </p>
                <p className="font-semibold text-cyan-400 break-all bg-white/5 rounded-lg p-3 border border-cyan-500/20">
                  {email}
                </p>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2"
              >
                <p className="text-sm text-slate-300 font-medium">What's next?</p>
                <ul className="text-xs text-slate-400 space-y-1 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">→</span>
                    <span>Check your email inbox and spam folder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">→</span>
                    <span>Click the reset link in the email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">→</span>
                    <span>Create a new password and save it somewhere safe</span>
                  </li>
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col gap-3 pt-4"
              >
                <Link to="/auth/login">
                  <Button variant="primary" size="md" className="w-full">
                    Back to Login
                  </Button>
                </Link>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Didn't receive the email? Try again
                </button>
              </motion.div>
            </div>
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
    <AuthLayout
      title="Reset your password"
      subtitle="We'll help you get back in securely"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        <Card className="border border-white/10 bg-white/8 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Instructions */}
            <motion.p
              custom={0}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-sm text-white bg-white/5 rounded-lg p-4 border border-white/10"
            >
              Enter the email address associated with your account, and we'll send you a link to reset your password.
            </motion.p>

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

            {/* Submit Button */}
            <motion.div custom={2} variants={containerVariants} initial="hidden" animate="visible">
              <Button type="submit" size="md" loading={loading} className="w-full">
                Send reset link
              </Button>
            </motion.div>

            {/* Back to Login */}
            <motion.div custom={3} variants={containerVariants} initial="hidden" animate="visible" className="text-center pt-2">
              <p className="text-sm text-white">
                Remember your password?{' '}
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
