import { useState, useEffect, useCallback } from 'react'
import { Ticket } from '@/types'

// Mock data para simulação
const mockTickets: Ticket[] = [
  // Adicione alguns tickets mockados se necessário para testes de UI
]

// Hook para gerenciar tickets (versão mockada)
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    await new Promise(resolve => setTimeout(resolve, 500))
    setTickets(mockTickets)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const createTicket = async (ticketData: Omit<Ticket, 'id'>) => {
    console.log('Mock create ticket:', ticketData)
    await fetchTickets()
    return `mock-id-${Date.now()}`
  }

  const updateTicket = async (id: string, ticketData: Partial<Ticket>) => {
    console.log('Mock update ticket:', id, ticketData)
    await fetchTickets()
  }

  const deleteTicket = async (id: string) => {
    console.log('Mock delete ticket:', id)
    await fetchTickets()
  }

  const getTicketStats = useCallback(async () => {
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      byPriority: {},
      byCategory: {}
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

// Hook para ticket específico (versão mockada)
export function useTicket(ticketId: string | null) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTicket = useCallback(async () => {
    if (!ticketId) {
      setTicket(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    await new Promise(resolve => setTimeout(resolve, 500))
    const foundTicket = mockTickets.find(t => t.id === ticketId) || null
    setTicket(foundTicket)
    setLoading(false)
  }, [ticketId])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const updateTicket = async (ticketData: Partial<Ticket>) => {
    if (!ticketId) return
    console.log('Mock update ticket:', ticketId, ticketData)
    await fetchTicket()
  }

  return {
    ticket,
    loading,
    error,
    refetch: fetchTicket,
    updateTicket
  }
}

// Hook para tickets por usuário (versão mockada)
export function useUserTickets(userId: string) {
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([])
  const [reportedTickets, setReportedTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserTickets = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    await new Promise(resolve => setTimeout(resolve, 500))
    setAssignedTickets([])
    setReportedTickets([])
    setLoading(false)
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

// Hook para tickets por categoria (versão mockada)
export function useTicketsByCategory(category: Ticket['category']) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTicketsByCategory = useCallback(async () => {
    if (!category) return
    setLoading(true)
    setError(null)
    await new Promise(resolve => setTimeout(resolve, 500))
    setTickets([])
    setLoading(false)
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

// Hook para buscar tickets (versão mockada)
export function useTicketSearch() {
  const [results, setResults] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchTickets = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    setError(null)
    await new Promise(resolve => setTimeout(resolve, 500))
    setResults([])
    setLoading(false)
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

// Hook para estatísticas de tickets (versão mockada)
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
    setLoading(true)
    setError(null)
    await new Promise(resolve => setTimeout(resolve, 500))
    setStats({
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      byPriority: {},
      byCategory: {}
    })
    setLoading(false)
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
