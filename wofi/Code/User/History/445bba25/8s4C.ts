import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { userService } from '@/services'
import { User } from '@/types'

interface UserState {
  // Data
  users: User[]
  currentUser: User | null
  stats: {
    total: number
    active: number
    inactive: number
    pending: number
    byRole: Record<string, number>
  } | null
  
  // UI State
  loading: boolean
  error: string | null
  searchResults: User[]
  searchLoading: boolean
  
  // Actions
  fetchUsers: () => Promise<void>
  fetchUserById: (id: string) => Promise<User | null>
  fetchUserByEmail: (email: string) => Promise<User | null>
  fetchActiveUsers: () => Promise<void>
  fetchUsersByRole: (role: User['role']) => Promise<void>
  fetchUserStats: () => Promise<void>
  
  createUser: (userData: Omit<User, 'id'>) => Promise<string>
  updateUser: (id: string, userData: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  
  searchUsers: (query: string) => Promise<void>
  clearSearch: () => void
  
  // User management
  activateUser: (id: string) => Promise<void>
  deactivateUser: (id: string) => Promise<void>
  updateUserProfile: (id: string, profileData: Partial<User>) => Promise<void>
  addUserToTeam: (userId: string, teamId: string) => Promise<void>
  removeUserFromTeam: (userId: string, teamId: string) => Promise<void>
  
  // Utils
  setCurrentUser: (user: User | null) => void
  clearError: () => void
  clearUsers: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // Initial state
      users: [],
      currentUser: null,
      stats: null,
      loading: false,
      error: null,
      searchResults: [],
      searchLoading: false,

      // Fetch all users
      fetchUsers: async () => {
        try {
          set({ loading: true, error: null })
          const users = await userService.getUsers()
          set({ users, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch users'
          set({ error: message, loading: false })
        }
      },

      // Fetch user by ID
      fetchUserById: async (id: string) => {
        try {
          set({ error: null })
          const user = await userService.getUserById(id)
          return user
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch user'
          set({ error: message })
          return null
        }
      },

      // Fetch user by email
      fetchUserByEmail: async (email: string) => {
        try {
          set({ error: null })
          const user = await userService.getUserByEmail(email)
          return user
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch user'
          set({ error: message })
          return null
        }
      },

      // Fetch active users
      fetchActiveUsers: async () => {
        try {
          set({ loading: true, error: null })
          const users = await userService.getActiveUsers()
          set({ users, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch active users'
          set({ error: message, loading: false })
        }
      },

      // Fetch users by role
      fetchUsersByRole: async (role: User['role']) => {
        try {
          set({ loading: true, error: null })
          const users = await userService.getUsersByRole(role)
          set({ users, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch users by role'
          set({ error: message, loading: false })
        }
      },

      // Fetch user stats
      fetchUserStats: async () => {
        try {
          set({ error: null })
          const stats = await userService.getUserStats()
          set({ stats })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch user stats'
          set({ error: message })
        }
      },

      // Create user
      createUser: async (userData: Omit<User, 'id'>) => {
        try {
          set({ error: null })
          const id = await userService.createUser(userData)
          
          // Refresh users list
          await get().fetchUsers()
          
          return id
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create user'
          set({ error: message })
          throw error
        }
      },

      // Update user
      updateUser: async (id: string, userData: Partial<User>) => {
        try {
          set({ error: null })
          await userService.updateUser(id, userData)
          
          // Update local state
          const users = get().users.map(user => 
            user.id === id ? { ...user, ...userData } : user
          )
          set({ users })
          
          // Update current user if it's the same
          const currentUser = get().currentUser
          if (currentUser && currentUser.id === id) {
            set({ currentUser: { ...currentUser, ...userData } })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update user'
          set({ error: message })
          throw error
        }
      },

      // Delete user
      deleteUser: async (id: string) => {
        try {
          set({ error: null })
          await userService.deleteUser(id)
          
          // Remove from local state
          const users = get().users.filter(user => user.id !== id)
          set({ users })
          
          // Clear current user if it's the deleted one
          const currentUser = get().currentUser
          if (currentUser && currentUser.id === id) {
            set({ currentUser: null })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete user'
          set({ error: message })
          throw error
        }
      },

      // Search users
      searchUsers: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [] })
          return
        }

        try {
          set({ searchLoading: true, error: null })
          const allUsers = await userService.getUsers()
          const results = allUsers.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
          )
          set({ searchResults: results, searchLoading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to search users'
          set({ error: message, searchLoading: false })
        }
      },

      // Clear search
      clearSearch: () => {
        set({ searchResults: [], searchLoading: false })
      },

      // Activate user
      activateUser: async (id: string) => {
        await get().updateUser(id, { status: 'active' })
      },

      // Deactivate user
      deactivateUser: async (id: string) => {
        await get().updateUser(id, { status: 'inactive' })
      },

      // Update user profile
      updateUserProfile: async (id: string, profileData: Partial<User>) => {
        try {
          set({ error: null })
          await userService.updateProfile(id, profileData)
          await get().updateUser(id, profileData)
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update profile'
          set({ error: message })
          throw error
        }
      },

      // Add user to team
      addUserToTeam: async (userId: string, teamId: string) => {
        try {
          set({ error: null })
          await userService.addUserToTeam(userId, teamId)
          
          // Update local state
          const users = get().users.map(user => {
            if (user.id === userId && !user.teamIds.includes(teamId)) {
              return { ...user, teamIds: [...user.teamIds, teamId] }
            }
            return user
          })
          set({ users })
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add user to team'
          set({ error: message })
          throw error
        }
      },

      // Remove user from team
      removeUserFromTeam: async (userId: string, teamId: string) => {
        try {
          set({ error: null })
          await userService.removeUserFromTeam(userId, teamId)
          
          // Update local state
          const users = get().users.map(user => {
            if (user.id === userId) {
              return { 
                ...user, 
                teamIds: user.teamIds.filter(id => id !== teamId) 
              }
            }
            return user
          })
          set({ users })
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to remove user from team'
          set({ error: message })
          throw error
        }
      },

      // Utils
      setCurrentUser: (user: User | null) => {
        set({ currentUser: user })
      },

      clearError: () => {
        set({ error: null })
      },

      clearUsers: () => {
        set({ 
          users: [], 
          currentUser: null, 
          stats: null, 
          searchResults: [] 
        })
      }
    }),
    { name: 'user-store' }
  )
)