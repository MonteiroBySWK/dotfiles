import { useState, useEffect, useCallback } from 'react'
import type { User } from '@/types'

// Hook para gerenciar usuários
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/users', {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar usuários')
      
      const data = await res.json()
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
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      })
      
      if (!res.ok) throw new Error('Erro ao criar usuário')
      
      const newUser = await res.json()
      await fetchUsers() // Refresh list
      return newUser.id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setError(null)
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      })
      
      if (!res.ok) throw new Error('Erro ao atualizar usuário')
      
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
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao deletar usuário')
      
      await fetchUsers() // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getUserStats = useCallback(async () => {
    try {
      const res = await fetch('/api/users/stats', {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar estatísticas')
      
      const stats = await res.json()
      return stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get user stats')
      throw err
    }
  }, [])

  const findUserById = useCallback((id: string) => {
    return users.find(user => user.id === id);
  }, [users]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
    findUserById
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
      const res = await fetch(`/api/users/${userId}`, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar usuário')
      
      const data = await res.json()
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
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      })
      
      if (!res.ok) throw new Error('Erro ao atualizar usuário')
      
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
      const res = await fetch('/api/users?status=active', {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar usuários ativos')
      
      const data = await res.json()
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
      const res = await fetch(`/api/users?role=${role}`, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar usuários por role')
      
      const data = await res.json()
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
      const res = await fetch(`/api/users?search=${encodeURIComponent(query)}`, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar usuários')
      
      const data = await res.json()
      setResults(data)
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

// Hook para validação de usuário
export function useUserValidation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEmailExists = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/users/validate?email=${encodeURIComponent(email)}`, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao validar email')
      
      const data = await res.json()
      return data.exists
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Email validation failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const checkUserExists = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/users/${userId}/exists`, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao validar usuário')
      
      const data = await res.json()
      return data.exists
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'User validation failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    checkEmailExists,
    checkUserExists
  }
}

// Hook para estatísticas de usuários
export function useUserStats() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    byRole: {} as Record<string, number>
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/users/stats', {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar estatísticas')
      
      const data = await res.json()
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
      const res = await fetch(`/api/users/${userId}`, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar perfil')
      
      const data = await res.json()
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
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileData),
      })
      
      if (!res.ok) throw new Error('Erro ao atualizar perfil')
      
      await fetchProfile() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deactivateAccount = async () => {
    if (!userId) return

    try {
      setError(null)
      const res = await fetch(`/api/users/${userId}/deactivate`, {
        method: 'POST',
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao desativar conta')
      
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
    deactivateAccount
  }
}