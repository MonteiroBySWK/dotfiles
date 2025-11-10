import { useState, useEffect, useCallback } from 'react'
import { userService } from '@/services'
import { User } from '@/types'

// Hook para gerenciar usuários
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      setError(null)
      const id = await userService.createUser(userData)
      await fetchUsers() // Refresh list
      return id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setError(null)
      await userService.updateUser(id, userData)
      await fetchUsers() // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      setError(null)
      await userService.deleteUser(id)
      await fetchUsers() // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getUserStats = useCallback(async () => {
    try {
      const stats = await userService.getUserStats()
      return stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get user stats')
      throw err
    }
  }, [])

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserStats
  }
}

// Hook para usuário específico
export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      const data = await userService.getUserById(userId)
      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const updateUser = async (userData: Partial<User>) => {
    if (!userId) return

    try {
      setError(null)
      await userService.updateUser(userId, userData)
      await fetchUser() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser
  }
}

// Hook para usuários ativos
export function useActiveUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActiveUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getActiveUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActiveUsers()
  }, [fetchActiveUsers])

  return {
    users,
    loading,
    error,
    refetch: fetchActiveUsers
  }
}

// Hook para usuários por role
export function useUsersByRole(role: User['role']) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsersByRole = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getUsersByRole(role)
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users by role')
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    if (role) {
      fetchUsersByRole()
    }
  }, [fetchUsersByRole, role])

  return {
    users,
    loading,
    error,
    refetch: fetchUsersByRole
  }
}

// Hook para buscar usuários (implementação simples)
export function useUserSearch() {
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      // Busca simples nos usuários existentes
      const allUsers = await userService.getUsers()
      const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filteredUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users')
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
    setError(null)
  }

  return {
    results,
    loading,
    error,
    searchUsers,
    clearResults
  }
}

// Hook para autenticação de usuário
export function useUserAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authenticateUser = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const user = await userService.authenticateUser(email, password)
      return user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const validateUserCredentials = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const isValid = await userService.validateUserCredentials(email, password)
      return isValid
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Validation failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    authenticateUser,
    validateUserCredentials
  }
}

// Hook para estatísticas de usuários
export function useUserStats() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {} as Record<string, number>,
    byDepartment: {} as Record<string, number>,
    recentlyCreated: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getUserStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

// Hook para perfil do usuário atual
export function useCurrentUserProfile(userId: string | null) {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      const data = await userService.getUserById(userId)
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = async (profileData: Partial<User>) => {
    if (!userId) return

    try {
      setError(null)
      await userService.updateUser(userId, profileData)
      await fetchProfile() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (!userId) return

    try {
      setError(null)
      await userService.updatePassword(userId, newPassword)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deactivateAccount = async () => {
    if (!userId) return

    try {
      setError(null)
      await userService.deactivateUser(userId)
      await fetchProfile() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deactivate account'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    updatePassword,
    deactivateAccount
  }
}