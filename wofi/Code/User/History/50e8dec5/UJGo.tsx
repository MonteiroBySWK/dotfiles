import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type Member = {
  id: string
  name: string
  email: string
  role: string
  tags: string[]
  github?: string
  linkedin?: string
  dateFrom: string
  location: string
  avatar?: string
  phone?: string
  department?: string
  skills: string[]
  projects: string[]
  status: 'active' | 'inactive' | 'vacation'
  createdAt: string
  updatedAt: string
  isOwner?: boolean
}

export type ProjectMember = {
  projectId: string
  memberId: string
  role: 'manager' | 'developer' | 'designer' | 'tester' | 'analyst' | 'stakeholder'
  permissions: string[]
  joinedAt: string
  allocation: number
}

interface MemberContextValue {
  members: Member[]
  projectMembers: ProjectMember[]
  currentMember: Member | null
  loading: boolean
  error: string | null

  setMembers: (m: Member[]) => void
  setCurrentMember: (m: Member | null) => void
  addMember: (m: Member) => void
  updateMember: (id: string, updates: Partial<Member>) => void
  deleteMember: (id: string) => void
  getMemberById: (id: string) => Member | undefined
  getMembersByProject: (projectId: string) => Member[]
  searchMembers: (query: string) => Member[]

  setProjectMembers: (pm: ProjectMember[]) => void
  addMemberToProject: (pm: ProjectMember) => void
  removeMemberFromProject: (projectId: string, memberId: string) => void
  updateProjectMemberRole: (projectId: string, memberId: string, role: ProjectMember['role']) => void
  getProjectMembers: (projectId: string) => ProjectMember[]
  getMemberProjects: (memberId: string) => ProjectMember[]

  setLoading: (l: boolean) => void
  setError: (e: string | null) => void
  clearError: () => void
}

const MemberContext = createContext<MemberContextValue | undefined>(undefined)

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'gabriel-monteiro',
    name: 'Gabriel Monteiro',
    email: 'eumonteiro.ofc@gmail.com',
    role: 'Coordenador',
    tags: ['Coordenador'],
    github: 'github.com/Mon...oBySWK',
    linkedin: 'https://www.linkedin.com/in/montbyswk/',
    dateFrom: '01/03/2023',
    location: 'Uema',
    avatar: '',
    phone: '',
    department: 'Tecnologia',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Firebase'],
    projects: ['alpha', 'beta'],
    status: 'active',
    createdAt: '2023-03-01T14:08:00Z',
    updatedAt: '2025-09-21T14:08:00Z',
    isOwner: true
  }
]

const INITIAL_PROJECT_MEMBERS: ProjectMember[] = [
  {
    projectId: 'alpha',
    memberId: 'gabriel-monteiro',
    role: 'manager',
    permissions: ['read', 'write', 'delete', 'manage'],
    joinedAt: '2023-03-01T14:08:00Z',
    allocation: 80
  }
]

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>(INITIAL_PROJECT_MEMBERS)
  const [currentMember, setCurrentMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMember = useCallback((m: Member) => setMembers(prev => [...prev, m]), [])

  const updateMember = useCallback((id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
  }, [])

  const deleteMember = useCallback((id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id))
    setProjectMembers(prev => prev.filter(pm => pm.memberId !== id))
  }, [])

  const getMemberById = useCallback((id: string) => members.find(m => m.id === id), [members])

  const getMembersByProject = useCallback((projectId: string) => {
    const memberIds = projectMembers.filter(pm => pm.projectId === projectId).map(pm => pm.memberId)
    return members.filter(m => memberIds.includes(m.id))
  }, [members, projectMembers])

  const searchMembers = useCallback((query: string) => {
    const q = query.toLowerCase()
    return members.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q)) ||
      m.skills.some(s => s.toLowerCase().includes(q))
    )
  }, [members])

  const addMemberToProject = useCallback((pm: ProjectMember) => {
    setProjectMembers(prev => {
      const exists = prev.some(p => p.projectId === pm.projectId && p.memberId === pm.memberId)
      if (exists) return prev
      return [...prev, pm]
    })
    setMembers(prev => prev.map(m => m.id === pm.memberId ? { ...m, projects: [...new Set([...m.projects, pm.projectId])] } : m))
  }, [])

  const removeMemberFromProject = useCallback((projectId: string, memberId: string) => {
    setProjectMembers(prev => prev.filter(pm => !(pm.projectId === projectId && pm.memberId === memberId)))
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, projects: m.projects.filter(p => p !== projectId) } : m))
  }, [])

  const updateProjectMemberRole = useCallback((projectId: string, memberId: string, role: ProjectMember['role']) => {
    setProjectMembers(prev => prev.map(pm => pm.projectId === projectId && pm.memberId === memberId ? { ...pm, role } : pm))
  }, [])

  const getProjectMembers = useCallback((projectId: string) => projectMembers.filter(pm => pm.projectId === projectId), [projectMembers])

  const getMemberProjects = useCallback((memberId: string) => projectMembers.filter(pm => pm.memberId === memberId), [projectMembers])

  const value: MemberContextValue = {
    members,
    projectMembers,
    currentMember,
    loading,
    error,
    setMembers,
    setCurrentMember,
    addMember,
    updateMember,
    deleteMember,
    getMemberById,
    getMembersByProject,
    searchMembers,
    setProjectMembers,
    addMemberToProject,
    removeMemberFromProject,
    updateProjectMemberRole,
    getProjectMembers,
    getMemberProjects,
    setLoading,
    setError,
    clearError: () => setError(null)
  }

  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
}

export function useMember() {
  const ctx = useContext(MemberContext)
  if (!ctx) throw new Error('useMember must be used within MemberProvider')
  return ctx
}

export default MemberProvider
