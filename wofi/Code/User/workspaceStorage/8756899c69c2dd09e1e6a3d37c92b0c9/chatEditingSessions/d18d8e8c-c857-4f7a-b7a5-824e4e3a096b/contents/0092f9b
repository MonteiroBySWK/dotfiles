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

import { useUser } from '@/contexts/UserContext'

// Compatibility wrapper: projects import `useUserStore` from stores/index.ts
export function useUserStore() {
  return useUser()
}

export { default as UserProvider } from '@/contexts/UserContext'