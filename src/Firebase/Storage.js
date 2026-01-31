import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { firebaseApp } from "./FirebaseConfig"

export const storage = getStorage(firebaseApp)

// ============ UPLOAD CONFIGURATION ============
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

// ============ IMAGE UPLOAD WITH VALIDATION ============

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @throws {Error} If validation fails
 */
export function validateImageFile(file) {
  if (!file) {
    throw new Error('No file selected')
  }
  
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG and PNG are allowed.')
  }
  
  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`File size exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)}MB limit`)
  }
  
  return true
}

/**
 * Upload profile image to Firebase Storage
 * @param {string} userId - User ID
 * @param {File} file - Image file
 * @param {string} folder - Storage folder (e.g., 'profile-photos', 'submissions')
 * @returns {Promise<string>} Download URL
 */
export async function uploadProfileImage(userId, file, folder = 'profile-photos') {
  try {
    // Validate image
    validateImageFile(file)
    
    // Create unique filename
    const filename = `${Date.now()}_${file.name}`
    const path = `${folder}/${userId}/${filename}`
    
    // Upload file
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, file, {
      contentType: file.type,
    })
    
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef)
    return downloadURL
  } catch (err) {
    throw new Error(`Image upload failed: ${err.message}`)
  }
}

/**
 * Upload submission image to Firebase Storage
 * @param {string} userId - User ID
 * @param {File} file - Image file
 * @returns {Promise<string>} Download URL
 */
export async function uploadSubmissionImage(userId, file) {
  return uploadProfileImage(userId, file, 'submissions')
}

/**
 * Delete image from Firebase Storage
 * @param {string} path - Full path to the image
 */
export async function deleteImage(path) {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
    return true
  } catch (err) {
    console.error('Failed to delete image:', err)
    throw err
  }
}

/**
 * Upload generic file (backward compatibility)
 * @param {string} path - Storage path
 * @param {File} file - File to upload
 * @returns {Promise<string>} Download URL
 */
export async function uploadFile(path, file) {
  try {
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, file)
    return await getDownloadURL(fileRef)
  } catch (err) {
    throw err
  }
}
