import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/Loader'

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * Automatically redirects authenticated users based on their role to appropriate dashboard
 */
export default function ProtectedRoute({ children }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  // Render children (can be used as generic protected route)
  return children
}

