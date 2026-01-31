import React from 'react'
import { motion } from 'framer-motion'
import AuthVisual from '../components/AuthVisual'

/**
 * AuthLayout Component
 * Premium split-screen authentication layout
 * Left side: Animated visual (wireframe sphere, particles, mesh)
 * Right side: Authentication form
 */
import { useNavigate } from 'react-router-dom'

const LeftVisual = React.memo(function LeftVisual() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="hidden lg:flex h-screen items-center justify-center relative bg-gradient-to-br from-slate-900/50 to-slate-950/50 border-r border-white/5"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="w-full h-full"
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.06) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 40%, rgba(34, 211, 238, 0.04) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 60%, rgba(34, 211, 238, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.06) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-96 h-96 relative pointer-events-none">
          <AuthVisual />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute bottom-8 left-0 right-0 text-center px-6 z-10 pointer-events-none"
      >
        <h2 className="text-lg font-semibold text-cyan-300 mb-2">Welcome to Versa</h2>
        <p className="text-sm text-slate-400">Secure authentication powered by cloud infrastructure</p>
      </motion.div>
    </motion.div>
  )
})

const AuthLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-700 text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE - Visual (static, non-scrolling) */}
        <LeftVisual />

        {/* RIGHT SIDE - Form (scrollable) */}
        <div className="h-screen overflow-y-auto p-6 lg:p-12 flex flex-col items-center justify-start">
          <div className="w-full max-w-md py-8">
            {/* Brand Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center justify-center mb-6 select-none"
            >
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent focus:outline-none cursor-pointer px-2 py-1 rounded transition"
                aria-label="Go to home page"
              >
                Versa
              </motion.button>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-6 text-center"
            >
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
                {title || 'Welcome'}
              </h1>
              <p className="text-white text-base">{subtitle || 'A premium authentication experience'}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
