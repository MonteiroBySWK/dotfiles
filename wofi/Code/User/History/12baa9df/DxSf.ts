import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { taskService } from '@/services/TaskService'
import { Task, TaskComment, ChecklistItem } from '@/types'

interface TaskStats {
  total: number
  todo: number
  inProgress: number
  completed: number
  overdue: number
  dueToday: number
  byPriority: Record<string, number>
}

interface TaskState {
  // Data
  tasks: Task[]
  currentTask: Task | null
  stats: TaskStats | null
  loading: boolean
  error: string | null
  searchResults: Task[]
  searchLoading: boolean
  
  // Actions
  fetchTasks: () => Promise<void>
  fetchTaskById: (id: string) => Promise<Task | null>
  fetchTasksByProject: (projectId: string) => Promise<void>
  fetchTasksByAssignee: (assigneeId: string) => Promise<void>
  fetchTasksByStatus: (status: Task['status']) => Promise<void>
  fetchTasksByPriority: (priority: Task['priority']) => Promise<void>
  fetchOverdueTasks: () => Promise<void>
  fetchMyTasks: (userId: string) => Promise<void>
  fetchTaskStats: () => Promise<void>
  
  createTask: (taskData: Omit<Task, 'id'>) => Promise<string>
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  
  searchTasks: (query: string) => Promise<void>
  clearSearch: () => void
  
  // Task management
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>
  updateTaskProgress: (id: string, progress: number) => Promise<void>
  assignTask: (id: string, assigneeId: string) => Promise<void>
  unassignTask: (id: string) => Promise<void>
  
  // Comments
  addComment: (taskId: string, content: string, authorId: string) => Promise<void>
  updateComment: (taskId: string, commentId: string, content: string) => Promise<void>
  deleteComment: (taskId: string, commentId: string) => Promise<void>
  
  // Checklist
  addChecklistItem: (taskId: string, text: string, assigneeId?: string, dueDate?: Date) => Promise<void>
  updateChecklistProgress: (taskId: string, itemId: string, completed: boolean) => Promise<void>
  
  // Utils
  setCurrentTask: (task: Task | null) => void
  clearError: () => void
  clearTasks: () => void
}

export const useTaskStore = create<TaskState>()(
  devtools(
    (set, get) => ({
      // Initial state
      tasks: [],
      currentTask: null,
      stats: null,
      loading: false,
      error: null,
      searchResults: [],
      searchLoading: false,

      // Fetch all tasks
      fetchTasks: async () => {
        try {
          set({ loading: true, error: null })
          const tasks = await taskService.getTasks()
          set({ tasks, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tasks'
          set({ error: message, loading: false })
        }
      },

      // Fetch task by ID
      fetchTaskById: async (id: string) => {
        try {
          set({ error: null })
          const task = await taskService.getTaskById(id)
          return task
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch task'
          set({ error: message })
          return null
        }
      },

      // Fetch tasks by project
      fetchTasksByProject: async (projectId: string) => {
        try {
          set({ loading: true, error: null })
          const tasks = await taskService.getTasksByProject(projectId)
          set({ tasks, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tasks by project'
          set({ error: message, loading: false })
        }
      },

      // Fetch tasks by assignee
      fetchTasksByAssignee: async (assigneeId: string) => {
        try {
          set({ loading: true, error: null })
          const tasks = await taskService.getTasksByAssignee(assigneeId)
          set({ tasks, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tasks by assignee'
          set({ error: message, loading: false })
        }
      },

      // Fetch tasks by status
      fetchTasksByStatus: async (status: Task['status']) => {
        try {
          set({ loading: true, error: null })
          const tasks = await taskService.getTasksByStatus(status)
          set({ tasks, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tasks by status'
          set({ error: message, loading: false })
        }
      },

      // Fetch tasks by priority
      fetchTasksByPriority: async (priority: Task['priority']) => {
        try {
          set({ loading: true, error: null })
          const tasks = await taskService.getTasksByPriority(priority)
          set({ tasks, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tasks by priority'
          set({ error: message, loading: false })
        }
      },

      // Fetch overdue tasks
      fetchOverdueTasks: async () => {
        try {
          set({ loading: true, error: null })
          const tasks = await taskService.getOverdueTasks()
          set({ tasks, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch overdue tasks'
          set({ error: message, loading: false })
        }
      },

      // Fetch my tasks
      fetchMyTasks: async (userId: string) => {
        await get().fetchTasksByAssignee(userId)
      },

      // Fetch task stats
      fetchTaskStats: async () => {
        try {
          set({ error: null })
          const stats = await taskService.getTaskStats()
          set({ stats })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch task stats'
          set({ error: message })
        }
      },

      // Create task
      createTask: async (taskData: Omit<Task, 'id'>) => {
        try {
          set({ error: null })
          const id = await taskService.createTask(taskData)
          
          // Refresh tasks list
          await get().fetchTasks()
          
          return id
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create task'
          set({ error: message })
          throw error
        }
      },

      // Update task
      updateTask: async (id: string, taskData: Partial<Task>) => {
        try {
          set({ error: null })
          await taskService.updateTask(id, taskData)
          
          // Update local state
          const tasks = get().tasks.map(task => 
            task.id === id ? { ...task, ...taskData } : task
          )
          set({ tasks })
          
          // Update current task if it's the same
          const currentTask = get().currentTask
          if (currentTask && currentTask.id === id) {
            set({ currentTask: { ...currentTask, ...taskData } })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update task'
          set({ error: message })
          throw error
        }
      },

      // Delete task
      deleteTask: async (id: string) => {
        try {
          set({ error: null })
          await taskService.deleteTask(id)
          
          // Remove from local state
          const tasks = get().tasks.filter(task => task.id !== id)
          set({ tasks })
          
          // Clear current task if it's the deleted one
          const currentTask = get().currentTask
          if (currentTask && currentTask.id === id) {
            set({ currentTask: null })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete task'
          set({ error: message })
          throw error
        }
      },

      // Search tasks
      searchTasks: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [] })
          return
        }

        try {
          set({ searchLoading: true, error: null })
          const results = await taskService.searchTasks(query)
          set({ searchResults: results, searchLoading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to search tasks'
          set({ error: message, searchLoading: false })
        }
      },

      // Clear search
      clearSearch: () => {
        set({ searchResults: [], searchLoading: false })
      },

      // Update task status
      updateTaskStatus: async (id: string, status: Task['status']) => {
        await get().updateTask(id, { status })
      },

      // Update task estimation
      updateTaskEstimation: async (id: string, estimatedHours: number) => {
        await get().updateTask(id, { estimatedHours })
      },

      // Assign task
      assignTask: async (id: string, assigneeId: string) => {
        await get().updateTask(id, { assigneeId })
      },

      // Unassign task
      unassignTask: async (id: string) => {
        await get().updateTask(id, { assigneeId: undefined })
      },

      // Add comment
      addComment: async (taskId: string, content: string, authorId: string, mentions: string[] = []) => {
        try {
          set({ error: null })
          await taskService.addTaskComment(taskId, content, authorId, mentions)
          
          // Refresh the task
          const updatedTask = await taskService.getTaskById(taskId)
          if (updatedTask) {
            const tasks = get().tasks.map(t => 
              t.id === taskId ? updatedTask : t
            )
            set({ tasks })
            
            if (get().currentTask?.id === taskId) {
              set({ currentTask: updatedTask })
            }
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add comment'
          set({ error: message })
          throw error
        }
      },

      // Add checklist item
      addChecklistItem: async (taskId: string, text: string, assigneeId?: string, dueDate?: Date) => {
        try {
          set({ error: null })
          await taskService.addChecklistItem(taskId, text, assigneeId, dueDate)
          
          // Refresh the task
          const updatedTask = await taskService.getTaskById(taskId)
          if (updatedTask) {
            const tasks = get().tasks.map(t => 
              t.id === taskId ? updatedTask : t
            )
            set({ tasks })
            
            if (get().currentTask?.id === taskId) {
              set({ currentTask: updatedTask })
            }
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add checklist item'
          set({ error: message })
          throw error
        }
      },

      // Update checklist progress
      updateChecklistProgress: async (taskId: string, itemId: string, completed: boolean) => {
        try {
          set({ error: null })
          await taskService.updateTaskChecklistProgress(taskId, itemId, completed)
          
          // Refresh the task
          const updatedTask = await taskService.getTaskById(taskId)
          if (updatedTask) {
            const tasks = get().tasks.map(t => 
              t.id === taskId ? updatedTask : t
            )
            set({ tasks })
            
            if (get().currentTask?.id === taskId) {
              set({ currentTask: updatedTask })
            }
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update checklist progress'
          set({ error: message })
          throw error
        }
      },

      // Utils
      setCurrentTask: (task: Task | null) => {
        set({ currentTask: task })
      },

      clearError: () => {
        set({ error: null })
      },

      clearTasks: () => {
        set({ 
          tasks: [], 
          currentTask: null, 
          stats: null, 
          searchResults: [] 
        })
      }
    }),
    { name: 'task-store' }
  )
)