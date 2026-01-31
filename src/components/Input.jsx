import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Input Component
 * Premium animated input field with floating label and error states
 * Supports focus animations and smooth transitions
 */
const Input = forwardRef(
  ({ label, type = 'text', error, icon: Icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value)

    const handleFocus = (e) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      props.onBlur?.(e)
    }

    const handleChange = (e) => {
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }

    return (
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon
              className={`w-5 h-5 transition-colors duration-200 ${
                isFocused || hasValue ? 'text-cyan-400' : 'text-slate-500'
              }`}
            />
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.name}-error` : undefined}
          className={`
            peer w-full bg-white/5 backdrop-blur-sm border-2
            rounded-lg py-3 transition-all duration-200
            ${Icon ? 'pl-12' : 'pl-4'} pr-4
            placeholder-transparent text-sm text-slate-100
            focus:outline-none
            ${
              error
                ? 'border-red-500/50 focus:border-red-500 bg-red-500/5'
                : 'border-white/10 focus:border-cyan-500/50 focus:bg-white/10'
            }
            hover:border-white/20 focus:shadow-lg focus:shadow-cyan-500/10
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {/* Floating Label */}
        <motion.label
          className={`
            absolute left-4 bg-gradient-to-r from-slate-950 via-slate-950 to-transparent
            px-2 text-sm font-medium pointer-events-none
            ${Icon ? 'left-12' : 'left-4'}
            transition-all duration-200
            ${
              isFocused || hasValue
                ? 'text-cyan-400 -top-2.5 text-xs'
                : 'text-slate-400 top-3.5'
            }
          `}
          animate={{
            opacity: isFocused || hasValue ? 1 : 0.7,
          }}
        >
          {label}
        </motion.label>

        {/* Focus Border Animation */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none border-2 border-cyan-500/0"
          animate={{
            borderColor: isFocused ? 'rgba(34, 211, 238, 0.3)' : 'rgba(34, 211, 238, 0)',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Error Message */}
        {error && (
          <motion.p
            id={`${props.name}-error`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-xs text-red-400 flex items-center"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-red-400 mr-2" />
            {error}
          </motion.p>
        )}
      </motion.div>
    )
  }
)

Input.displayName = 'Input'

export default Input
