import { getFirestore, addDoc, collection, getDocs, query, where, setDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { firebaseApp } from "./FirebaseConfig"

export const db = getFirestore(firebaseApp)

/**
 * USERS COLLECTION SCHEMA:
 * - uid: string (document ID)
 * - email: string
 * - displayName: string
 * - role: 'admin' | 'user' (defaults to 'user')
 * - photoURL: string (optional)
 * - phone: string (optional)
 * - location: string (optional)
 * - createdAt: timestamp
 * - updatedAt: timestamp
 */

/**
 * SUBMISSIONS COLLECTION SCHEMA:
 * - id: string (document ID, auto-generated)
 * - userId: string (reference to users collection)
 * - name: string
 * - description: string
 * - photoURL: string (profile photo)
 * - location: string
 * - email: string
 * - phone: string (optional)
 * - timestamp: timestamp
 * - updatedAt: timestamp (optional)
 */

// ============ USER MANAGEMENT ============

// Helper: Initialize user profile with default role
export async function initializeUserProfile(userId, userData) {
  try {
    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      ...userData,
      role: userData.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true })
    return userId
  } catch (err) {
    throw err
  }
}

// Helper: Save user profile data
export async function saveUserProfile(userId, userData) {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: new Date(),
    }, { merge: true })
    return userId
  } catch (err) {
    throw err
  }
}

// Helper: Get user profile data
export async function getUserProfile(userId) {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId))
    return docSnap.exists() ? docSnap.data() : null
  } catch (err) {
    throw err
  }
}

// Helper: Get user role
export async function getUserRole(userId) {
  try {
    const profile = await getUserProfile(userId)
    return profile?.role || 'user'
  } catch (err) {
    console.error('Error fetching user role:', err)
    return 'user' // Default to user role if error
  }
}

// Helper: Update user role (admin only operation)
export async function updateUserRole(userId, role) {
  try {
    if (!['admin', 'user'].includes(role)) {
      throw new Error('Invalid role. Must be "admin" or "user"')
    }
    await updateDoc(doc(db, 'users', userId), {
      role,
      updatedAt: new Date(),
    })
    return true
  } catch (err) {
    throw err
  }
}

// ============ SUBMISSION MANAGEMENT ============

// Helper: Add submission
export async function addSubmission(userId, data) {
  try {
    const result = await addDoc(collection(db, 'submissions'), {
      userId,
      ...data,
      timestamp: new Date(),
      updatedAt: new Date(),
    })
    return result.id
  } catch (err) {
    throw err
  }
}

// Helper: Update submission
export async function updateSubmission(submissionId, data) {
  try {
    await updateDoc(doc(db, 'submissions', submissionId), {
      ...data,
      updatedAt: new Date(),
    })
    return true
  } catch (err) {
    throw err
  }
}

// Helper: Get all submissions (admin only)
export async function getSubmissions() {
  try {
    const snap = await getDocs(collection(db, 'submissions'))
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (err) {
    throw err
  }
}

// Helper: Get user submissions
export async function getUserSubmissions(userId) {
  try {
    const q = query(collection(db, 'submissions'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (err) {
    throw err
  }
}

// Helper: Get latest user submission
export async function getLatestUserSubmission(userId) {
  try {
    const submissions = await getUserSubmissions(userId)
    if (submissions.length === 0) return null
    return submissions.sort((a, b) => (b.timestamp?.toDate?.() || new Date(0)) - (a.timestamp?.toDate?.() || new Date(0)))[0]
  } catch (err) {
    throw err
  }
}
