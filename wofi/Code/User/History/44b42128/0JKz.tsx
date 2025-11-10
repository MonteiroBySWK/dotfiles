'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    // Initialize auth listener
    const unsubscribe = initializeAuth()
    
    // Cleanup on unmount
    return unsubscribe
  }, [initializeAuth])

  return <>{children}</>
}