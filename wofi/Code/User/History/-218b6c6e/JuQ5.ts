import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { projectService } from '@/services/ProjectService'
import { taskService } from '@/services/TaskService'
import { Project, Task, DashboardStats } from '@/types'

interface DashboardStore {
  // State
  projects: Project[]
  tasks: Task[]
  stats: DashboardStats | null
  loading: boolean
  error: string | null

  // Recent data for dashboard
  recentProjects: Project[]
  recentTasks: Task[]
  activeProjects: Project[]
  pendingTasks: Task[]
  
  // Actions
  initializeDashboard: () => Promise<void>
  loadProjects: () => Promise<void>
  loadTasks: () => Promise<void>
  loadStats: () => Promise<void>
  refreshData: () => Promise<void>
  
  // Project actions
  createProject: (projectData: Omit<Project, 'id'>) => Promise<void>
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  
  // Task actions
  createTask: (taskData: Omit<Task, 'id'>) => Promise<void>
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  
  // Utilities
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      projects: [],
      tasks: [],
      stats: null,
      loading: false,
      error: null,
      recentProjects: [],
      recentTasks: [],
      activeProjects: [],
      pendingTasks: [],

      // Initialize dashboard data
      initializeDashboard: async () => {
        const { setLoading, setError } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          // Load all dashboard data in parallel
          await Promise.all([
            get().loadProjects(),
            get().loadTasks(),
            get().loadStats()
          ])
          
        } catch (error) {
          console.error('Failed to initialize dashboard:', error)
          setError(error instanceof Error ? error.message : 'Failed to load dashboard data')
        } finally {
          setLoading(false)
        }
      },

      // Load projects
      loadProjects: async () => {
        try {
          const [allProjects, activeProjects] = await Promise.all([
            projectService.getProjects(),
            projectService.getActiveProjects()
          ])

          // Get recent projects (last 5, sorted by creation date)
          const recentProjects = [...allProjects]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5)

          set({
            projects: allProjects,
            activeProjects,
            recentProjects
          })
          
        } catch (error) {
          console.error('Failed to load projects:', error)
          throw error
        }
      },

      // Load tasks
      loadTasks: async () => {
        try {
          const [allTasks, pendingTasks] = await Promise.all([
            taskService.getTasks(),
            taskService.getTasksByStatus('todo')
          ])

          // Get recent tasks (last 5, sorted by creation date)
          const recentTasks = [...allTasks]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5)

          set({
            tasks: allTasks,
            pendingTasks,
            recentTasks
          })
          
        } catch (error) {
          console.error('Failed to load tasks:', error)
          throw error
        }
      },

      // Load statistics
      loadStats: async () => {
        try {
          const [projectStats, taskStats] = await Promise.all([
            projectService.getProjectStats(),
            taskService.getTaskStats()
          ])

          const stats: DashboardStats = {
            totalProjects: projectStats.total,
            activeProjects: projectStats.active,
            completedProjects: projectStats.completed,
            totalTasks: taskStats.total,
            completedTasks: taskStats.completed,
            overdueTasks: taskStats.overdue,
            totalUsers: 0, // Will be implemented when we have UserService
            activeUsers: 0,
            totalClients: 0, // Will be implemented when we have ClientService
            totalTickets: 0, // Will be implemented when we have TicketService
            openTickets: 0,
            revenue: 0, // Will be implemented with financial data
            expenses: 0
          }

          set({ stats })
          
        } catch (error) {
          console.error('Failed to load stats:', error)
          throw error
        }
      },

      // Refresh all data
      refreshData: async () => {
        return get().initializeDashboard()
      },

      // Create new project
      createProject: async (projectData: Omit<Project, 'id'>) => {
        const { setLoading, setError, loadProjects, loadStats } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          await projectService.createProject(projectData)
          
          // Reload projects and stats
          await Promise.all([
            loadProjects(),
            loadStats()
          ])
          
        } catch (error) {
          console.error('Failed to create project:', error)
          setError(error instanceof Error ? error.message : 'Failed to create project')
          throw error
        } finally {
          setLoading(false)
        }
      },

      // Update project
      updateProject: async (id: string, projectData: Partial<Project>) => {
        const { setLoading, setError, loadProjects, loadStats } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          await projectService.updateProject(id, projectData)
          
          // Reload projects and stats
          await Promise.all([
            loadProjects(),
            loadStats()
          ])
          
        } catch (error) {
          console.error('Failed to update project:', error)
          setError(error instanceof Error ? error.message : 'Failed to update project')
          throw error
        } finally {
          setLoading(false)
        }
      },

      // Delete project
      deleteProject: async (id: string) => {
        const { setLoading, setError, loadProjects, loadStats } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          await projectService.deleteProject(id)
          
          // Reload projects and stats
          await Promise.all([
            loadProjects(),
            loadStats()
          ])
          
        } catch (error) {
          console.error('Failed to delete project:', error)
          setError(error instanceof Error ? error.message : 'Failed to delete project')
          throw error
        } finally {
          setLoading(false)
        }
      },

      // Create new task
      createTask: async (taskData: Omit<Task, 'id'>) => {
        const { setLoading, setError, loadTasks, loadStats } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          await taskService.createTask(taskData)
          
          // Reload tasks and stats
          await Promise.all([
            loadTasks(),
            loadStats()
          ])
          
        } catch (error) {
          console.error('Failed to create task:', error)
          setError(error instanceof Error ? error.message : 'Failed to create task')
          throw error
        } finally {
          setLoading(false)
        }
      },

      // Update task
      updateTask: async (id: string, taskData: Partial<Task>) => {
        const { setLoading, setError, loadTasks, loadStats } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          await taskService.updateTask(id, taskData)
          
          // Reload tasks and stats
          await Promise.all([
            loadTasks(),
            loadStats()
          ])
          
        } catch (error) {
          console.error('Failed to update task:', error)
          setError(error instanceof Error ? error.message : 'Failed to update task')
          throw error
        } finally {
          setLoading(false)
        }
      },

      // Delete task
      deleteTask: async (id: string) => {
        const { setLoading, setError, loadTasks, loadStats } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          await taskService.deleteTask(id)
          
          // Reload tasks and stats
          await Promise.all([
            loadTasks(),
            loadStats()
          ])
          
        } catch (error) {
          console.error('Failed to delete task:', error)
          setError(error instanceof Error ? error.message : 'Failed to delete task')
          throw error
        } finally {
          setLoading(false)
        }
      },

      // Utility functions
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'dashboard-store'
    }
  )
)