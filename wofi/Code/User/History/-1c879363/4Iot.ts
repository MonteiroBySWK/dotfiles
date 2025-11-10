import { useState, useEffect, useCallback } from 'react'
import { Notification } from '@/types'

// Hook para gerenciar notificações do usuário (versão mockada)
export function useUserNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 500))
    setNotifications([])
    setUnreadCount(0)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = async (notificationId: string) => {
    // Lógica mockada
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    setUnreadCount(prev => (prev > 0 ? prev - 1 : 0))
    return Promise.resolve()
  }

  const markAllAsRead = async () => {
    // Lógica mockada
    setNotifications([])
    setUnreadCount(0)
    return Promise.resolve()
  }

  const deleteNotification = async (notificationId: string) => {
    // Lógica mockada
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    return Promise.resolve()
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

// Hook para notificações não lidas (versão mockada)
export function useUnreadNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      setLoading(true)
      // Simula uma chamada de API
      setTimeout(() => {
        setNotifications([])
        setLoading(false)
      }, 500)
    }
  }, [userId])

  return { notifications, loading, error }
}

// Hook para enviar notificações (versão mockada)
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
    setLoading(true)
    console.log('Mock send notification:', { userId, title, message, type, actionUrl })
    await new Promise(resolve => setTimeout(resolve, 300))
    setLoading(false)
    return 'mock-notification-id'
  }

  const sendBulkNotification = async (
    userIds: string[],
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    actionUrl?: string
  ) => {
    setLoading(true)
    console.log('Mock send bulk notification:', { userIds, title, message, type, actionUrl })
    await new Promise(resolve => setTimeout(resolve, 300))
    setLoading(false)
    return userIds.map((_, i) => `mock-bulk-id-${i}`)
  }

  const sendProjectNotification = async (
    userIds: string[],
    projectName: string,
    action: string,
    type: Notification['type'] = 'info',
    projectId?: string
  ) => {
    setLoading(true)
    console.log('Mock send project notification:', { userIds, projectName, action, type, projectId })
    await new Promise(resolve => setTimeout(resolve, 300))
    setLoading(false)
    return userIds.map((_, i) => `mock-project-notif-id-${i}`)
  }

  const sendTaskNotification = async (
    userIds: string[],
    taskTitle: string,
    action: string,
    type: Notification['type'] = 'info',
    taskId?: string
  ) => {
    setLoading(true)
    console.log('Mock send task notification:', { userIds, taskTitle, action, type, taskId })
    await new Promise(resolve => setTimeout(resolve, 300))
    setLoading(false)
    return userIds.map((_, i) => `mock-task-notif-id-${i}`)
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

// Hook para buscar todas as notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Simulação de API, idealmente seria /api/notifications
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications([]); // Retorna array vazio por enquanto
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, error, refetch: fetchNotifications };
}
