import React from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../Firebase/Auth'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'
import Card from '../components/Card'
import { motion } from 'framer-motion'

export default function Home(){
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/auth/login'
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 px-6">
      {/* Back Button */}
      <motion.button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-white mb-6 font-medium hover:text-cyan-300 transition-colors focus:outline-none mt-6"
        whileHover={{ x: -4, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Go back"
      >
        <span className="text-xl">&#8592;</span>
        <span>Back</span>
      </motion.button>

      {/* Header */}
      <header className="border-b border-white/5 bg-white/2 backdrop-blur-sm sticky top-0">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl font-bold">Versa</h1>
            <p className="text-xs text-slate-400">Welcome back</p>
          </motion.div>
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            {user?.photoURL && (
              <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full object-cover border border-emerald-400" />
            )}
            <div className="text-right">
              <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Hero Section */}
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-4">Welcome to Versa</h2>
            <p className="text-lg text-slate-300 mb-8">
              Manage your submissions and explore our community. Choose what you'd like to do below.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Submit Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="h-full flex flex-col justify-between cursor-pointer hover:shadow-lg transition">
                <div>
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-xl font-bold mb-2">Submit Your Profile</h3>
                  <p className="text-slate-300 text-sm">Share your information with us. Upload an image, add your location, and tell us about yourself.</p>
                </div>
                <Button className="mt-6 w-full" onClick={() => window.location.href = '/collector'}>
                  Go to Submissions
                </Button>
              </Card>
            </motion.div>

            {/* View Submissions Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="h-full flex flex-col justify-between cursor-pointer hover:shadow-lg transition">
                <div>
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-2">View All Submissions</h3>
                  <p className="text-slate-300 text-sm">Browse submissions from our community. See profiles, images, and details from other users.</p>
                </div>
                <Button className="mt-6 w-full" onClick={() => window.location.href = '/admin'}>
                  Go to Dashboard
                </Button>
              </Card>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <div className="grid grid-cols-3 gap-8 text-center py-6">
                <div>
                  <p className="text-3xl font-bold text-emerald-400">✓</p>
                  <p className="text-sm text-slate-400 mt-2">Account Active</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-400">✓</p>
                  <p className="text-sm text-slate-400 mt-2">Ready to Submit</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-400">✓</p>
                  <p className="text-sm text-slate-400 mt-2">Community Access</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
