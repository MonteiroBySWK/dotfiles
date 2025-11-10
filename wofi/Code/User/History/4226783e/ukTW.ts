import { useState, useEffect } from 'react'
import { clientService } from '@/services'
import { Client } from '@/types'

// Hook para gerenciar clientes
export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientService.getClients()
      setClients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const createClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const id = await clientService.createClient(clientData)
      await fetchClients() // Refresh the list
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client')
      throw err
    }
  }

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      await clientService.updateClient(id, clientData)
      await fetchClients() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client')
      throw err
    }
  }

  const deleteClient = async (id: string) => {
    try {
      await clientService.deleteClient(id)
      await fetchClients() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client')
      throw err
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

// Hook para um cliente específico
export function useClient(clientId: string) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClient = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientService.getClientById(clientId)
      setClient(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch client')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (clientId) {
      fetchClient()
    }
  }, [clientId])

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

  useEffect(() => {
    const fetchActiveClients = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await clientService.getActiveClients()
        setClients(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch active clients')
      } finally {
        setLoading(false)
      }
    }

    fetchActiveClients()
  }, [])

  return { clients, loading, error }
}

// Hook para estatísticas de clientes
export function useClientStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await clientService.getClientStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch client stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}