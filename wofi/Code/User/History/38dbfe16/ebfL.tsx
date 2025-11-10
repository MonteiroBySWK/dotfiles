'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { userService } from '@/services'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  error: string | null
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<User>) => Promise<void>
  // Utils
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setError(null)
        
        if (firebaseUser) {
          setFirebaseUser(firebaseUser)
          
          // Get user data from our database
          const userData = await userService.getUserByEmail(firebaseUser.email!)
          
          if (userData) {
            setUser(userData)
            // Update last login
            await userService.updateLastLogin(userData.id)
          } else {
            // User exists in Firebase but not in our database
            // This shouldn't happen in normal flow, but we handle it
            console.warn('User exists in Firebase but not in database')
            setUser(null)
          }
        } else {
          setFirebaseUser(null)
          setUser(null)
        }
      } catch (err) {
        console.error('Error in auth state change:', err)
        setError(err instanceof Error ? err.message : 'Authentication error')
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      
      // Sign in with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Get user data from our database
      const userData = await userService.getUserByEmail(email)
      
      if (!userData) {
        throw new Error('User not found in database')
      }

      // Check if user is active
      if (userData.status !== 'active') {
        await signOut(auth) // Sign out from Firebase
        throw new Error('Account is not active. Please contact support.')
      }

      setFirebaseUser(result.user)
      setUser(userData)
      
      // Update last login
      await userService.updateLastLogin(userData.id)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setError(null)
      setLoading(true)
      
      // Check if email already exists in our database
      const existingUser = await userService.getUserByEmail(email)
      if (existingUser) {
        throw new Error('Email already registered')
      }

      // Create user in Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update Firebase profile
      if (userData.name) {
        await updateProfile(result.user, {
          displayName: userData.name
        })
      }

      // Create user in our database
      const newUserData: Omit<User, 'id'> = {
        name: userData.name || '',
        email: email,
        avatar: userData.avatar,
        role: userData.role || 'viewer',
        department: userData.department,
        position: userData.position,
        phone: userData.phone,
        bio: userData.bio,
        skills: userData.skills || [],
        status: 'pending', // New users start as pending
        preferences: {
          theme: 'system',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notifications: {
            email: true,
            push: true,
            inApp: true
          },
          dashboard: {
            layout: 'default',
            widgets: []
          }
        },
        permissions: [],
        companyId: userData.companyId,
        teamIds: userData.teamIds || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const userId = await userService.createUser(newUserData)
      const createdUser = await userService.getUserById(userId)
      
      setFirebaseUser(result.user)
      setUser(createdUser)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setFirebaseUser(null)
      setUser(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      setError(null)
      
      if (!user) {
        throw new Error('No user logged in')
      }

      // Update in our database
      await userService.updateUser(user.id, data)
      
      // Update Firebase profile if name or avatar changed
      if (firebaseUser && (data.name || data.avatar)) {
        await updateProfile(firebaseUser, {
          displayName: data.name || firebaseUser.displayName,
          photoURL: data.avatar || firebaseUser.photoURL
        })
      }

      // Update local state
      const updatedUser = await userService.getUserById(user.id)
      setUser(updatedUser)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    error,
    signIn,
    signUp,
    logout,
    updateUserProfile,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }