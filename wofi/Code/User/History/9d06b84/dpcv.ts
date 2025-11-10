import { useNotification, default as NotificationProvider } from '@/contexts/NotificationContext'

// Compatibility wrapper so existing imports that call `useNotificationStore()` keep working.
export function useNotificationStore() {
  return useNotification()
}

export { NotificationProvider }

export default useNotificationStore