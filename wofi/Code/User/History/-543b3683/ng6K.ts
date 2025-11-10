import { useState, useEffect, useCallback } from 'react'
import type { Client } from '@/types'

// Hook para gerenciar clientes
export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/clients', {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar clientes')
      
      const data = await res.json()
      setClients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(clientData),
      })
      
      if (!res.ok) throw new Error('Erro ao criar cliente')
      
      const newClient = await res.json()
      await fetchClients() // Refresh
      return newClient.id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create client'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      setError(null)
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(clientData),
      })
      
      if (!res.ok) throw new Error('Erro ao atualizar cliente')
      
      await fetchClients() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update client'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteClient = async (id: string) => {
    try {
      setError(null)
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao deletar cliente')
      
      await fetchClients() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete client'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient
  }
}

// Hook para cliente específico
export function useClient(clientId: string | null) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClient = useCallback(async () => {
    if (!clientId) return

    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/clients/${clientId}`, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar cliente')
      
      const data = await res.json()
      setClient(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch client')
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    fetchClient()
  }, [fetchClient])

  return {
    client,
    loading,
    error,
    refetch: fetchClient
  }
}

// Hook para clientes ativos
export function useActiveClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActiveClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/clients?status=active', {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar clientes ativos')
      
      const data = await res.json()
      setClients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active clients')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActiveClients()
  }, [fetchActiveClients])

  return { clients, loading, error }
}

// Hook para estatísticas de clientes
export function useClientStats() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/clients/stats', {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar estatísticas')
      
      const data = await res.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch client stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error }
}
