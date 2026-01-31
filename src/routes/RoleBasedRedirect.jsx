import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/Loader'

/**
 * RoleBasedRedirect Component
 * Redirects authenticated users to appropriate dashboard based on their role:
 * - Admin users → /admin
 * - Normal users → /dashboard
 */
export default function RoleBasedRedirect() {
  const navigate = useNavigate()
  const { role, loading } = useAuth()

  useEffect(() => {
    if (!loading && role) {
      if (role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [role, loading, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <Loader />
    </div>
  )
}
