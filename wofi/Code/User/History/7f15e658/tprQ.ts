import { Project } from '@/types'
import { useEffect, useState } from 'react'

export default function useFetchProjetcs():HookData<Project> {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setData([])
  }, [])

  return {
    data,
    error,
    loading,
  }
}