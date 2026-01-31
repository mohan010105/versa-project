import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * AuthVisual Component
 * Renders an animated left-side visual for authentication pages
 * Features:
 * - Glowing wireframe sphere (SVG)
 * - Particle mesh waves
 * - Gradient glow effects
 * - Smooth continuous animations
 */
const AuthVisual = () => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    let animationId

    // Particle system for mesh/wave effect
    const particles = []
    const particleCount = 80

    class Particle {
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 1.5 + 0.5
        this.opacity = Math.random() * 0.5 + 0.3
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1

        this.x = Math.max(0, Math.min(width, this.x))
        this.y = Math.max(0, Math.min(height, this.y))
      }

      draw(ctx) {
        ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    const drawParticles = () => {
      particles.forEach(p => {
        p.update()
        p.draw(ctx)
      })

      // Draw connecting lines between nearby particles
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)'
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.globalAlpha = 1 - distance / 100
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
      ctx.fillRect(0, 0, width, height)

      drawParticles()
      animationId = requestAnimationFrame(animate)
    }

    // Set canvas size and start animation
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {/* Animated canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* SVG Wireframe Sphere */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full max-w-xs max-h-xs m-auto"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))',
        }}
        animate={{
          rotateZ: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Sphere wireframe */}
        <defs>
          <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer glow sphere */}
        <circle cx="100" cy="100" r="80" fill="url(#sphereGlow)" />

        {/* Wireframe grid */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <g key={`lat-${i}`}>
              <circle
                cx="100"
                cy="100"
                r={30 + (i % 3) * 15}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="0.8"
                opacity={0.6 - i * 0.05}
              />
            </g>
          )
        })}

        {/* Longitude lines */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const x1 = 100 + 60 * Math.cos(angle)
          const y1 = 100 + 60 * Math.sin(angle)
          const x2 = 100 + 70 * Math.cos(angle)
          const y2 = 100 + 70 * Math.sin(angle)
          return (
            <line
              key={`lon-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#22d3ee"
              strokeWidth="1"
              opacity="0.5"
            />
          )
        })}

        {/* Center point with glow */}
        <circle cx="100" cy="100" r="3" fill="#22d3ee" opacity="0.8" />
      </motion.svg>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-full blur-2xl"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-20 left-10 w-20 h-20 bg-gradient-to-tr from-teal-500/10 to-cyan-500/5 rounded-full blur-2xl"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid overlay effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-transparent to-slate-900/40 pointer-events-none" />
    </div>
  )
}

export default AuthVisual
