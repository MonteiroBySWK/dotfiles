import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Team, Company } from '@/types'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface TeamStore {
  // State
  teams: Team[]
  companies: Company[]
  currentTeam: Team | null
  currentCompany: Company | null
  loading: boolean
  error: string | null

  // Actions
  loadTeams: () => Promise<void>
  loadCompanies: () => Promise<void>
  setCurrentTeam: (team: Team | null) => void
  setCurrentCompany: (company: Company | null) => void
  
  // Utilities
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useTeamStore = create<TeamStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      teams: [],
      companies: [],
      currentTeam: null,
      currentCompany: null,
      loading: false,
      error: null,

      // Load teams from Firebase
      loadTeams: async () => {
        const { setLoading, setError } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          const teamsRef = collection(db, 'teams')
          const q = query(teamsRef, orderBy('createdAt', 'desc'))
          const snapshot = await getDocs(q)
          
          const teams: Team[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
          })) as Team[]

          set({ teams })
          
        } catch (error) {
          console.error('Failed to load teams:', error)
          setError(error instanceof Error ? error.message : 'Failed to load teams')
        } finally {
          setLoading(false)
        }
      },

      // Load companies from Firebase
      loadCompanies: async () => {
        const { setLoading, setError } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          const companiesRef = collection(db, 'companies')
          const q = query(companiesRef, orderBy('createdAt', 'desc'))
          const snapshot = await getDocs(q)
          
          const companies: Company[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
          })) as Company[]

          set({ companies })
          
          // Set first company as current if none selected
          const { currentCompany } = get()
          if (!currentCompany && companies.length > 0) {
            set({ currentCompany: companies[0] })
          }
          
        } catch (error) {
          console.error('Failed to load companies:', error)
          setError(error instanceof Error ? error.message : 'Failed to load companies')
        } finally {
          setLoading(false)
        }
      },

      // Set current team
      setCurrentTeam: (team: Team | null) => {
        set({ currentTeam: team })
      },

      // Set current company
      setCurrentCompany: (company: Company | null) => {
        set({ currentCompany: company })
      },

      // Utility functions
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'team-store'
    }
  )
)