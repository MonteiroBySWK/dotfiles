import { useUser, default as UserProvider } from '@/contexts/UserContext'

// Compatibility wrapper so existing imports (useUserStore) keep working.
export function useUserStore() {
  return useUser()
}

export { UserProvider }