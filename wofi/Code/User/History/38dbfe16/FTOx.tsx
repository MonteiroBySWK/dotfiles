'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { User } from '@/types'
import { userService } from '@/services'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  role?: User['role']
  companyId?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, loading: authLoading, error: authError } = useFirebaseAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Combine auth loading with local loading
  const isLoading = authLoading || loading

  // Combine auth error with local error
  const currentError = authError || error

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Check if user exists in our database
      const userData = await userService.getUserByEmail(result.user.email!)
      if (!userData) {
        throw new Error('User not found in database')
      }

      // Update last login
      await userService.updateLastLogin(userData.id)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: RegisterData) => {
    try {
      setLoading(true)
      setError(null)

      // Check if email already exists
      const existingUser = await userService.getUserByEmail(userData.email)
      if (existingUser) {
        throw new Error('Email already exists')
      }

      // Create Firebase user
      const result: UserCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      )

      // Create user document in our database
      const newUser: Omit<User, 'id'> = {
        name: userData.name,
        email: userData.email,
        avatar: result.user.photoURL || undefined,
        role: userData.role || 'viewer',
        status: 'active',
        preferences: {
          theme: 'system',
          language: 'pt',
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
        teamIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await userService.createUser(newUser)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      await signOut(auth)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading: isLoading,
    error: currentError,
    signIn,
    signUp,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext