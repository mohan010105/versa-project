import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import { useAuth } from '../hooks/useAuth'
import { saveUserProfile, addSubmission, updateSubmission } from '../Firebase/Firestore'
import { uploadProfileImage, validateImageFile } from '../Firebase/Storage'
import { updateProfile } from 'firebase/auth'
import { auth } from '../Firebase/Auth'

/**
 * ProfileSubmissionForm Component
 * Handles user profile submission with photo upload
 * Can create new or update existing submission
 */
export default function ProfileSubmissionForm({ initialData = null, onSuccess = null, showPhoneField = true }) {
  const { user } = useAuth()
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    description: '',
    phone: '',
    location: '',
  })

  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData?.photoURL || user?.photoURL || null)
  const [imageError, setImageError] = useState(null)

  const [loading, setLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || user?.displayName || '',
        email: initialData.email || user?.email || '',
        description: initialData.description || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
      })
      if (initialData.photoURL) {
        setImagePreview(initialData.photoURL)
      }
    }
  }, [initialData, user])

  // Auto-fetch location on mount
  useEffect(() => {
    if (!formData.location && 'geolocation' in navigator) {
      setGeoLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const city = data.address?.city || data.address?.town || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            setFormData(prev => ({ ...prev, location: city }))
          } catch {
            setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }))
          } finally {
            setGeoLoading(false)
          }
        },
        () => setGeoLoading(false)
      )
    }
  }, [formData.location])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle image selection with validation
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    setImageError(null)

    if (!file) return

    try {
      validateImageFile(file)
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    } catch (err) {
      setImageError(err.message)
      setImage(null)
    }
  }

  // Handle image removal
  const handleImageRemove = () => {
    setImage(null)
    setImagePreview(null)
    setImageError(null)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      return
    }

    setError(null)
    setSuccess(false)
    setLoading(true)
    setIsSubmitting(true)

    try {
      let photoURL = imagePreview // Use existing preview if no new image

      // Upload new image if selected
      if (image) {
        try {
          photoURL = await uploadProfileImage(user.uid, image, 'profile-photos')
        } catch (uploadErr) {
          throw new Error(`Image upload failed: ${uploadErr.message}`)
        }
      }

      // 1. Update user profile in Firebase Auth
      if (image || (user.photoURL !== photoURL && photoURL)) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: formData.name,
            photoURL: photoURL || null,
          })
        } catch (authErr) {
          console.warn('Could not update Firebase Auth profile:', authErr)
        }
      }

      // 2. Save user profile to Firestore
      await saveUserProfile(user.uid, {
        email: formData.email,
        displayName: formData.name,
        photoURL: photoURL,
        phone: formData.phone || '',
        location: formData.location,
      })

      // 3. Create or update submission
      const submissionData = {
        name: formData.name,
        email: formData.email,
        description: formData.description,
        phone: formData.phone || '',
        location: formData.location,
        photoURL: photoURL,
      }

      if (initialData?.id) {
        // Update existing submission
        await updateSubmission(initialData.id, submissionData)
      } else {
        // Create new submission
        await addSubmission(user.uid, submissionData)
      }

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        description: '',
        phone: '',
        location: '',
      })
      setImage(null)
      setImagePreview(null)

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Submission error:', err)
      setError(err.message || 'Failed to submit profile. Please try again.')
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-sm"
            >
              ✓ Profile submitted successfully!
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm"
            >
              ⚠ {error}
            </motion.div>
          )}

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Profile Photo
            </label>

            {/* Image Preview */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-32 h-32 mx-auto"
              >
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-lg border-2 border-cyan-500/30"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* File Upload Input */}
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
                id="image-input"
                aria-label="Upload profile photo"
              />
              <label
                htmlFor="image-input"
                className={`
                  block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer
                  transition-all duration-200
                  ${
                    imageError
                      ? 'border-red-500/50 bg-red-500/5 text-red-300'
                      : 'border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-500/5 hover:bg-cyan-500/10 text-slate-400'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="text-sm">
                  {loading ? '⏳ Uploading...' : '📷 Click to upload JPG or PNG'}
                </div>
                <div className="text-xs text-slate-500 mt-1">Max 5MB</div>
              </label>
            </div>

            {/* Image Error */}
            {imageError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                ✕ {imageError}
              </motion.p>
            )}
          </div>

          {/* Name Field */}
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
            required
          />

          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={true}
          />

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              rows="4"
              className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-lg p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-200 text-sm resize-none"
              placeholder="Tell us about yourself..."
              required
            />
          </div>

          {/* Phone Field */}
          {showPhoneField && (
            <Input
              label="Phone Number (Optional)"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={loading}
            />
          )}

          {/* Location Field */}
          <Input
            label="Location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            disabled={loading || geoLoading}
            required
          />

          {geoLoading && (
            <p className="text-xs text-cyan-400">🌍 Detecting location...</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
            className="w-full"
          >
            {initialData?.id ? 'Update Profile' : 'Submit Profile'}
          </Button>
        </form>
      </Card>
    </motion.div>
  )
}
