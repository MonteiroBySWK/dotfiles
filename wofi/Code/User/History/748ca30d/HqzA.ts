import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  const isEmulatorConnected = {
    firestore: false,
    auth: false,
    storage: false,
    functions: false
  }

  // Firestore Emulator
  if (!isEmulatorConnected.firestore) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080)
      isEmulatorConnected.firestore = true
      console.log('Connected to Firestore Emulator')
    } catch (error) {
      console.warn('Failed to connect to Firestore Emulator:', error)
    }
  }

  // Auth Emulator
  if (!isEmulatorConnected.auth) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099')
      isEmulatorConnected.auth = true
      console.log('Connected to Auth Emulator')
    } catch (error) {
      console.warn('Failed to connect to Auth Emulator:', error)
    }
  }

  // Storage Emulator
  if (!isEmulatorConnected.storage) {
    try {
      connectStorageEmulator(storage, 'localhost', 9199)
      isEmulatorConnected.storage = true
      console.log('Connected to Storage Emulator')
    } catch (error) {
      console.warn('Failed to connect to Storage Emulator:', error)
    }
  }

  // Functions Emulator
  if (!isEmulatorConnected.functions) {
    try {
      connectFunctionsEmulator(functions, 'localhost', 5001)
      isEmulatorConnected.functions = true
      console.log('Connected to Functions Emulator')
    } catch (error) {
      console.warn('Failed to connect to Functions Emulator:', error)
    }
  }
}

export default app