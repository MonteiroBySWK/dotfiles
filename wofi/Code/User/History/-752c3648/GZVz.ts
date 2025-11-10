import { BaseRepository } from './base.repository'
import { Notification } from '@/types'
import { WhereFilterOp } from 'firebase/firestore'

export class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super('notifications')
  }

  // Get notifications by user
  async getByUser(userId: string): Promise<Notification[]> {
    return this.getAll({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    })
  }

  // Get unread notifications by user
  async getUnreadByUser(userId: string): Promise<Notification[]> {
    return this.getAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'isRead', operator: '==', value: false }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    })
  }

  // Get notifications by type
  async getByType(type: Notification['type'], userId?: string): Promise<Notification[]> {
    const whereClause: Array<{ field: string; operator: WhereFilterOp; value: unknown }> = [
      { field: 'type', operator: '==', value: type }
    ]
    
    if (userId) {
      whereClause.push({ field: 'userId', operator: '==', value: userId })
    }

    return this.getAll({
      where: whereClause,
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    })
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await this.update(notificationId, { isRead: true })
  }

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    const promises = notificationIds.map(id => this.markAsRead(id))
    await Promise.all(promises)
  }

  // Mark all user notifications as read
  async markAllAsReadForUser(userId: string): Promise<void> {
    const unreadNotifications = await this.getUnreadByUser(userId)
    const promises = unreadNotifications.map(notification => 
      this.markAsRead(notification.id)
    )
    await Promise.all(promises)
  }

  // Get notification count for user
  async getUnreadCountForUser(userId: string): Promise<number> {
    return this.count({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'isRead', operator: '==', value: false }
      ]
    })
  }

  // Create notification for user
  async createForUser(
    userId: string,
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    actionUrl?: string
  ): Promise<string> {
    return this.create({
      title,
      message,
      type,
      userId,
      isRead: false,
      actionUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  // Create notification for multiple users
  async createForMultipleUsers(
    userIds: string[],
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    actionUrl?: string
  ): Promise<string[]> {
    const promises = userIds.map(userId => 
      this.createForUser(userId, title, message, type, actionUrl)
    )
    return Promise.all(promises)
  }

  // Delete old notifications (older than specified days)
  async deleteOldNotifications(days: number = 30): Promise<void> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const oldNotifications = await this.getAll({
      where: [{ field: 'createdAt', operator: '<', value: cutoffDate }]
    })

    const promises = oldNotifications.map(notification => 
      this.delete(notification.id)
    )
    
    await Promise.all(promises)
  }

  // Get notification statistics for user
  async getStatsForUser(userId: string): Promise<{
    total: number
    unread: number
    read: number
    byType: Record<string, number>
  }> {
    const notifications = await this.getByUser(userId)

    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      read: notifications.filter(n => n.isRead).length,
      byType: {} as Record<string, number>
    }

    notifications.forEach(notification => {
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1
    })

    return stats
  }
}