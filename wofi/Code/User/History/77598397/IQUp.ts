import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { projectService } from '@/services'
import { Project } from '@/types'

interface ProjectState {
  // Data
  projects: Project[]
  currentProject: Project | null
  stats: {
    total: number
    active: number
    completed: number
    onHold: number
    cancelled: number
    byPriority: Record<string, number>
    byStatus: Record<string, number>
  } | null
  
  // UI State
  loading: boolean
  error: string | null
  searchResults: Project[]
  searchLoading: boolean
  
  // Actions
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
  
  // Project management
  updateProjectStatus: (id: string, status: Project['status']) => Promise<void>
  updateProjectProgress: (id: string, progress: number) => Promise<void>
  addTeamMember: (projectId: string, member: { userId: string; role: string; allocation: number }) => Promise<void>
  removeTeamMember: (projectId: string, userId: string) => Promise<void>
  updateTeamMember: (projectId: string, userId: string, updates: Partial<{ role: string; allocation: number }>) => Promise<void>
  addMilestone: (projectId: string, milestone: any) => Promise<void>
  updateMilestone: (projectId: string, milestoneId: string, updates: any) => Promise<void>
  completeMilestone: (projectId: string, milestoneId: string) => Promise<void>
  
  // Utils
  setCurrentProject: (project: Project | null) => void
  clearError: () => void
  clearProjects: () => void
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      // Initial state
      projects: [],
      currentProject: null,
      stats: null,
      loading: false,
      error: null,
      searchResults: [],
      searchLoading: false,

      // Fetch all projects
      fetchProjects: async () => {
        try {
          set({ loading: true, error: null })
          const projects = await projectService.getProjects()
          set({ projects, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch projects'
          set({ error: message, loading: false })
        }
      },

      // Fetch project by ID
      fetchProjectById: async (id: string) => {
        try {
          set({ error: null })
          const project = await projectService.getProjectById(id)
          return project
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch project'
          set({ error: message })
          return null
        }
      },

      // Fetch projects by status
      fetchProjectsByStatus: async (status: Project['status']) => {
        try {
          set({ loading: true, error: null })
          const projects = await projectService.getProjectsByStatus(status)
          set({ projects, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch projects by status'
          set({ error: message, loading: false })
        }
      },

      // Fetch projects by priority
      fetchProjectsByPriority: async (priority: Project['priority']) => {
        try {
          set({ loading: true, error: null })
          const projects = await projectService.getProjectsByPriority(priority)
          set({ projects, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch projects by priority'
          set({ error: message, loading: false })
        }
      },

      // Fetch projects by manager
      fetchProjectsByManager: async (managerId: string) => {
        try {
          set({ loading: true, error: null })
          const projects = await projectService.getProjectsByManager(managerId)
          set({ projects, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch projects by manager'
          set({ error: message, loading: false })
        }
      },

      // Fetch projects by client
      fetchProjectsByClient: async (clientId: string) => {
        try {
          set({ loading: true, error: null })
          const projects = await projectService.getProjectsByClient(clientId)
          set({ projects, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch projects by client'
          set({ error: message, loading: false })
        }
      },

      // Fetch active projects
      fetchActiveProjects: async () => {
        await get().fetchProjectsByStatus('active')
      },

      // Fetch completed projects
      fetchCompletedProjects: async () => {
        await get().fetchProjectsByStatus('completed')
      },

      // Fetch project stats
      fetchProjectStats: async () => {
        try {
          set({ error: null })
          const stats = await projectService.getProjectStats()
          set({ stats })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch project stats'
          set({ error: message })
        }
      },

      // Create project
      createProject: async (projectData: Omit<Project, 'id'>) => {
        try {
          set({ error: null })
          const id = await projectService.createProject(projectData)
          
          // Refresh projects list
          await get().fetchProjects()
          
          return id
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create project'
          set({ error: message })
          throw error
        }
      },

      // Update project
      updateProject: async (id: string, projectData: Partial<Project>) => {
        try {
          set({ error: null })
          await projectService.updateProject(id, projectData)
          
          // Update local state
          const projects = get().projects.map(project => 
            project.id === id ? { ...project, ...projectData } : project
          )
          set({ projects })
          
          // Update current project if it's the same
          const currentProject = get().currentProject
          if (currentProject && currentProject.id === id) {
            set({ currentProject: { ...currentProject, ...projectData } })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update project'
          set({ error: message })
          throw error
        }
      },

      // Delete project
      deleteProject: async (id: string) => {
        try {
          set({ error: null })
          await projectService.deleteProject(id)
          
          // Remove from local state
          const projects = get().projects.filter(project => project.id !== id)
          set({ projects })
          
          // Clear current project if it's the deleted one
          const currentProject = get().currentProject
          if (currentProject && currentProject.id === id) {
            set({ currentProject: null })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete project'
          set({ error: message })
          throw error
        }
      },

      // Search projects
      searchProjects: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [] })
          return
        }

        try {
          set({ searchLoading: true, error: null })
          const results = await projectService.searchProjects(query)
          set({ searchResults: results, searchLoading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to search projects'
          set({ error: message, searchLoading: false })
        }
      },

      // Clear search
      clearSearch: () => {
        set({ searchResults: [], searchLoading: false })
      },

      // Update project status
      updateProjectStatus: async (id: string, status: Project['status']) => {
        await get().updateProject(id, { status })
      },

      // Update project progress
      updateProjectProgress: async (id: string, progress: number) => {
        await get().updateProject(id, { progress })
      },

      // Add team member
      addTeamMember: async (projectId: string, member: { userId: string; role: string; allocation: number }) => {
        try {
          set({ error: null })
          await projectService.addTeamMember(projectId, member.userId, member.role as any, member.allocation)
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add team member'
          set({ error: message })
          throw error
        }
      },

      // Remove team member
      removeTeamMember: async (projectId: string, userId: string) => {
        try {
          set({ error: null })
          await projectService.removeTeamMember(projectId, userId)
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to remove team member'
          set({ error: message })
          throw error
        }
      },

      // Update team member
      updateTeamMember: async (projectId: string, userId: string, updates: Partial<{ role: string; allocation: number }>) => {
        try {
          set({ error: null })
          if (updates.role) {
            await projectService.updateTeamMemberRole(projectId, userId, updates.role as any)
          }
          if (updates.allocation !== undefined) {
            await projectService.updateTeamMemberAllocation(projectId, userId, updates.allocation)
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update team member'
          set({ error: message })
          throw error
        }
      },

      // Add milestone
      addMilestone: async (projectId: string, milestone: any) => {
        try {
          set({ error: null })
          await projectService.addMilestone(projectId, milestone)
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add milestone'
          set({ error: message })
          throw error
        }
      },

      // Update milestone
      updateMilestone: async (projectId: string, milestoneId: string, updates: any) => {
        try {
          set({ error: null })
          await projectService.updateMilestone(projectId, milestoneId, updates)
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update milestone'
          set({ error: message })
          throw error
        }
      },

      // Complete milestone
      completeMilestone: async (projectId: string, milestoneId: string) => {
        try {
          set({ error: null })
          await projectService.completeMilestone(projectId, milestoneId)
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to complete milestone'
          set({ error: message })
          throw error
        }
      },

      // Utils
      setCurrentProject: (project: Project | null) => {
        set({ currentProject: project })
      },

      clearError: () => {
        set({ error: null })
      },

      clearProjects: () => {
        set({ 
          projects: [], 
          currentProject: null, 
          stats: null, 
          searchResults: [] 
        })
      }
    }),
    { name: 'project-store' }
  )
)
