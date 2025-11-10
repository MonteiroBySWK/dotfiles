import { useState, useEffect } from 'react'
import { taskService } from '@/services'
import { Task } from '@/types'

// Hook para gerenciar tarefas
export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      let data: Task[]
      
      if (projectId) {
        data = await taskService.getTasksByProject(projectId)
      } else {
        data = await taskService.getTasks()
      }
      
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const createTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const id = await taskService.createTask(taskData)
      await fetchTasks() // Refresh the list
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      throw err
    }
  }

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      await taskService.updateTask(id, taskData)
      await fetchTasks() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id)
      await fetchTasks() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      throw err
    }
  }

  const completeTask = async (id: string) => {
    try {
      await taskService.completeTask(id)
      await fetchTasks() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task')
      throw err
    }
  }

  const assignTask = async (taskId: string, assigneeId: string) => {
    try {
      await taskService.assignTask(taskId, assigneeId)
      await fetchTasks() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign task')
      throw err
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

// Hook para uma tarefa específica
export function useTask(taskId: string) {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTask = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskService.getTaskById(taskId)
      setTask(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (taskId) {
      fetchTask()
    }
  }, [taskId])

  return {
    task,
    loading,
    error,
    refetch: fetchTask
  }
}

// Hook para tarefas do usuário
export function useMyTasks(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await taskService.getMyTasks(userId)
        setTasks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch my tasks')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchMyTasks()
    }
  }, [userId])

  return { tasks, loading, error }
}

// Hook para estatísticas de tarefas
export function useTaskStats() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await taskService.getTaskStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}