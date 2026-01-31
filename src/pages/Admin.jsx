import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../Firebase/Auth'
import { getSubmissions, getUserProfile } from '../Firebase/Firestore'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'
import Card from '../components/Card'
import Loader from '../components/Loader'
import { motion } from 'framer-motion'

export default function Admin(){
  const navigate = useNavigate()
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [userProfiles, setUserProfiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState('grid')

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getSubmissions()
        setSubmissions(data)
        
        // Fetch user profiles for all submissions
        const profiles = {}
        for (const sub of data) {
          if (sub.userId && !profiles[sub.userId]) {
            try {
              const profile = await getUserProfile(sub.userId)
              profiles[sub.userId] = profile
            } catch (err) {
              console.error(`Failed to fetch profile for ${sub.userId}:`, err)
              profiles[sub.userId] = null
            }
          }
        }
        setUserProfiles(profiles)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/auth/login'
    } catch (err) {
      console.error(err)
    }
  }

  const selected = submissions.find(s => s.id === selectedId)
  const selectedUserProfile = selected ? userProfiles[selected.userId] : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white mb-6 font-medium hover:text-cyan-300 transition-colors focus:outline-none"
          whileHover={{ x: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go back"
        >
          <span className="text-xl">&#8592;</span>
          <span>Back</span>
        </motion.button>
      </div>

      <header className="border-b border-white/5 bg-white/2 backdrop-blur-sm sticky top-0">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-slate-400">{user?.displayName || user?.email}</p>
          </div>
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {view === 'grid' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Submissions</h2>
                <p className="text-sm text-slate-400">{submissions.length} entries</p>
              </div>
            </div>

            {submissions.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-slate-400">No submissions yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((sub, idx) => {
                  const profile = userProfiles[sub.userId]
                  return (
                    <motion.div key={sub.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => { setSelectedId(sub.id); setView('detail') }}>
                        {/* Submission Image */}
                        {sub.imageUrl ? (
                          <img src={sub.imageUrl} alt={sub.name} className="w-full h-40 rounded-lg object-cover mb-4" />
                        ) : (
                          <div className="w-full h-40 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4">
                            <p className="text-4xl">👤</p>
                          </div>
                        )}
                        
                        {/* User Profile Info */}
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
                          {profile?.photoURL ? (
                            <img src={profile.photoURL} alt={profile.displayName} className="w-8 h-8 rounded-full object-cover border border-emerald-400" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">👤</div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{profile?.displayName || 'Unknown'}</p>
                            <p className="text-xs text-slate-500">{profile?.email || 'No email'}</p>
                          </div>
                        </div>
                        
                        {/* Submission Info */}
                        <h3 className="font-semibold">{sub.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{sub.description}</p>
                        <p className="text-xs text-slate-500 mt-2">📍 {sub.location}</p>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {view === 'detail' && selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button variant="ghost" onClick={() => setView('grid')} className="mb-6">← Back</Button>
            <Card>
              {/* User Profile Header */}
              {selectedUserProfile && (
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
                  {selectedUserProfile.photoURL ? (
                    <img src={selectedUserProfile.photoURL} alt={selectedUserProfile.displayName} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl">👤</div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUserProfile.displayName}</h3>
                    <p className="text-sm text-slate-400">{selectedUserProfile.email}</p>
                  </div>
                </div>
              )}
              
              {/* Submission Image */}
              {selected.imageUrl ? (
                <img src={selected.imageUrl} alt={selected.name} className="w-full h-96 rounded-lg object-cover mb-6" />
              ) : (
                <div className="w-full h-96 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-6">
                  <p className="text-8xl">👤</p>
                </div>
              )}
              
              {/* Submission Details */}
              <h2 className="text-3xl font-bold mb-2">{selected.name}</h2>
              <p className="text-slate-300 mb-4">{selected.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Location</p>
                  <p className="font-medium">{selected.location}</p>
                </div>
                <div>
                  <p className="text-slate-400">Submitted</p>
                  <p className="font-medium">{selected.timestamp?.toDate ? selected.timestamp.toDate().toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
