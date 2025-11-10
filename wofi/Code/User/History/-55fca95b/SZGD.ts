import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { clientService } from '@/services/ClientService'
import { Client } from '@/types'

interface ClientStats {
  total: number
  active: number
  inactive: number
  byType: Record<string, number>
}

interface ClientState {
  // Data
  clients: Client[]
  currentClient: Client | null
  stats: ClientStats | null
  loading: boolean
  error: string | null
  searchResults: Client[]
  searchLoading: boolean
  
  // Actions
  fetchClients: () => Promise<void>
  fetchClientById: (id: string) => Promise<Client | null>
  fetchActiveClients: () => Promise<void>
  fetchInactiveClients: () => Promise<void>
  fetchClientsByType: (type: Client['type']) => Promise<void>
  fetchClientStats: () => Promise<void>
  
  createClient: (clientData: Omit<Client, 'id'>) => Promise<string>
  updateClient: (id: string, clientData: Partial<Client>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  
  searchClients: (query: string) => Promise<void>
  clearSearch: () => void
  
  // Client management
  activateClient: (id: string) => Promise<void>
  deactivateClient: (id: string) => Promise<void>
  addProjectToClient: (clientId: string, projectId: string) => Promise<void>
  removeProjectFromClient: (clientId: string, projectId: string) => Promise<void>
  
  // Utils
  setCurrentClient: (client: Client | null) => void
  clearError: () => void
  clearClients: () => void
}

export const useClientStore = create<ClientState>()(
  devtools(
    (set, get) => ({
      // Initial state
      clients: [],
      currentClient: null,
      stats: null,
      loading: false,
      error: null,
      searchResults: [],
      searchLoading: false,

      // Fetch all clients
      fetchClients: async () => {
        try {
          set({ loading: true, error: null })
          const clients = await clientService.getClients()
          set({ clients, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch clients'
          set({ error: message, loading: false })
        }
      },

      // Fetch client by ID
      fetchClientById: async (id: string) => {
        try {
          set({ error: null })
          const client = await clientService.getClientById(id)
          return client
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch client'
          set({ error: message })
          return null
        }
      },

      // Fetch active clients
      fetchActiveClients: async () => {
        try {
          set({ loading: true, error: null })
          const clients = await clientService.getActiveClients()
          set({ clients, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch active clients'
          set({ error: message, loading: false })
        }
      },

      // Fetch inactive clients
      fetchInactiveClients: async () => {
        try {
          set({ loading: true, error: null })
          const allClients = await clientService.getClients()
          const clients = allClients.filter(c => c.status === 'inactive')
          set({ clients, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch inactive clients'
          set({ error: message, loading: false })
        }
      },

      // Fetch clients by type
      fetchClientsByType: async (type: Client['type']) => {
        try {
          set({ loading: true, error: null })
          const clients = await clientService.getClientsByType(type)
          set({ clients, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch clients by type'
          set({ error: message, loading: false })
        }
      },

      // Fetch client stats
      fetchClientStats: async () => {
        try {
          set({ error: null })
          const stats = await clientService.getClientStats()
          set({ stats })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch client stats'
          set({ error: message })
        }
      },

      // Create client
      createClient: async (clientData: Omit<Client, 'id'>) => {
        try {
          set({ error: null })
          const id = await clientService.createClient(clientData)
          
          // Refresh clients list
          await get().fetchClients()
          
          return id
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create client'
          set({ error: message })
          throw error
        }
      },

      // Update client
      updateClient: async (id: string, clientData: Partial<Client>) => {
        try {
          set({ error: null })
          await clientService.updateClient(id, clientData)
          
          // Update local state
          const clients = get().clients.map(client => 
            client.id === id ? { ...client, ...clientData } : client
          )
          set({ clients })
          
          // Update current client if it's the same
          const currentClient = get().currentClient
          if (currentClient && currentClient.id === id) {
            set({ currentClient: { ...currentClient, ...clientData } })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update client'
          set({ error: message })
          throw error
        }
      },

      // Delete client
      deleteClient: async (id: string) => {
        try {
          set({ error: null })
          await clientService.deleteClient(id)
          
          // Remove from local state
          const clients = get().clients.filter(client => client.id !== id)
          set({ clients })
          
          // Clear current client if it's the deleted one
          const currentClient = get().currentClient
          if (currentClient && currentClient.id === id) {
            set({ currentClient: null })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete client'
          set({ error: message })
          throw error
        }
      },

      // Search clients
      searchClients: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [] })
          return
        }

        try {
          set({ searchLoading: true, error: null })
          const results = await clientService.searchClients(query)
          set({ searchResults: results, searchLoading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to search clients'
          set({ error: message, searchLoading: false })
        }
      },

      // Clear search
      clearSearch: () => {
        set({ searchResults: [], searchLoading: false })
      },

      // Activate client
      activateClient: async (id: string) => {
        await get().updateClient(id, { status: 'active' })
      },

      // Deactivate client
      deactivateClient: async (id: string) => {
        await get().updateClient(id, { status: 'inactive' })
      },

      // Add project to client
      addProjectToClient: async (clientId: string, projectId: string) => {
        try {
          set({ error: null })
          await clientService.addProjectToClient(clientId, projectId)
          
          // Update local state
          const clients = get().clients.map(client => 
            client.id === clientId 
              ? { ...client, projects: [...client.projects, projectId] }
              : client
          )
          set({ clients })
          
          // Update current client if it's the same
          const currentClient = get().currentClient
          if (currentClient && currentClient.id === clientId) {
            set({ 
              currentClient: { 
                ...currentClient, 
                projects: [...currentClient.projects, projectId] 
              } 
            })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add project to client'
          set({ error: message })
          throw error
        }
      },

      // Remove project from client
      removeProjectFromClient: async (clientId: string, projectId: string) => {
        try {
          set({ error: null })
          await clientService.removeProjectFromClient(clientId, projectId)
          
          // Update local state
          const clients = get().clients.map(client => 
            client.id === clientId 
              ? { ...client, projects: client.projects.filter(p => p !== projectId) }
              : client
          )
          set({ clients })
          
          // Update current client if it's the same
          const currentClient = get().currentClient
          if (currentClient && currentClient.id === clientId) {
            set({ 
              currentClient: { 
                ...currentClient, 
                projects: currentClient.projects.filter(p => p !== projectId)
              } 
            })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to remove project from client'
          set({ error: message })
          throw error
        }
      },

      // Utils
      setCurrentClient: (client: Client | null) => {
        set({ currentClient: client })
      },

      clearError: () => {
        set({ error: null })
      },

      clearClients: () => {
        set({ 
          clients: [], 
          currentClient: null, 
          stats: null, 
          searchResults: [] 
        })
      }
    }),
    { name: 'client-store' }
  )
)