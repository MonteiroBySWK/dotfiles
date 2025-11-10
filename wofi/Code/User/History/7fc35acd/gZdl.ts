import { useEffect, useState, useCallback } from 'react'
import { 
  repositories, 
  RepositoryType,
  PaginationResult,
  QueryOptions 
} from '@/repositories'

// Generic hook for repository operations
export function useRepository<T>(repositoryType: RepositoryType) {
  const repository = repositories[repositoryType]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Get all documents
  const getAll = useCallback(async (options?: QueryOptions): Promise<T[]> => {
    setLoading(true)
    setError(null)
    try {
      const result = await repository.getAll(options) as T[]
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [repository])

  // Get paginated documents
  const getPaginated = useCallback(async (
    pageSize: number = 10, 
    options?: QueryOptions
  ): Promise<PaginationResult<T>> => {
    setLoading(true)
    setError(null)
    try {
      const result = await repository.getPaginated(pageSize, options) as PaginationResult<T>
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [repository])

  // Get document by ID
  const getById = useCallback(async (id: string): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await repository.getById(id) as T | null
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [repository])

  // Create document
  const create = useCallback(async (data: unknown): Promise<string> => {
    setLoading(true)
    setError(null)
    try {
      const id = await repository.create(data)
      return id
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [repository])

  // Update document
  const update = useCallback(async (id: string, data: unknown): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await repository.update(id, data)
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [repository])

  // Delete document
  const remove = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await repository.delete(id)
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [repository])

  // Count documents
  const count = useCallback(async (options?: QueryOptions): Promise<number> => {
    setLoading(true)
    setError(null)
    try {
      const result = await repository.count(options)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [repository])

  // Check if document exists
  const exists = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const result = await repository.exists(id)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [repository])

  return {
    loading,
    error,
    getAll,
    getPaginated,
    getById,
    create,
    update,
    remove,
    count,
    exists
  }
}

// Hook for real-time data
export function useRealtimeData<T>(
  repositoryType: RepositoryType,
  options?: QueryOptions
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const repository = repositories[repositoryType]

  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubscribe = repository.onSnapshot(
      (newData) => {
        setData(newData as T[])
        setLoading(false)
      },
      options
    )

    return () => {
      unsubscribe()
    }
  }, [repository, options])

  return { data, loading, error }
}

// Hook for real-time document
export function useRealtimeDocument<T>(
  repositoryType: RepositoryType,
  documentId: string
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const repository = repositories[repositoryType]

  useEffect(() => {
    if (!documentId) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = repository.onDocumentSnapshot(
      documentId,
      (newData) => {
        setData(newData as T | null)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [repository, documentId])

  return { data, loading, error }
}

// Specific hooks for commonly used entities
export const useUsers = () => useRepository('user')
export const useProjects = () => useRepository('project')
export const useTasks = () => useRepository('task')
export const useClients = () => useRepository('client')
export const useNotifications = () => useRepository('notification')
export const useTickets = () => useRepository('ticket')

// Real-time hooks
export const useRealtimeUsers = (options?: QueryOptions) => 
  useRealtimeData('user', options)

export const useRealtimeProjects = (options?: QueryOptions) => 
  useRealtimeData('project', options)

export const useRealtimeTasks = (options?: QueryOptions) => 
  useRealtimeData('task', options)

export const useRealtimeNotifications = (options?: QueryOptions) => 
  useRealtimeData('notification', options)

// Document-specific hooks
export const useUser = (userId: string) => 
  useRealtimeDocument('user', userId)

export const useProject = (projectId: string) => 
  useRealtimeDocument('project', projectId)

export const useTask = (taskId: string) => 
  useRealtimeDocument('task', taskId)