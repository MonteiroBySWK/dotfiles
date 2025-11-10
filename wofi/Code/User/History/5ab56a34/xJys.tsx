import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { userService } from '@/services'
import { User } from '@/types'

interface UserContextValue {
  users: User[]
  currentUser: User | null
  stats: {
    total: number
    active: number
    inactive: number
    pending: number
    byRole: Record<string, number>
  } | null
  loading: boolean
  error: string | null
  searchResults: User[]
  searchLoading: boolean

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

  activateUser: (id: string) => Promise<void>
  deactivateUser: (id: string) => Promise<void>
  updateUserProfile: (id: string, profileData: Partial<User>) => Promise<void>
  addUserToTeam: (userId: string, teamId: string) => Promise<void>
  removeUserFromTeam: (userId: string, teamId: string) => Promise<void>

  setCurrentUser: (user: User | null) => void
  clearError: () => void
  clearUsers: () => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserContextValue['stats']>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await userService.getUsers()
      setUsers(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserById = useCallback(async (id: string) => {
    try {
      setError(null)
      return await userService.getUserById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      return null
    }
  }, [])

  const fetchUserByEmail = useCallback(async (email: string) => {
    try {
      setError(null)
      return await userService.getUserByEmail(email)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      return null
    }
  }, [])

  const fetchActiveUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await userService.getActiveUsers()
      setUsers(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUsersByRole = useCallback(async (role: User['role']) => {
    try {
      setLoading(true)
      setError(null)
      const res = await userService.getUsersByRole(role)
      setUsers(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserStats = useCallback(async () => {
    try {
      setError(null)
      const s = await userService.getUserStats()
      setStats(s)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [])

  const createUser = useCallback(async (userData: Omit<User, 'id'>) => {
    try {
      setError(null)
      const id = await userService.createUser(userData)
      await fetchUsers()
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      throw err
    }
  }, [fetchUsers])

  const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
    try {
      setError(null)
      await userService.updateUser(id, userData)
      setUsers((prev) => prev.map(u => u.id === id ? { ...u, ...userData } as User : u))
      if (currentUser && currentUser.id === id) setCurrentUser({ ...currentUser, ...userData })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      throw err
    }
  }, [currentUser])

  const deleteUser = useCallback(async (id: string) => {
    try {
      setError(null)
      await userService.deleteUser(id)
      setUsers((prev) => prev.filter(u => u.id !== id))
      if (currentUser && currentUser.id === id) setCurrentUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      throw err
    }
  }, [currentUser])

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    try {
      setSearchLoading(true)
      setError(null)
      const all = await userService.getUsers()
      const results = all.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSearchLoading(false)
    }
  }, [])

  const clearSearch = useCallback(() => setSearchResults([]), [])

  const activateUser = useCallback(async (id: string) => {
    await updateUser(id, { status: 'active' } as Partial<User>)
  }, [updateUser])

  const deactivateUser = useCallback(async (id: string) => {
    await updateUser(id, { status: 'inactive' } as Partial<User>)
  }, [updateUser])

  const updateUserProfile = useCallback(async (id: string, profileData: Partial<User>) => {
    try {
      setError(null)
      await userService.updateProfile(id, profileData)
      await updateUser(id, profileData)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      throw err
    }
  }, [updateUser])

  const addUserToTeam = useCallback(async (userId: string, teamId: string) => {
    try {
      setError(null)
      await userService.addUserToTeam(userId, teamId)
      setUsers((prev) => prev.map(u => u.id === userId && !u.teamIds.includes(teamId) ? { ...u, teamIds: [...u.teamIds, teamId] } : u))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      throw err
    }
  }, [])

  const removeUserFromTeam = useCallback(async (userId: string, teamId: string) => {
    try {
      setError(null)
      await userService.removeUserFromTeam(userId, teamId)
      setUsers((prev) => prev.map(u => u.id === userId ? { ...u, teamIds: u.teamIds.filter(t => t !== teamId) } : u))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      throw err
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])
  const clearUsers = useCallback(() => {
    setUsers([])
    setCurrentUser(null)
    setStats(null)
    setSearchResults([])
  }, [])

  const value: UserContextValue = {
    users,
    currentUser,
    stats,
    loading,
    error,
    searchResults,
    searchLoading,
    fetchUsers,
    fetchUserById,
    fetchUserByEmail,
    fetchActiveUsers,
    fetchUsersByRole,
    fetchUserStats,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    clearSearch,
    activateUser,
    deactivateUser,
    updateUserProfile,
    addUserToTeam,
    removeUserFromTeam,
    setCurrentUser,
    clearError,
    clearUsers
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

export default UserProvider
