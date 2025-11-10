import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { notificationService } from '@/services/NotificationService'
import { Notification } from '@/types'

interface NotificationStats {
  total: number
  unread: number
  read: number
  byType: Record<string, number>
}

interface NotificationState {
  // Data
  notifications: Notification[]
  currentNotification: Notification | null
  stats: NotificationStats | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchNotifications: () => Promise<void>
  fetchNotificationById: (id: string) => Promise<Notification | null>
  fetchUserNotifications: (userId: string) => Promise<void>
  fetchUnreadNotifications: (userId: string) => Promise<void>
  fetchNotificationsByType: (type: Notification['type']) => Promise<void>
  fetchNotificationStats: (userId: string) => Promise<void>
  
  createNotification: (notificationData: Omit<Notification, 'id'>) => Promise<string>
  updateNotification: (id: string, notificationData: Partial<Notification>) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  
  // Notification management
  markAsRead: (id: string) => Promise<void>
  markAsUnread: (id: string) => Promise<void>
  markAllAsRead: (userId: string) => Promise<void>
  deleteUserNotifications: (userId: string) => Promise<void>
  
  // Utils
  setCurrentNotification: (notification: Notification | null) => void
  clearError: () => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [],
      currentNotification: null,
      stats: null,
      loading: false,
      error: null,

      // Fetch all notifications
      fetchNotifications: async () => {
        try {
          set({ loading: true, error: null })
          const notifications = await notificationService.getNotifications()
          set({ notifications, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch notifications'
          set({ error: message, loading: false })
        }
      },

      // Fetch notification by ID
      fetchNotificationById: async (id: string) => {
        try {
          set({ error: null })
          const notification = await notificationService.getNotificationById(id)
          return notification
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch notification'
          set({ error: message })
          return null
        }
      },

      // Fetch user notifications
      fetchUserNotifications: async (userId: string) => {
        try {
          set({ loading: true, error: null })
          const notifications = await notificationService.getNotificationsByUser(userId)
          set({ notifications, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch user notifications'
          set({ error: message, loading: false })
        }
      },

      // Fetch unread notifications
      fetchUnreadNotifications: async (userId: string) => {
        try {
          set({ loading: true, error: null })
          const notifications = await notificationService.getUnreadNotificationsByUser(userId)
          set({ notifications, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch unread notifications'
          set({ error: message, loading: false })
        }
      },

      // Fetch notifications by type
      fetchNotificationsByType: async (type: Notification['type']) => {
        try {
          set({ loading: true, error: null })
          const notifications = await notificationService.getNotificationsByType(type)
          set({ notifications, loading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch notifications by type'
          set({ error: message, loading: false })
        }
      },

      // Fetch notification stats
      fetchNotificationStats: async (userId: string) => {
        try {
          set({ error: null })
          const stats = await notificationService.getStatsForUser(userId)
          set({ stats })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch notification stats'
          set({ error: message })
        }
      },

      // Create notification
      createNotification: async (notificationData: Omit<Notification, 'id'>) => {
        try {
          set({ error: null })
          const id = await notificationService.createNotification(notificationData)
          
          // Refresh notifications list
          await get().fetchNotifications()
          
          return id
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create notification'
          set({ error: message })
          throw error
        }
      },

      // Update notification
      updateNotification: async (id: string, notificationData: Partial<Notification>) => {
        try {
          set({ error: null })
          await notificationService.updateNotification(id, notificationData)
          
          // Update local state
          const notifications = get().notifications.map(notification => 
            notification.id === id ? { ...notification, ...notificationData } : notification
          )
          set({ notifications })
          
          // Update current notification if it's the same
          const currentNotification = get().currentNotification
          if (currentNotification && currentNotification.id === id) {
            set({ currentNotification: { ...currentNotification, ...notificationData } })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update notification'
          set({ error: message })
          throw error
        }
      },

      // Delete notification
      deleteNotification: async (id: string) => {
        try {
          set({ error: null })
          await notificationService.deleteNotification(id)
          
          // Remove from local state
          const notifications = get().notifications.filter(notification => notification.id !== id)
          set({ notifications })
          
          // Clear current notification if it's the deleted one
          const currentNotification = get().currentNotification
          if (currentNotification && currentNotification.id === id) {
            set({ currentNotification: null })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete notification'
          set({ error: message })
          throw error
        }
      },

      // Mark as read
      markAsRead: async (id: string) => {
        try {
          set({ error: null })
          await notificationService.markAsRead(id)
          
          // Update local state
          const notifications = get().notifications.map(notification => 
            notification.id === id ? { ...notification, isRead: true } : notification
          )
          set({ notifications })
          
          // Update current notification if it's the same
          const currentNotification = get().currentNotification
          if (currentNotification && currentNotification.id === id) {
            set({ currentNotification: { ...currentNotification, isRead: true } })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to mark notification as read'
          set({ error: message })
          throw error
        }
      },

      // Mark as unread
      markAsUnread: async (id: string) => {
        try {
          set({ error: null })
          await notificationService.markAsUnread(id)
          
          // Update local state
          const notifications = get().notifications.map(notification => 
            notification.id === id ? { ...notification, isRead: false } : notification
          )
          set({ notifications })
          
          // Update current notification if it's the same
          const currentNotification = get().currentNotification
          if (currentNotification && currentNotification.id === id) {
            set({ currentNotification: { ...currentNotification, isRead: false } })
          }
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to mark notification as unread'
          set({ error: message })
          throw error
        }
      },

      // Mark all as read
      markAllAsRead: async (userId: string) => {
        try {
          set({ error: null })
          await notificationService.markAllAsRead(userId)
          
          // Update local state
          const notifications = get().notifications.map(notification => 
            notification.userId === userId ? { ...notification, isRead: true } : notification
          )
          set({ notifications })
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to mark all notifications as read'
          set({ error: message })
          throw error
        }
      },

      // Delete user notifications
      deleteUserNotifications: async (userId: string) => {
        try {
          set({ error: null })
          await notificationService.deleteUserNotifications(userId)
          
          // Remove from local state
          const notifications = get().notifications.filter(notification => notification.userId !== userId)
          set({ notifications })
          
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete user notifications'
          set({ error: message })
          throw error
        }
      },

      // Utils
      setCurrentNotification: (notification: Notification | null) => {
        set({ currentNotification: notification })
      },

      clearError: () => {
        set({ error: null })
      },

      clearNotifications: () => {
        set({ 
          notifications: [], 
          currentNotification: null, 
          stats: null
        })
      }
    }),
    { name: 'notification-store' }
  )
)