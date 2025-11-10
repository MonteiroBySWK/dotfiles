import { notificationRepository } from '@/repositories'
import { Notification } from '@/types'

export class NotificationService {
  private repository = notificationRepository

  // Get all notifications
  async getNotifications(): Promise<Notification[]> {
    return this.repository.findAll()
  }

  // Get notification by ID
  async getNotificationById(id: string): Promise<Notification | null> {
    return this.repository.getById(id)
  }

  // Get notifications by user
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.repository.getByUser(userId)
  }

  // Get unread notifications by user
  async getUnreadNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.repository.getUnreadByUser(userId)
  }

  // Get notifications by type
  async getNotificationsByType(type: Notification['type'], userId?: string): Promise<Notification[]> {
    return this.repository.getByType(type, userId)
  }

  // Create notification
  async createNotification(notificationData: Omit<Notification, 'id'>): Promise<string> {
    return this.repository.create(notificationData)
  }

  // Create notification for user
  async createNotificationForUser(
    userId: string,
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    actionUrl?: string
  ): Promise<string> {
    return this.repository.createForUser(userId, title, message, type, actionUrl)
  }

  // Create notification for multiple users
  async createNotificationForMultipleUsers(
    userIds: string[],
    title: string,
    message: string,
    type: Notification['type'] = 'info',
    actionUrl?: string
  ): Promise<string[]> {
    return this.repository.createForMultipleUsers(userIds, title, message, type, actionUrl)
  }

  // Update notification
  async updateNotification(id: string, notificationData: Partial<Notification>): Promise<void> {
    return this.repository.update(id, notificationData)
  }

  // Delete notification
  async deleteNotification(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    return this.repository.markAsRead(notificationId)
  }

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    return this.repository.markMultipleAsRead(notificationIds)
  }

  // Mark all user notifications as read
  async markAllAsReadForUser(userId: string): Promise<void> {
    return this.repository.markAllAsReadForUser(userId)
  }

  // Get unread count for user
  async getUnreadCountForUser(userId: string): Promise<number> {
    return this.repository.getUnreadCountForUser(userId)
  }

  // Delete old notifications
  async deleteOldNotifications(days: number = 30): Promise<void> {
    return this.repository.deleteOldNotifications(days)
  }

  // Get notification statistics for user
  async getStatsForUser(userId: string) {
    return this.repository.getStatsForUser(userId)
  }

  // Send system notification
  async sendSystemNotification(
    userIds: string[],
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<string[]> {
    return this.createNotificationForMultipleUsers(userIds, title, message, 'info', actionUrl)
  }

  // Send success notification
  async sendSuccessNotification(
    userId: string,
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<string> {
    return this.createNotificationForUser(userId, title, message, 'success', actionUrl)
  }

  // Send warning notification
  async sendWarningNotification(
    userId: string,
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<string> {
    return this.createNotificationForUser(userId, title, message, 'warning', actionUrl)
  }

  // Send error notification
  async sendErrorNotification(
    userId: string,
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<string> {
    return this.createNotificationForUser(userId, title, message, 'error', actionUrl)
  }

  // Send project-related notifications
  async sendProjectNotification(
    userIds: string[],
    projectName: string,
    action: string,
    type: Notification['type'] = 'info',
    projectId?: string
  ): Promise<string[]> {
    const title = `Project Update: ${projectName}`
    const message = `${action} for project ${projectName}`
    const actionUrl = projectId ? `/projects/${projectId}` : undefined

    return this.createNotificationForMultipleUsers(userIds, title, message, type, actionUrl)
  }

  // Send task-related notifications
  async sendTaskNotification(
    userIds: string[],
    taskTitle: string,
    action: string,
    type: Notification['type'] = 'info',
    taskId?: string
  ): Promise<string[]> {
    const title = `Task Update: ${taskTitle}`
    const message = `${action} for task ${taskTitle}`
    const actionUrl = taskId ? `/tasks/${taskId}` : undefined

    return this.createNotificationForMultipleUsers(userIds, title, message, type, actionUrl)
  }

  // Send assignment notification
  async sendAssignmentNotification(
    assigneeId: string,
    itemType: 'task' | 'project',
    itemTitle: string,
    itemId?: string
  ): Promise<string> {
    const title = `New ${itemType} assigned`
    const message = `You have been assigned to ${itemType}: ${itemTitle}`
    const actionUrl = itemId ? `/${itemType}s/${itemId}` : undefined

    return this.createNotificationForUser(assigneeId, title, message, 'info', actionUrl)
  }

  // Send deadline reminder notifications
  async sendDeadlineReminders(
    userIds: string[],
    itemType: 'task' | 'project',
    itemTitle: string,
    dueDate: Date,
    itemId?: string
  ): Promise<string[]> {
    const today = new Date()
    const timeDiff = dueDate.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    let message: string
    let type: Notification['type'] = 'info'

    if (daysDiff < 0) {
      message = `${itemTitle} is overdue by ${Math.abs(daysDiff)} day(s)`
      type = 'error'
    } else if (daysDiff === 0) {
      message = `${itemTitle} is due today`
      type = 'warning'
    } else if (daysDiff <= 3) {
      message = `${itemTitle} is due in ${daysDiff} day(s)`
      type = 'warning'
    } else {
      message = `${itemTitle} is due in ${daysDiff} day(s)`
      type = 'info'
    }

    const title = `${itemType} Deadline Reminder`
    const actionUrl = itemId ? `/${itemType}s/${itemId}` : undefined

    return this.createNotificationForMultipleUsers(userIds, title, message, type, actionUrl)
  }

  // Get recent notifications for user
  async getRecentNotificationsForUser(userId: string, limit: number = 10): Promise<Notification[]> {
    const notifications = await this.getNotificationsByUser(userId)
    return notifications.slice(0, limit)
  }

  // Search notifications
  async searchNotifications(userId: string, query: string): Promise<Notification[]> {
    const notifications = await this.getNotificationsByUser(userId)
    const lowercaseQuery = query.toLowerCase()
    
    return notifications.filter(notification =>
      notification.title.toLowerCase().includes(lowercaseQuery) ||
      notification.message.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Check if notification exists
  async notificationExists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  // Get notifications summary for user
  async getNotificationsSummary(userId: string) {
    const [recentNotifications, unreadNotifications, stats] = await Promise.all([
      this.getRecentNotificationsForUser(userId),
      this.getUnreadNotificationsByUser(userId),
      this.getStatsForUser(userId)
    ])

    return {
      recentNotifications,
      unreadNotifications,
      stats
    }
  }

  // Clean up old read notifications
  async cleanupOldReadNotifications(userId: string, days: number = 30): Promise<void> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const notifications = await this.getNotificationsByUser(userId)
    const oldReadNotifications = notifications.filter(notification => 
      notification.isRead && 
      notification.createdAt < cutoffDate
    )

    const deletePromises = oldReadNotifications.map(notification => 
      this.deleteNotification(notification.id)
    )
    
    await Promise.all(deletePromises)
  }
}

// Export singleton instance
export const notificationService = new NotificationService()