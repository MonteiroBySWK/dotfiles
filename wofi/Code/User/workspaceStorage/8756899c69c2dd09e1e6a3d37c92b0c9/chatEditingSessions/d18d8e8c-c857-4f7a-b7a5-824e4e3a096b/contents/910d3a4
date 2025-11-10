import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { projectService } from '@/services/ProjectService'
import { Project, ProjectMember } from '@/types'

interface ProjectContextValue {
  projects: Project[]
  currentProject: Project | null
  stats: any | null
  loading: boolean
  error: string | null
  searchResults: Project[]
  searchLoading: boolean

  fetchProjects: () => Promise<void>
  fetchProjectById: (id: string) => Promise<Project | null>
  fetchProjectsByStatus: (status: Project['status']) => Promise<void>
  fetchProjectsByPriority: (priority: Project['priority']) => Promise<void>
  fetchProjectsByManager: (managerId: string) => Promise<void>
  fetchProjectsByClient: (clientId: string) => Promise<void>
  fetchActiveProjects: () => Promise<void>
  fetchCompletedProjects: () => Promise<void>
  fetchProjectStats: () => Promise<void>

  createProject: (projectData: Omit<Project, 'id'>) => Promise<string>
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>

  searchProjects: (query: string) => Promise<void>
  clearSearch: () => void

  updateProjectStatus: (id: string, status: Project['status']) => Promise<void>
  updateProjectProgress: (id: string, progress: number) => Promise<void>
  addTeamMember: (projectId: string, userId: string, role?: ProjectMember['role'], allocation?: number) => Promise<void>
  removeTeamMember: (projectId: string, userId: string) => Promise<void>

  setCurrentProject: (p: Project | null) => void
  clearError: () => void
  clearProjects: () => void
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [stats, setStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Project[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await projectService.getProjects()
      setProjects(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally { setLoading(false) }
  }, [])

  const fetchProjectById = useCallback(async (id: string) => {
    try { setError(null); return await projectService.getProjectById(id) } catch (err) { setError(String(err)); return null }
  }, [])

  const fetchProjectsByStatus = useCallback(async (status: Project['status']) => { try { setLoading(true); setError(null); const res = await projectService.getProjectsByStatus(status); setProjects(res) } catch (err) { setError(String(err)) } finally { setLoading(false) } }, [])

  const fetchProjectsByPriority = useCallback(async (priority: Project['priority']) => { try { setLoading(true); setError(null); const res = await projectService.getProjectsByPriority(priority); setProjects(res) } catch (err) { setError(String(err)) } finally { setLoading(false) } }, [])

  const fetchProjectsByManager = useCallback(async (managerId: string) => { try { setLoading(true); setError(null); const res = await projectService.getProjectsByManager(managerId); setProjects(res) } catch (err) { setError(String(err)) } finally { setLoading(false) } }, [])

  const fetchProjectsByClient = useCallback(async (clientId: string) => { try { setLoading(true); setError(null); const res = await projectService.getProjectsByClient(clientId); setProjects(res) } catch (err) { setError(String(err)) } finally { setLoading(false) } }, [])

  const fetchActiveProjects = useCallback(async () => { await fetchProjectsByStatus('active') }, [fetchProjectsByStatus])
  const fetchCompletedProjects = useCallback(async () => { await fetchProjectsByStatus('completed') }, [fetchProjectsByStatus])

  const fetchProjectStats = useCallback(async () => { try { setError(null); const s = await projectService.getProjectStats(); setStats(s) } catch (err) { setError(String(err)) } }, [])

  const createProject = useCallback(async (projectData: Omit<Project, 'id'>) => { try { setError(null); const id = await projectService.createProject(projectData); await fetchProjects(); return id } catch (err) { setError(String(err)); throw err } }, [fetchProjects])

  const updateProject = useCallback(async (id: string, projectData: Partial<Project>) => { try { setError(null); await projectService.updateProject(id, projectData); setProjects(prev => prev.map(p => p.id === id ? { ...p, ...projectData } as Project : p)); if (currentProject?.id === id) setCurrentProject({ ...currentProject, ...projectData } as Project) } catch (err) { setError(String(err)); throw err } }, [currentProject])

  const deleteProject = useCallback(async (id: string) => { try { setError(null); await projectService.deleteProject(id); setProjects(prev => prev.filter(p => p.id !== id)); if (currentProject?.id === id) setCurrentProject(null) } catch (err) { setError(String(err)); throw err } }, [currentProject])

  const searchProjects = useCallback(async (query: string) => { if (!query.trim()) { setSearchResults([]); return } try { setSearchLoading(true); setError(null); const results = await projectService.searchProjects(query); setSearchResults(results) } catch (err) { setError(String(err)) } finally { setSearchLoading(false) } }, [])

  const clearSearch = useCallback(() => setSearchResults([]), [])

  const updateProjectStatus = useCallback(async (id: string, status: Project['status']) => { await updateProject(id, { status }) }, [updateProject])
  const updateProjectProgress = useCallback(async (id: string, progress: number) => { await updateProject(id, { progress }) }, [updateProject])

  const addTeamMember = useCallback(async (projectId: string, userId: string, role: ProjectMember['role'] = 'developer', allocation: number = 100) => { try { setError(null); await projectService.addTeamMember(projectId, userId, role, allocation); const updated = await projectService.getProjectById(projectId); if (updated) setProjects(prev => prev.map(p => p.id === projectId ? updated : p)); if (currentProject?.id === projectId) setCurrentProject(updated || null) } catch (err) { setError(String(err)); throw err } }, [currentProject])

  const removeTeamMember = useCallback(async (projectId: string, userId: string) => { try { setError(null); await projectService.removeTeamMember(projectId, userId); const updated = await projectService.getProjectById(projectId); if (updated) setProjects(prev => prev.map(p => p.id === projectId ? updated : p)); if (currentProject?.id === projectId) setCurrentProject(updated || null) } catch (err) { setError(String(err)); throw err } }, [currentProject])

  const value: ProjectContextValue = { projects, currentProject, stats, loading, error, searchResults, searchLoading, fetchProjects, fetchProjectById, fetchProjectsByStatus, fetchProjectsByPriority, fetchProjectsByManager, fetchProjectsByClient, fetchActiveProjects, fetchCompletedProjects, fetchProjectStats, createProject, updateProject, deleteProject, searchProjects, clearSearch, updateProjectStatus, updateProjectProgress, addTeamMember, removeTeamMember, setCurrentProject, clearError: () => setError(null), clearProjects: () => { setProjects([]); setCurrentProject(null); setStats(null); setSearchResults([]) } }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() { const ctx = useContext(ProjectContext); if (!ctx) throw new Error('useProject must be used within ProjectProvider'); return ctx }

export default ProjectProvider
