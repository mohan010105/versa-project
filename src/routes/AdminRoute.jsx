import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/Loader'

/**
 * AdminRoute Component
 * Protects admin-only routes
 * Only users with 'admin' role can access
 */
export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  // Not admin
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
