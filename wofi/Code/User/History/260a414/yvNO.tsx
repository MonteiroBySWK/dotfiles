import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { notificationService } from '@/services/NotificationService'
import { Notification } from '@/types'

interface NotificationContextValue {
  notifications: Notification[]
  currentNotification: Notification | null
  stats: any | null
  loading: boolean
  error: string | null

  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  clearNotifications: () => void

  setCurrentNotification: (n: Notification | null) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)
  const [stats, setStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => { try { setLoading(true); setError(null); const res = await notificationService.getNotifications(); setNotifications(res) } catch (err) { setError(String(err)) } finally { setLoading(false) } }, [])

  const markAsRead = useCallback(async (id: string) => { try { setError(null); await notificationService.markAsRead(id); setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)) } catch (err) { setError(String(err)); throw err } }, [])

  const clearNotifications = useCallback(() => setNotifications([]), [])

  const value: NotificationContextValue = { notifications, currentNotification, stats, loading, error, fetchNotifications, markAsRead, clearNotifications, setCurrentNotification }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotification() { const ctx = useContext(NotificationContext); if (!ctx) throw new Error('useNotification must be used within NotificationProvider'); return ctx }

export default NotificationProvider
