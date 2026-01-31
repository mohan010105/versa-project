import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../Firebase/Auth'
import { getUserRole, initializeUserProfile } from '../Firebase/Firestore'

/**
 * useAuth Hook
 * Manages authentication state and user role
 * Automatically initializes new user profiles with 'user' role
 */
export function useAuth(){
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser)
          
          // Fetch user role from Firestore
          const userRole = await getUserRole(currentUser.uid)
          setRole(userRole)
          
          // Initialize new user profile if doesn't exist
          // This creates a document with default 'user' role
          const isNewUser = currentUser.metadata?.creationTime === currentUser.metadata?.lastSignInTime
          if (isNewUser) {
            try {
              await initializeUserProfile(currentUser.uid, {
                email: currentUser.email,
                displayName: currentUser.displayName || '',
                photoURL: currentUser.photoURL || null,
              })
              setRole('user') // New users are always 'user' by default
            } catch (err) {
              console.error('Failed to initialize user profile:', err)
            }
          }
        } else {
          setUser(null)
          setRole(null)
        }
        setError(null)
      } catch (err) {
        console.error('Auth state change error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  return { user, role, loading, error }
}
