import { useState, useEffect, useCallback } from 'react'
import type { Task } from '@/types'

// Hook para gerenciar tasks
export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const url = projectId 
        ? `/api/tasks?projectId=${projectId}`
        : '/api/tasks'
      
      const res = await fetch(url, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar tasks')
      
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(taskData),
      })
      
      if (!res.ok) throw new Error('Erro ao criar task')
      
      const newTask = await res.json()
      await fetchTasks() // Refresh
      return newTask.id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      setError(null)
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(taskData),
      })
      
      if (!res.ok) throw new Error('Erro ao atualizar task')
      
      await fetchTasks() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      setError(null)
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao deletar task')
      
      await fetchTasks() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const completeTask = async (id: string) => {
    try {
      setError(null)
      const res = await fetch(`/api/tasks/${id}/complete`, {
        method: 'POST',
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao completar task')
      
      await fetchTasks() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete task'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const assignTask = async (taskId: string, assigneeId: string) => {
    try {
      setError(null)
      const res = await fetch(`/api/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ assigneeId }),
      })
      
      if (!res.ok) throw new Error('Erro ao atribuir task')
      
      await fetchTasks() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign task'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    assignTask
  }
}

// Hook para task específica
export function useTask(taskId: string | null) {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTask = useCallback(async () => {
    if (!taskId) return

    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/tasks/${taskId}`, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar task')
      
      const data = await res.json()
      setTask(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task')
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    fetchTask()
  }, [fetchTask])

  return {
    task,
    loading,
    error,
    refetch: fetchTask
  }
}

// Hook para tasks do usuário
export function useMyTasks(userId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/tasks?assignedTo=${userId}`, {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar minhas tasks')
      
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch my tasks')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return { tasks, loading, error }
}

// Hook para estatísticas de tarefas
export function useTaskStats() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/tasks/stats', {
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Erro ao buscar estatísticas')
      
      const data = await res.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error }
}
