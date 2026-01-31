import React from 'react'
import { motion } from 'framer-motion'

/**
 * Card Component
 * Premium card with glassmorphism effect
 * Supports custom styling and animations
 */
const Card = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        bg-white/8 backdrop-blur-xl border border-white/10 rounded-2xl p-6
        shadow-xl shadow-black/40 relative overflow-hidden
        ${className}
      `}
    >
      {/* Gradient border glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export default Card
