import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { clientService } from '@/services/ClientService'
import { Client } from '@/types'

interface ClientContextValue {
  clients: Client[]
  currentClient: Client | null
  stats: any | null
  loading: boolean
  error: string | null

  fetchClients: () => Promise<void>
  fetchClientById: (id: string) => Promise<Client | null>
  createClient: (data: Omit<Client, 'id'>) => Promise<string>
  updateClient: (id: string, data: Partial<Client>) => Promise<void>
  deleteClient: (id: string) => Promise<void>

  setCurrentClient: (c: Client | null) => void
  clearError: () => void
  clearClients: () => void
}

const ClientContext = createContext<ClientContextValue | undefined>(undefined)

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [currentClient, setCurrentClient] = useState<Client | null>(null)
  const [stats, setStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => { try { setLoading(true); setError(null); const res = await clientService.getClients(); setClients(res) } catch (err) { setError(String(err)) } finally { setLoading(false) } }, [])

  const fetchClientById = useCallback(async (id: string) => { try { setError(null); return await clientService.getClientById(id) } catch (err) { setError(String(err)); return null } }, [])

  const createClient = useCallback(async (data: Omit<Client, 'id'>) => { try { setError(null); const id = await clientService.createClient(data); await fetchClients(); return id } catch (err) { setError(String(err)); throw err } }, [fetchClients])

  const updateClient = useCallback(async (id: string, data: Partial<Client>) => { try { setError(null); await clientService.updateClient(id, data); setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } as Client : c)); if (currentClient?.id === id) setCurrentClient({ ...currentClient, ...data } as Client) } catch (err) { setError(String(err)); throw err } }, [currentClient])

  const deleteClient = useCallback(async (id: string) => { try { setError(null); await clientService.deleteClient(id); setClients(prev => prev.filter(c => c.id !== id)); if (currentClient?.id === id) setCurrentClient(null) } catch (err) { setError(String(err)); throw err } }, [currentClient])

  const value: ClientContextValue = { clients, currentClient, stats, loading, error, fetchClients, fetchClientById, createClient, updateClient, deleteClient, setCurrentClient, clearError: () => setError(null), clearClients: () => { setClients([]); setCurrentClient(null); setStats(null) } }

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
}

export function useClient() { const ctx = useContext(ClientContext); if (!ctx) throw new Error('useClient must be used within ClientProvider'); return ctx }

export default ClientProvider
