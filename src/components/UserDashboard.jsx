import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { auth } from '../Firebase/Auth'
import { getUserSubmissions, getLatestUserSubmission } from '../Firebase/Firestore'
import { useAuth } from '../hooks/useAuth'
import Button from './Button'
import Card from './Card'
import Loader from './Loader'
import ProfileSubmissionForm from './ProfileSubmissionForm'

/**
 * UserDashboard Component
 * Accessible to normal users
 * Allows users to submit/update their own profile
 */
export default function UserDashboard() {
  const navigate = useNavigate()
  const { user, role } = useAuth()

  const [submissions, setSubmissions] = useState([])
  const [latestSubmission, setLatestSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('form') // 'form', 'history'

  // Fetch user submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      if (user?.uid) {
        const userSubs = await getUserSubmissions(user.uid)
        setSubmissions(userSubs)

        // Get latest submission
        const latest = await getLatestUserSubmission(user.uid)
        setLatestSubmission(latest)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError('Failed to load your submissions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only normal users can access this dashboard
    if (role && role === 'admin') {
      navigate('/admin', { replace: true })
      return
    }

    fetchSubmissions()
  }, [role, user, navigate])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/auth/login'
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading || role === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-white/5 bg-white/2 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                My Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                👤 {user?.displayName || user?.email}
              </p>
            </div>
            <Button variant="danger" onClick={handleLogout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/5 bg-white/2 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'form', label: '✏️ Submit Profile' },
              { id: 'history', label: `📋 My Submissions (${submissions.length})` },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`
                  px-4 py-3 font-medium text-sm transition-colors relative
                  ${
                    view === tab.id
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }
                `}
                whileHover={{ scale: 1.05 }}
              >
                {tab.label}
                {view === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* FORM VIEW */}
        {view === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-3xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Submit Your Profile</h2>
                <p className="text-slate-400">
                  {latestSubmission
                    ? 'Update your profile information'
                    : 'Create your first profile submission'}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm mb-6"
                >
                  ⚠ {error}
                </motion.div>
              )}

              <ProfileSubmissionForm
                initialData={latestSubmission || null}
                onSuccess={() => {
                  fetchSubmissions()
                }}
                showPhoneField={true}
              />

              {latestSubmission && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm"
                >
                  <p>✓ Last updated: {latestSubmission.timestamp?.toDate?.()?.toLocaleDateString?.() || 'N/A'}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* HISTORY VIEW */}
        {view === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">My Submissions</h2>
              <p className="text-slate-400">
                View all your profile submissions
              </p>
            </div>

            {submissions.length === 0 ? (
              <Card className="text-center py-12 bg-white/5">
                <p className="text-5xl mb-4">📝</p>
                <p className="text-lg text-slate-300 mb-2">No submissions yet</p>
                <p className="text-slate-500 text-sm mb-6">
                  Create your first profile submission to get started
                </p>
                <Button
                  variant="primary"
                  onClick={() => setView('form')}
                >
                  Submit Profile
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission, idx) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                      <div className="flex gap-6">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {submission.photoURL ? (
                            <img
                              src={submission.photoURL}
                              alt={submission.name}
                              className="w-24 h-24 rounded-lg object-cover border-2 border-cyan-500/30"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border-2 border-slate-600">
                              📸
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="text-lg font-bold">{submission.name}</h3>
                              <p className="text-sm text-slate-500">
                                {submission.timestamp?.toDate
                                  ? submission.timestamp.toDate().toLocaleDateString()
                                  : 'No date'}
                              </p>
                            </div>
                            {latestSubmission?.id === submission.id && (
                              <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-xs text-cyan-300 font-semibold whitespace-nowrap">
                                Latest
                              </span>
                            )}
                          </div>

                          <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                            {submission.description}
                          </p>

                          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                            {submission.location && (
                              <div className="flex items-center gap-1">
                                <span>📍</span>
                                <span>{submission.location}</span>
                              </div>
                            )}
                            {submission.email && (
                              <div className="flex items-center gap-1">
                                <span>📧</span>
                                <span className="truncate">{submission.email}</span>
                              </div>
                            )}
                            {submission.phone && (
                              <div className="flex items-center gap-1">
                                <span>📱</span>
                                <span>{submission.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
