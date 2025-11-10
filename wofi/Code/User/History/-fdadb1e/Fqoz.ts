import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User, UserPreferences } from '@/types'
import { userRepository } from '@/repositories'

export interface RegisterData {
  email: string
  password: string
  name: string
  role?: User['role']
  companyId?: string
}

export interface LoginData {
  email: string
  password: string
}

class AuthService {
  // Register new user
  async register(data: RegisterData): Promise<{ user: User; firebaseUser: FirebaseUser }> {
    try {
      // Create Firebase auth user
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      const firebaseUser = userCredential.user

      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: data.name
      })

      // Create user document in Firestore
      const defaultPreferences: UserPreferences = {
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
      }

      const userData: Omit<User, 'id'> = {
        name: data.name,
        email: data.email,
        avatar: firebaseUser.photoURL || undefined,
        role: data.role || 'viewer',
        status: 'active',
        preferences: defaultPreferences,
        permissions: [],
        companyId: data.companyId,
        teamIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const userId = await userRepository.create(userData)
      const user = await userRepository.getById(userId)

      if (!user) {
        throw new Error('Failed to create user document')
      }

      return { user, firebaseUser }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Login user
  async login(data: LoginData): Promise<{ user: User; firebaseUser: FirebaseUser }> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      const firebaseUser = userCredential.user

      // Get user document from Firestore
      const user = await userRepository.getByEmail(data.email)
      
      if (!user) {
        throw new Error('User document not found')
      }

      // Update last login
      await userRepository.updateLastLogin(user.id)

      return { user, firebaseUser }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  // Update user password
  async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('No authenticated user')
      }

      await updatePassword(user, newPassword)
    } catch (error) {
      console.error('Password update error:', error)
      throw error
    }
  }

  // Update user profile
  async updateUserProfile(updates: {
    displayName?: string
    photoURL?: string
  }): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('No authenticated user')
      }

      await updateProfile(user, updates)

      // Also update Firestore document
      const userData = await userRepository.getByEmail(user.email!)
      if (userData) {
        const firestoreUpdates: Partial<User> = {}
        
        if (updates.displayName) {
          firestoreUpdates.name = updates.displayName
        }
        
        if (updates.photoURL) {
          firestoreUpdates.avatar = updates.photoURL
        }

        if (Object.keys(firestoreUpdates).length > 0) {
          await userRepository.update(userData.id, firestoreUpdates)
        }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  }

  // Get current user data from Firestore
  async getCurrentUserData(): Promise<User | null> {
    try {
      const firebaseUser = this.getCurrentUser()
      if (!firebaseUser) return null

      return await userRepository.getByEmail(firebaseUser.email!)
    } catch (error) {
      console.error('Get current user data error:', error)
      return null
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback)
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser
  }

  // Check if user has specific role
  async hasRole(role: string): Promise<boolean> {
    try {
      const userData = await this.getCurrentUserData()
      return userData?.role === role || false
    } catch (error) {
      console.error('Role check error:', error)
      return false
    }
  }

  // Check if user has specific permission
  async hasPermission(permission: string): Promise<boolean> {
    try {
      const userData = await this.getCurrentUserData()
      return userData?.permissions.includes(permission) || false
    } catch (error) {
      console.error('Permission check error:', error)
      return false
    }
  }

  // Refresh user data
  async refreshUserData(): Promise<User | null> {
    try {
      const firebaseUser = this.getCurrentUser()
      if (!firebaseUser) return null

      const userData = await userRepository.getByEmail(firebaseUser.email!)
      return userData
    } catch (error) {
      console.error('Refresh user data error:', error)
      return null
    }
  }
}

export const authService = new AuthService()
export default authService