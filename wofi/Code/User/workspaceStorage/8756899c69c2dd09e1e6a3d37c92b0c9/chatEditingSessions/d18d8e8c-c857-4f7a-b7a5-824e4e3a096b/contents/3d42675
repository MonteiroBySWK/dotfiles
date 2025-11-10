import { useState, useEffect } from 'react'
import { notificationService } from '@/services'
import { Notification } from '@/types'

// Hook para gerenciar notificações do usuário
export function useUserNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [allNotifications, count] = await Promise.all([
        notificationService.getNotificationsByUser(userId),
        notificationService.getUnreadCountForUser(userId)
      ])
      
      setNotifications(allNotifications)
      setUnreadCount(count)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchNotifications()
    }
  }, [userId])

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId)
      await fetchNotifications() // Refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read')
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsReadForUser(userId)
      await fetchNotifications() // Refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read')
      throw err
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId)
      await fetchNotifications() // Refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification')
      throw err
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}

// Hook para notificações não lidas
export function useUnreadNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await notificationService.getUnreadNotificationsByUser(userId)
        setNotifications(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch unread notifications')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUnreadNotifications()
    }
  }, [userId])

  return { notifications, loading, error }
}

// Hook para enviar notificações
export function useNotificationSender() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendNotification = async (
    userId: string,
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    actionUrl?: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      const id = await notificationService.createNotificationForUser(
        userId,
        title,
        message,
        type,
        actionUrl
      )
      return id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send notification'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const sendBulkNotification = async (
    userIds: string[],
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    actionUrl?: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      const ids = await notificationService.createNotificationForMultipleUsers(
        userIds,
        title,
        message,
        type,
        actionUrl
      )
      return ids
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send bulk notification'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const sendProjectNotification = async (
    userIds: string[],
    projectName: string,
    action: string,
    type: Notification['type'] = 'info',
    projectId?: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      const ids = await notificationService.sendProjectNotification(
        userIds,
        projectName,
        action,
        type,
        projectId
      )
      return ids
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send project notification'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const sendTaskNotification = async (
    userIds: string[],
    taskTitle: string,
    action: string,
    type: Notification['type'] = 'info',
    taskId?: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      const ids = await notificationService.sendTaskNotification(
        userIds,
        taskTitle,
        action,
        type,
        taskId
      )
      return ids
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send task notification'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    sendNotification,
    sendBulkNotification,
    sendProjectNotification,
    sendTaskNotification
  }
}