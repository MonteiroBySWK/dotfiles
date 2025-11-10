import { useState, useEffect, useCallback } from 'react'
import { ticketService } from '@/services'
import { Ticket } from '@/types'

// Hook para gerenciar tickets
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ticketService.getTickets()
      setTickets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const createTicket = async (ticketData: Omit<Ticket, 'id'>) => {
    try {
      setError(null)
      const id = await ticketService.createTicket(ticketData)
      await fetchTickets() // Refresh list
      return id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateTicket = async (id: string, ticketData: Partial<Ticket>) => {
    try {
      setError(null)
      await ticketService.updateTicket(id, ticketData)
      await fetchTickets() // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ticket'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteTicket = async (id: string) => {
    try {
      setError(null)
      await ticketService.deleteTicket(id)
      await fetchTickets() // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete ticket'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getTicketStats = useCallback(async () => {
    try {
      const stats = await ticketService.getTicketStats()
      return stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get ticket stats')
      throw err
    }
  }, [])

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketStats
  }
}

// Hook para ticket específico
export function useTicket(ticketId: string | null) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTicket = useCallback(async () => {
    if (!ticketId) return

    try {
      setLoading(true)
      setError(null)
      const data = await ticketService.getTicketById(ticketId)
      setTicket(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ticket')
    } finally {
      setLoading(false)
    }
  }, [ticketId])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const updateTicket = async (ticketData: Partial<Ticket>) => {
    if (!ticketId) return

    try {
      setError(null)
      await ticketService.updateTicket(ticketId, ticketData)
      await fetchTicket() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ticket'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    ticket,
    loading,
    error,
    refetch: fetchTicket,
    updateTicket
  }
}

// Hook para tickets por usuário (atribuídos)
export function useUserTickets(userId: string) {
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([])
  const [reportedTickets, setReportedTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserTickets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [assigned, reported] = await Promise.all([
        ticketService.getMyTickets(userId),
        ticketService.getMyReportedTickets(userId)
      ])
      
      setAssignedTickets(assigned)
      setReportedTickets(reported)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user tickets')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchUserTickets()
    }
  }, [fetchUserTickets, userId])

  return {
    assignedTickets,
    reportedTickets,
    loading,
    error,
    refetch: fetchUserTickets
  }
}

// Hook para tickets por categoria
export function useTicketsByCategory(category: Ticket['category']) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTicketsByCategory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ticketService.getTicketsByCategory(category)
      setTickets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets by category')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    if (category) {
      fetchTicketsByCategory()
    }
  }, [fetchTicketsByCategory, category])

  return {
    tickets,
    loading,
    error,
    refetch: fetchTicketsByCategory
  }
}

// Hook para buscar tickets
export function useTicketSearch() {
  const [results, setResults] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchTickets = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await ticketService.searchTickets(query)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search tickets')
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
    searchTickets,
    clearResults
  }
}

// Hook para estatísticas de tickets
export function useTicketStats() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    byPriority: {} as Record<string, number>,
    byCategory: {} as Record<string, number>
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ticketService.getTicketStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ticket stats')
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