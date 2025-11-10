import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ticketService } from '@/services/TicketService'
import { Ticket } from '@/types'

interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  byPriority: Record<string, number>
  byCategory: Record<string, number>
}

interface TicketState {
  // Data
  tickets: Ticket[]
  currentTicket: Ticket | null
  stats: TicketStats | null
  loading: boolean
  error: string | null
  searchResults: Ticket[]
  searchLoading: boolean
  
  // Actions
  fetchTickets: () => Promise<void>
  fetchTicketById: (id: string) => Promise<Ticket | null>
  fetchOpenTickets: () => Promise<void>
  fetchClosedTickets: () => Promise<void>
  fetchTicketsByStatus: (status: Ticket['status']) => Promise<void>
  fetchTicketsByPriority: (priority: Ticket['priority']) => Promise<void>
  fetchTicketsByCategory: (category: Ticket['category']) => Promise<void>
  fetchTicketsByAssignee: (assigneeId: string) => Promise<void>
  fetchTicketsByReporter: (reporterId: string) => Promise<void>
  fetchMyTickets: (userId: string) => Promise<void>
  fetchTicketStats: () => Promise<void>
  
  createTicket: (ticketData: Omit<Ticket, 'id'>) => Promise<string>
  updateTicket: (id: string, ticketData: Partial<Ticket>) => Promise<void>
  deleteTicket: (id: string) => Promise<void>
  
  searchTickets: (query: string) => Promise<void>
  clearSearch: () => void
  
  // Ticket management
  updateTicketStatus: (id: string, status: Ticket['status']) => Promise<void>
  updateTicketPriority: (id: string, priority: Ticket['priority']) => Promise<void>
  assignTicket: (id: string, assigneeId: string) => Promise<void>
  unassignTicket: (id: string) => Promise<void>
  closeTicket: (id: string) => Promise<void>
  reopenTicket: (id: string) => Promise<void>
  
  // Utils
  setCurrentTicket: (ticket: Ticket | null) => void
  clearError: () => void
  clearTickets: () => void
}

export const useTicketStore = create<TicketState>()(
  devtools(
    (set, get) => ({
      // Initial state
      tickets: [],
      currentTicket: null,
      stats: null,
      loading: false,
      error: null,
      searchResults: [],
      searchLoading: false,

      // Fetch all tickets
      fetchTickets: async () => {
        try {
          set({ loading: true, error: null })
          const tickets = await ticketService.getTickets()
          set({ tickets, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tickets'
          set({ error: message, loading: false })
        }
      },

      // Fetch ticket by ID
      fetchTicketById: async (id: string) => {
        try {
          set({ error: null })
          const ticket = await ticketService.getTicketById(id)
          return ticket
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch ticket'
          set({ error: message })
          return null
        }
      },

      // Fetch open tickets
      fetchOpenTickets: async () => {
        await get().fetchTicketsByStatus('open')
      },

      // Fetch closed tickets
      fetchClosedTickets: async () => {
        await get().fetchTicketsByStatus('closed')
      },

      // Fetch tickets by status
      fetchTicketsByStatus: async (status: Ticket['status']) => {
        try {
          set({ loading: true, error: null })
          const tickets = await ticketService.getTicketsByStatus(status)
          set({ tickets, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tickets by status'
          set({ error: message, loading: false })
        }
      },

      // Fetch tickets by priority
      fetchTicketsByPriority: async (priority: Ticket['priority']) => {
        try {
          set({ loading: true, error: null })
          const tickets = await ticketService.getTicketsByPriority(priority)
          set({ tickets, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tickets by priority'
          set({ error: message, loading: false })
        }
      },

      // Fetch tickets by category
      fetchTicketsByCategory: async (category: Ticket['category']) => {
        try {
          set({ loading: true, error: null })
          const tickets = await ticketService.getTicketsByCategory(category)
          set({ tickets, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tickets by category'
          set({ error: message, loading: false })
        }
      },

      // Fetch tickets by assignee
      fetchTicketsByAssignee: async (assigneeId: string) => {
        try {
          set({ loading: true, error: null })
          const tickets = await ticketService.getTicketsByAssignee(assigneeId)
          set({ tickets, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tickets by assignee'
          set({ error: message, loading: false })
        }
      },

      // Fetch tickets by reporter
      fetchTicketsByReporter: async (reporterId: string) => {
        try {
          set({ loading: true, error: null })
          const tickets = await ticketService.getTicketsByReporter(reporterId)
          set({ tickets, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tickets by reporter'
          set({ error: message, loading: false })
        }
      },

      // Fetch my tickets
      fetchMyTickets: async (userId: string) => {
        await get().fetchTicketsByAssignee(userId)
      },

      // Fetch ticket stats
      fetchTicketStats: async () => {
        try {
          set({ error: null })
          const stats = await ticketService.getTicketStats()
          set({ stats })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch ticket stats'
          set({ error: message })
        }
      },

      // Create ticket
      createTicket: async (ticketData: Omit<Ticket, 'id'>) => {
        try {
          set({ error: null })
          const id = await ticketService.createTicket(ticketData)
          
          // Refresh tickets list
          await get().fetchTickets()
          
          return id
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create ticket'
          set({ error: message })
          throw error
        }
      },

      // Update ticket
      updateTicket: async (id: string, ticketData: Partial<Ticket>) => {
        try {
          set({ error: null })
          await ticketService.updateTicket(id, ticketData)
          
          // Update local state
          const tickets = get().tickets.map(ticket => 
            ticket.id === id ? { ...ticket, ...ticketData } : ticket
          )
          set({ tickets })
          
          // Update current ticket if it's the same
          const currentTicket = get().currentTicket
          if (currentTicket && currentTicket.id === id) {
            set({ currentTicket: { ...currentTicket, ...ticketData } })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update ticket'
          set({ error: message })
          throw error
        }
      },

      // Delete ticket
      deleteTicket: async (id: string) => {
        try {
          set({ error: null })
          await ticketService.deleteTicket(id)
          
          // Remove from local state
          const tickets = get().tickets.filter(ticket => ticket.id !== id)
          set({ tickets })
          
          // Clear current ticket if it's the deleted one
          const currentTicket = get().currentTicket
          if (currentTicket && currentTicket.id === id) {
            set({ currentTicket: null })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete ticket'
          set({ error: message })
          throw error
        }
      },

      // Search tickets
      searchTickets: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [] })
          return
        }

        try {
          set({ searchLoading: true, error: null })
          const results = await ticketService.searchTickets(query)
          set({ searchResults: results, searchLoading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to search tickets'
          set({ error: message, searchLoading: false })
        }
      },

      // Clear search
      clearSearch: () => {
        set({ searchResults: [], searchLoading: false })
      },

      // Update ticket status
      updateTicketStatus: async (id: string, status: Ticket['status']) => {
        await get().updateTicket(id, { status })
      },

      // Update ticket priority
      updateTicketPriority: async (id: string, priority: Ticket['priority']) => {
        await get().updateTicket(id, { priority })
      },

      // Assign ticket
      assignTicket: async (id: string, assigneeId: string) => {
        await get().updateTicket(id, { assigneeId })
      },

      // Unassign ticket
      unassignTicket: async (id: string) => {
        await get().updateTicket(id, { assigneeId: undefined })
      },

      // Close ticket
      closeTicket: async (id: string) => {
        await get().updateTicket(id, { status: 'closed' })
      },

      // Reopen ticket
      reopenTicket: async (id: string) => {
        await get().updateTicket(id, { status: 'open' })
      },

      // Utils
      setCurrentTicket: (ticket: Ticket | null) => {
        set({ currentTicket: ticket })
      },

      clearError: () => {
        set({ error: null })
      },

      clearTickets: () => {
        set({ 
          tickets: [], 
          currentTicket: null, 
          stats: null, 
          searchResults: [] 
        })
      }
    }),
    { name: 'ticket-store' }
  )
)