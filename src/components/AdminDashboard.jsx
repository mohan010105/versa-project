import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { auth } from '../Firebase/Auth'
import { getSubmissions, getUserProfile } from '../Firebase/Firestore'
import { useAuth } from '../hooks/useAuth'
import Button from './Button'
import Card from './Card'
import Loader from './Loader'
import ProfileSubmissionForm from './ProfileSubmissionForm'

/**
 * AdminDashboard Component
 * Accessible only to admin users
 * Shows submission management and analytics
 */
export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, role } = useAuth()

  const [submissions, setSubmissions] = useState([])
  const [userProfiles, setUserProfiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState('submissions') // 'submissions', 'profile', 'detail'
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalUsers: 0,
  })

  // Fetch submissions and user profiles
  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await getSubmissions()
      setSubmissions(data)

      // Fetch user profiles for all submissions
      const profiles = {}
      const uniqueUserIds = new Set(data.map(sub => sub.userId))

      for (const userId of uniqueUserIds) {
        try {
          const profile = await getUserProfile(userId)
          profiles[userId] = profile
        } catch (err) {
          console.error(`Failed to fetch profile for ${userId}:`, err)
          profiles[userId] = null
        }
      }

      setUserProfiles(profiles)
      setStats({
        totalSubmissions: data.length,
        totalUsers: uniqueUserIds.size,
      })
      setError(null)
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError('Failed to load submissions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only admins can access this dashboard
    if (role && role !== 'admin') {
      navigate('/dashboard', { replace: true })
      return
    }

    fetchData()
  }, [role, navigate])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/auth/login'
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const selected = submissions.find(s => s.id === selectedId)
  const selectedUserProfile = selected ? userProfiles[selected.userId] : null

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
                Admin Dashboard
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
            {['submissions', 'profile'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => {
                  setView(tab)
                  setSelectedId(null)
                }}
                className={`
                  px-4 py-3 font-medium text-sm transition-colors relative
                  ${
                    view === tab
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }
                `}
                whileHover={{ scale: 1.05 }}
              >
                {tab === 'submissions' ? '📋 View All Submissions' : '✏️ Submit Profile'}
                {view === tab && (
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
        {/* SUBMISSIONS VIEW */}
        {view === 'submissions' && !selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Total Submissions</p>
                  <p className="text-4xl font-bold text-cyan-400 mt-2">{stats.totalSubmissions}</p>
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-4xl font-bold text-emerald-400 mt-2">{stats.totalUsers}</p>
                </div>
              </Card>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm mb-6"
              >
                ⚠ {error}
              </motion.div>
            )}

            {/* Submissions Grid */}
            {submissions.length === 0 ? (
              <Card className="text-center py-12 bg-white/5">
                <p className="text-slate-400 text-lg">No submissions yet</p>
                <p className="text-slate-500 text-sm mt-2">Submissions will appear here once users submit their profiles</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((sub, idx) => {
                  const profile = userProfiles[sub.userId]
                  return (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setSelectedId(sub.id)
                        setView('detail')
                      }}
                    >
                      <Card className="cursor-pointer group hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
                        {/* Submission Photo */}
                        <div className="relative mb-4 overflow-hidden rounded-lg aspect-video bg-slate-700">
                          {sub.photoURL ? (
                            <img
                              src={sub.photoURL}
                              alt={sub.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                              <span className="text-4xl">📸</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
                          {profile?.photoURL ? (
                            <img
                              src={profile.photoURL}
                              alt={profile.displayName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                              👤
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">
                              {profile?.displayName || 'Unknown User'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {profile?.email || sub.email || 'No email'}
                            </p>
                          </div>
                        </div>

                        {/* Submission Details */}
                        <h3 className="font-bold text-slate-100 mb-2">{sub.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {sub.description}
                        </p>
                        <div className="flex items-center text-xs text-slate-500 gap-2">
                          <span>📍</span>
                          <span className="truncate">{sub.location}</span>
                        </div>

                        {/* Timestamp */}
                        <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-700">
                          {sub.timestamp?.toDate
                            ? sub.timestamp.toDate().toLocaleDateString()
                            : 'No date'}
                        </p>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* DETAIL VIEW */}
        {view === 'detail' && selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={() => {
                setView('submissions')
                setSelectedId(null)
              }}
              className="mb-6"
            >
              ← Back to Submissions
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                  {/* Large Image */}
                  {selected.photoURL ? (
                    <img
                      src={selected.photoURL}
                      alt={selected.name}
                      className="w-full h-96 rounded-lg object-cover mb-6 border-2 border-cyan-500/20"
                    />
                  ) : (
                    <div className="w-full h-96 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-6 border-2 border-cyan-500/20">
                      <span className="text-8xl">📸</span>
                    </div>
                  )}

                  {/* Submission Details */}
                  <h1 className="text-4xl font-bold mb-3">{selected.name}</h1>
                  <p className="text-slate-300 leading-relaxed mb-6 text-lg">
                    {selected.description}
                  </p>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-700">
                    <div>
                      <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">
                        Location
                      </p>
                      <p className="text-xl font-semibold">{selected.location}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">
                        Submitted
                      </p>
                      <p className="text-xl font-semibold">
                        {selected.timestamp?.toDate
                          ? selected.timestamp.toDate().toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    {selected.email && (
                      <div>
                        <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">
                          Email
                        </p>
                        <p className="text-lg font-semibold break-all">{selected.email}</p>
                      </div>
                    )}
                    {selected.phone && (
                      <div>
                        <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">
                          Phone
                        </p>
                        <p className="text-lg font-semibold">{selected.phone}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Sidebar - User Profile */}
              <div>
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 sticky top-24">
                  <p className="text-slate-400 text-sm uppercase tracking-wider mb-4">
                    User Profile
                  </p>

                  {selectedUserProfile && (
                    <>
                      {selectedUserProfile.photoURL ? (
                        <img
                          src={selectedUserProfile.photoURL}
                          alt={selectedUserProfile.displayName}
                          className="w-full aspect-square rounded-lg object-cover mb-4 border-2 border-cyan-400"
                        />
                      ) : (
                        <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4 border-2 border-slate-600">
                          <span className="text-6xl">👤</span>
                        </div>
                      )}

                      <h2 className="text-2xl font-bold mb-1">
                        {selectedUserProfile.displayName || 'Unknown'}
                      </h2>
                      <p className="text-slate-400 text-sm mb-4 break-all">
                        {selectedUserProfile.email}
                      </p>

                      {selectedUserProfile.phone && (
                        <p className="text-slate-300 mb-4">
                          📱 {selectedUserProfile.phone}
                        </p>
                      )}

                      <div className="pt-4 border-t border-slate-700">
                        <p className="text-xs text-slate-500">User ID</p>
                        <p className="text-xs font-mono text-slate-400 break-all mt-1">
                          {selected.userId}
                        </p>
                      </div>
                    </>
                  )}
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* PROFILE SUBMISSION VIEW */}
        {view === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-2">Submit Admin Profile</h2>
              <p className="text-slate-400 mb-6">
                As an admin, you can also submit your own profile to appear in the submissions list.
              </p>
              <ProfileSubmissionForm
                onSuccess={() => {
                  setView('submissions')
                  fetchData()
                }}
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
