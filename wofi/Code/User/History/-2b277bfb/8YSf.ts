import { useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { User } from '@/types'
import { userService } from '@/services'

interface UseFirebaseAuthReturn {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  error: string | null
}

export function useFirebaseAuth(): UseFirebaseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      setError(null)

      try {
        if (firebaseUser) {
          // User is signed in
          setFirebaseUser(firebaseUser)
          
          // Get user data from our database
          const userData = await userService.getUserByEmail(firebaseUser.email!)
          
          if (userData) {
            setUser(userData)
            // Update last login
            await userService.updateLastLogin(userData.id)
          } else {
            // User not found in our database, this shouldn't happen
            // but we'll handle it gracefully
            setError('User not found in database')
            setUser(null)
          }
        } else {
          // User is signed out
          setFirebaseUser(null)
          setUser(null)
        }
      } catch (err) {
        console.error('Error in auth state change:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setUser(null)
        setFirebaseUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return { user, firebaseUser, loading, error }
}

// Hook for getting current user data with real-time updates
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { user: authUser } = useFirebaseAuth()

  useEffect(() => {
    if (!authUser) {
      setUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    
    // Subscribe to real-time updates for current user
    const unsubscribe = userService.repo.onDocumentSnapshot(
      authUser.id,
      (userData: User | null) => {
        setUser(userData)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [authUser])

  return { user, loading }
}