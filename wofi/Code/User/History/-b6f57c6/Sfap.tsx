import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { taskService } from '@/services/TaskService'
import { Task, TaskComment, ChecklistItem } from '@/types'

interface TaskContextValue {
  tasks: Task[]
  currentTask: Task | null
  stats: any | null
  loading: boolean
  error: string | null
  searchResults: Task[]

  fetchTasks: () => Promise<void>
  fetchTaskById: (id: string) => Promise<Task | null>
  createTask: (data: Omit<Task, 'id'>) => Promise<string>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  addComment: (taskId: string, comment: TaskComment) => Promise<void>
  addChecklistItem: (taskId: string, item: ChecklistItem) => Promise<void>

  setCurrentTask: (t: Task | null) => void
  clearError: () => void
  clearTasks: () => void
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [stats, setStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Task[]>([])

  const fetchTasks = useCallback(async () => { try { setLoading(true); setError(null); const res = await taskService.getTasks(); setTasks(res) } catch (err) { setError(String(err)) } finally { setLoading(false) } }, [])

  const fetchTaskById = useCallback(async (id: string) => { try { setError(null); return await taskService.getTaskById(id) } catch (err) { setError(String(err)); return null } }, [])

  const createTask = useCallback(async (data: Omit<Task, 'id'>) => { try { setError(null); const id = await taskService.createTask(data); await fetchTasks(); return id } catch (err) { setError(String(err)); throw err } }, [fetchTasks])

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => { try { setError(null); await taskService.updateTask(id, data); setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } as Task : t)); if (currentTask?.id === id) setCurrentTask({ ...currentTask, ...data } as Task) } catch (err) { setError(String(err)); throw err } }, [currentTask])

  const deleteTask = useCallback(async (id: string) => { try { setError(null); await taskService.deleteTask(id); setTasks(prev => prev.filter(t => t.id !== id)); if (currentTask?.id === id) setCurrentTask(null) } catch (err) { setError(String(err)); throw err } }, [currentTask])

  const addComment = useCallback(async (taskId: string, comment: TaskComment) => {
    try {
      setError(null)
      // TaskService exposes addTaskComment(taskId, commentString, userId, mentions)
      await taskService.addTaskComment(taskId, comment.content, comment.authorId, comment.mentions || [])
      const t = await taskService.getTaskById(taskId)
      if (t) setTasks(prev => prev.map(p => p.id === taskId ? t : p))
    } catch (err) {
      setError(String(err))
      throw err
    }
  }, [])

  const addChecklistItem = useCallback(async (taskId: string, item: ChecklistItem) => {
    try {
      setError(null)
      // TaskService.addChecklistItem expects (taskId, text, assigneeId?, dueDate?)
      await taskService.addChecklistItem(taskId, item.text, item.assigneeId, item.dueDate)
      const t = await taskService.getTaskById(taskId)
      if (t) setTasks(prev => prev.map(p => p.id === taskId ? t : p))
    } catch (err) {
      setError(String(err))
      throw err
    }
  }, [])

  const value: TaskContextValue = { tasks, currentTask, stats, loading, error, searchResults, fetchTasks, fetchTaskById, createTask, updateTask, deleteTask, addComment, addChecklistItem, setCurrentTask, clearError: () => setError(null), clearTasks: () => { setTasks([]); setCurrentTask(null); setStats(null); setSearchResults([]) } }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTask() { const ctx = useContext(TaskContext); if (!ctx) throw new Error('useTask must be used within TaskProvider'); return ctx }

export default TaskProvider
