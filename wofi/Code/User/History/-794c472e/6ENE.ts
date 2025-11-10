import { BaseRepository } from './base.repository'
import { Task, TaskComment, ChecklistItem, TaskLabel } from '@/types'

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super('tasks')
  }

  // Get tasks by status
  async getByStatus(status: Task['status']): Promise<Task[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: status }],
      orderBy: [{ field: 'updatedAt', direction: 'desc' }]
    })
  }

  // Get tasks by assignee
  async getByAssignee(assigneeId: string): Promise<Task[]> {
    return this.getAll({
      where: [{ field: 'assigneeId', operator: '==', value: assigneeId }],
      orderBy: [{ field: 'dueDate', direction: 'asc' }]
    })
  }

  // Get tasks by project
  async getByProject(projectId: string): Promise<Task[]> {
    return this.getAll({
      where: [{ field: 'projectId', operator: '==', value: projectId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    })
  }

  // Get tasks by milestone
  async getByMilestone(milestoneId: string): Promise<Task[]> {
    return this.getAll({
      where: [{ field: 'milestoneId', operator: '==', value: milestoneId }],
      orderBy: [{ field: 'priority', direction: 'desc' }]
    })
  }

  // Get subtasks
  async getSubtasks(parentTaskId: string): Promise<Task[]> {
    return this.getAll({
      where: [{ field: 'parentTaskId', operator: '==', value: parentTaskId }],
      orderBy: [{ field: 'createdAt', direction: 'asc' }]
    })
  }

  // Get overdue tasks
  async getOverdueTasks(): Promise<Task[]> {
    const now = new Date()
    const tasks = await this.getAll({
      where: [
        { field: 'status', operator: '!=', value: 'completed' },
        { field: 'status', operator: '!=', value: 'cancelled' }
      ]
    })

    return tasks.filter(task => 
      task.dueDate && task.dueDate < now
    )
  }

  // Get tasks due soon (within specified days)
  async getTasksDueSoon(days: number = 3): Promise<Task[]> {
    const now = new Date()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() + days)

    const tasks = await this.getAll({
      where: [
        { field: 'status', operator: '!=', value: 'completed' },
        { field: 'status', operator: '!=', value: 'cancelled' }
      ]
    })

    return tasks.filter(task => 
      task.dueDate && 
      task.dueDate >= now &&
      task.dueDate <= cutoffDate
    )
  }

  // Update task status
  async updateStatus(taskId: string, status: Task['status']): Promise<void> {
    const updateData: Record<string, unknown> = { status }
    
    if (status === 'completed') {
      updateData.completedAt = new Date()
    }

    await this.update(taskId, updateData)
  }

  // Add comment to task
  async addComment(taskId: string, comment: Omit<TaskComment, 'id' | 'createdAt'>): Promise<void> {
    const task = await this.getById(taskId)
    if (!task) throw new Error('Task not found')

    const newComment: TaskComment = {
      id: `comment_${Date.now()}`,
      ...comment,
      createdAt: new Date()
    }

    const updatedComments = [...task.comments, newComment]
    await this.update(taskId, { comments: updatedComments })
  }

  // Update comment
  async updateComment(taskId: string, commentId: string, content: string): Promise<void> {
    const task = await this.getById(taskId)
    if (!task) throw new Error('Task not found')

    const updatedComments = task.comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, content, updatedAt: new Date() }
        : comment
    )

    await this.update(taskId, { comments: updatedComments })
  }

  // Delete comment
  async deleteComment(taskId: string, commentId: string): Promise<void> {
    const task = await this.getById(taskId)
    if (!task) throw new Error('Task not found')

    const updatedComments = task.comments.filter(comment => comment.id !== commentId)
    await this.update(taskId, { comments: updatedComments })
  }

  // Add checklist item
  async addChecklistItem(taskId: string, item: Omit<ChecklistItem, 'id'>): Promise<void> {
    const task = await this.getById(taskId)
    if (!task) throw new Error('Task not found')

    const newItem: ChecklistItem = {
      id: `checklist_${Date.now()}`,
      ...item
    }

    const updatedChecklist = [...task.checklist, newItem]
    await this.update(taskId, { checklist: updatedChecklist })
  }

  // Update checklist item
  async updateChecklistItem(
    taskId: string, 
    itemId: string, 
    updates: Partial<Omit<ChecklistItem, 'id'>>
  ): Promise<void> {
    const task = await this.getById(taskId)
    if (!task) throw new Error('Task not found')

    const updatedChecklist = task.checklist.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    )

    await this.update(taskId, { checklist: updatedChecklist })
  }

  // Delete checklist item
  async deleteChecklistItem(taskId: string, itemId: string): Promise<void> {
    const task = await this.getById(taskId)
    if (!task) throw new Error('Task not found')

    const updatedChecklist = task.checklist.filter(item => item.id !== itemId)
    await this.update(taskId, { checklist: updatedChecklist })
  }

  // Add watcher
  async addWatcher(taskId: string, userId: string): Promise<void> {
    const task = await this.getById(taskId)
    if (!task) throw new Error('Task not found')

    if (!task.watchers.includes(userId)) {
      const updatedWatchers = [...task.watchers, userId]
      await this.update(taskId, { watchers: updatedWatchers })
    }
  }

  // Remove watcher
  async removeWatcher(taskId: string, userId: string): Promise<void> {
    const task = await this.getById(taskId)
    if (!task) throw new Error('Task not found')

    const updatedWatchers = task.watchers.filter(watcherId => watcherId !== userId)
    await this.update(taskId, { watchers: updatedWatchers })
  }

  // Update estimated hours
  async updateEstimatedHours(taskId: string, hours: number): Promise<void> {
    await this.update(taskId, { estimatedHours: hours })
  }

  // Log actual hours
  async logActualHours(taskId: string, hours: number): Promise<void> {
    const task = await this.getById(taskId)
    if (!task) throw new Error('Task not found')

    const currentHours = task.actualHours || 0
    await this.update(taskId, { actualHours: currentHours + hours })
  }

  // Get task statistics
  async getStats(filters?: { projectId?: string; assigneeId?: string }): Promise<{
    total: number
    todo: number
    inProgress: number
    review: number
    testing: number
    completed: number
    cancelled: number
    overdue: number
    dueSoon: number
    byPriority: Record<string, number>
    byStatus: Record<string, number>
  }> {
    let whereClause: any[] = []
    
    if (filters?.projectId) {
      whereClause.push({ field: 'projectId', operator: '==', value: filters.projectId })
    }
    
    if (filters?.assigneeId) {
      whereClause.push({ field: 'assigneeId', operator: '==', value: filters.assigneeId })
    }

    const tasks = await this.getAll({ where: whereClause })
    const now = new Date()
    const soonDate = new Date()
    soonDate.setDate(soonDate.getDate() + 3)

    const stats = {
      total: tasks.length,
      todo: 0,
      inProgress: 0,
      review: 0,
      testing: 0,
      completed: 0,
      cancelled: 0,
      overdue: 0,
      dueSoon: 0,
      byPriority: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    }

    tasks.forEach(task => {
      // Count by status
      stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1
      stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1

      switch (task.status) {
        case 'todo':
          stats.todo++
          break
        case 'in-progress':
          stats.inProgress++
          break
        case 'review':
          stats.review++
          break
        case 'testing':
          stats.testing++
          break
        case 'completed':
          stats.completed++
          break
        case 'cancelled':
          stats.cancelled++
          break
      }

      // Check if overdue
      if (task.dueDate && task.dueDate < now && task.status !== 'completed' && task.status !== 'cancelled') {
        stats.overdue++
      }

      // Check if due soon
      if (task.dueDate && task.dueDate >= now && task.dueDate <= soonDate && task.status !== 'completed' && task.status !== 'cancelled') {
        stats.dueSoon++
      }
    })

    return stats
  }

  // Search tasks
  async search(searchTerm: string, filters?: { projectId?: string; assigneeId?: string }): Promise<Task[]> {
    let whereClause: any[] = []
    
    if (filters?.projectId) {
      whereClause.push({ field: 'projectId', operator: '==', value: filters.projectId })
    }
    
    if (filters?.assigneeId) {
      whereClause.push({ field: 'assigneeId', operator: '==', value: filters.assigneeId })
    }

    const tasks = await this.getAll({ where: whereClause })
    const searchLower = searchTerm.toLowerCase()

    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Get my tasks (for current user)
  async getMyTasks(userId: string): Promise<{
    assigned: Task[]
    watching: Task[]
    created: Task[]
  }> {
    const [assigned, allTasks] = await Promise.all([
      this.getByAssignee(userId),
      this.getAll({ where: [{ field: 'reporterId', operator: '==', value: userId }] })
    ])

    const watching = allTasks.filter(task => 
      task.watchers.includes(userId) && task.assigneeId !== userId
    )

    const created = allTasks

    return { assigned, watching, created }
  }
}