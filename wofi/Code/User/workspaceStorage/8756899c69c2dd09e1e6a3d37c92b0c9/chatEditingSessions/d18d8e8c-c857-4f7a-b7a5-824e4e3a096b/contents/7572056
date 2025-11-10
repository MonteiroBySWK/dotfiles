import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Team, Company } from '@/types'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface TeamContextValue {
  teams: Team[]
  companies: Company[]
  currentTeam: Team | null
  currentCompany: Company | null
  loading: boolean
  error: string | null

  loadTeams: () => Promise<void>
  loadCompanies: () => Promise<void>
  setCurrentTeam: (team: Team | null) => void
  setCurrentCompany: (company: Company | null) => void

  setLoading: (l: boolean) => void
  setError: (e: string | null) => void
  clearError: () => void
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const teamsRef = collection(db, 'teams')
      const q = query(teamsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Team[]
      setTeams(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const companiesRef = collection(db, 'companies')
      const q = query(companiesRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Company[]
      setCompanies(list)
      if (!currentCompany && list.length > 0) setCurrentCompany(list[0])
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [currentCompany])

  const value: TeamContextValue = {
    teams,
    companies,
    currentTeam,
    currentCompany,
    loading,
    error,
    loadTeams,
    loadCompanies,
    setCurrentTeam,
    setCurrentCompany,
    setLoading,
    setError,
    clearError: () => setError(null)
  }

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam must be used within TeamProvider')
  return ctx
}

export default TeamProvider
