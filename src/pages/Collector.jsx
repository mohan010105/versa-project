import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import Loader from '../components/Loader'
import { useAuth } from '../hooks/useAuth'
import { addDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, getUserProfile } from '../Firebase/Firestore'
import { storage } from '../Firebase/Storage'

export default function Collector(){
  const navigate = useNavigate()
  const { user } = useAuth()
  const [name, setName] = useState(user?.displayName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [userPhotoPreview, setUserPhotoPreview] = useState(null)
  const [location, setLocation] = useState('')
  const [useGeolocation, setUseGeolocation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid)
          if (profile) {
            if (profile.displayName) setName(profile.displayName)
            if (profile.email) setEmail(profile.email)
            if (profile.photoURL) setUserPhotoPreview(profile.photoURL)
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err)
        }
      }
    }
    fetchProfile()
  }, [user])

  // Try to get location on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setGeoLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            const data = await response.json()
            setLocation(data.address?.city || data.address?.town || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          } catch {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          } finally {
            setGeoLoading(false)
          }
        },
        () => setGeoLoading(false)
      )
    }
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !description) { setError('Name and description required'); return }
    if (!location) { setError('Location required'); return }

    setError(null)
    setLoading(true)

    try {
      let imageUrl = null
      if (image) {
        const imageRef = ref(storage, `submissions/${user.uid}/${Date.now()}`)
        await uploadBytes(imageRef, image)
        imageUrl = await getDownloadURL(imageRef)
      }

      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        name,
        description,
        imageUrl,
        location,
        timestamp: new Date(),
      })

      setSuccess(true)
      setTimeout(() => window.location.href = '/admin', 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center">
        <Card className="text-center space-y-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl">✓</motion.div>
          <p className="text-slate-300">Submission successful!</p>
          <p className="text-xs text-slate-400">Redirecting to dashboard...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 py-12">
      <div className="container mx-auto px-6">
        {/* Back Button */}
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Submit Your Profile</h1>
          <p className="text-slate-400 mb-8">Share your information with us</p>

          <Card className="max-w-2xl">
            {/* User Info Summary */}
            {(userPhotoPreview || email) && (
              <div className="mb-6 pb-6 border-b border-slate-700 flex items-center gap-4">
                {userPhotoPreview && (
                  <img src={userPhotoPreview} alt="profile" className="w-12 h-12 rounded-full object-cover border border-emerald-400" />
                )}
                <div>
                  <p className="text-xs text-slate-400">Logged in as</p>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Full Name *</label>
                <Input name="name" type="text" label="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Description / Bio *</label>
                <textarea
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-black/6 backdrop-blur-sm border border-black/6 rounded-lg py-3 px-4 text-sm placeholder-slate-300 focus:outline-none focus:shadow-lg transition-shadow text-black"
                  rows="4"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Submission Image (optional)</label>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-white/20 cursor-pointer">
                  <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} className="hidden" id="image-input" />
                  <label htmlFor="image-input" className="cursor-pointer block">
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-24 h-24 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div className="space-y-2">
                        <p className="text-2xl">📸</p>
                        <p className="text-sm text-slate-400">JPG or PNG</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
                  Location *
                  {geoLoading && <Loader />}
                </label>
                <Input
                  name="location"
                  type="text"
                  label="City or Address"
                  value={location}
                  onChange={(e)=>setLocation(e.target.value)}
                  required
                />
                {!geoLoading && location && (
                  <p className="text-xs text-emerald-400 mt-2">✓ Location detected</p>
                )}
              </div>

              {/* Error */}
              {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-300">{error}</motion.div>}

              {/* Submit */}
              <Button type="submit" loading={loading} className="w-full">Submit Profile</Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
