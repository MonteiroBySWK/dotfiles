import { taskRepository } from '@/repositories'
import { Task } from '@/types'

export class TaskService {
  private repository = taskRepository

  // Get all tasks
  async getTasks(): Promise<Task[]> {
    return this.repository.findAll()
  }

  // Get task by ID
  async getTaskById(id: string): Promise<Task | null> {
    return this.repository.getById(id)
  }

  // Get tasks by project
  async getTasksByProject(projectId: string): Promise<Task[]> {
    return this.repository.getAll({
      where: [{ field: 'projectId', operator: '==', value: projectId }]
    })
  }

  // Get tasks by assignee
  async getTasksByAssignee(assigneeId: string): Promise<Task[]> {
    return this.repository.getAll({
      where: [{ field: 'assigneeId', operator: '==', value: assigneeId }]
    })
  }

  // Get tasks by status
  async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    return this.repository.getAll({
      where: [{ field: 'status', operator: '==', value: status }]
    })
  }

  // Get tasks by priority
  async getTasksByPriority(priority: Task['priority']): Promise<Task[]> {
    return this.repository.getAll({
      where: [{ field: 'priority', operator: '==', value: priority }]
    })
  }

  // Create task
  async createTask(taskData: Omit<Task, 'id'>): Promise<string> {
    return this.repository.create(taskData)
  }

  // Update task
  async updateTask(id: string, taskData: Partial<Task>): Promise<void> {
    return this.repository.update(id, {
      ...taskData,
      updatedAt: new Date()
    })
  }

  // Delete task
  async deleteTask(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  // Update task status
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const updateData: Partial<Task> = { status }

    // Set completion date if marking as completed
    if (status === 'completed') {
      updateData.completedAt = new Date()
    }

    return this.updateTask(taskId, updateData)
  }

  // Complete task
  async completeTask(taskId: string): Promise<void> {
    return this.updateTaskStatus(taskId, 'completed')
  }

  // Start task
  async startTask(taskId: string): Promise<void> {
    return this.updateTaskStatus(taskId, 'in-progress')
  }

  // Assign task
  async assignTask(taskId: string, assigneeId: string): Promise<void> {
    return this.updateTask(taskId, { assigneeId })
  }

  // Update task priority
  async updateTaskPriority(taskId: string, priority: Task['priority']): Promise<void> {
    return this.updateTask(taskId, { priority })
  }

  // Update task due date
  async updateTaskDueDate(taskId: string, dueDate: Date): Promise<void> {
    return this.updateTask(taskId, { dueDate })
  }

  // Update task estimation
  async updateTaskEstimation(taskId: string, estimatedHours: number): Promise<void> {
    if (estimatedHours < 0) {
      throw new Error('Estimated hours cannot be negative')
    }
    return this.updateTask(taskId, { estimatedHours })
  }

  // Update task checklist progress (since Task doesn't have progress field)
  async updateTaskChecklistProgress(taskId: string, checklistItemId: string, completed: boolean): Promise<void> {
    const task = await this.getTaskById(taskId)
    if (!task) {
      throw new Error('Task not found')
    }

    const updatedChecklist = task.checklist.map(item => 
      item.id === checklistItemId ? { ...item, completed } : item
    )

    const updateData: Partial<Task> = { checklist: updatedChecklist }
    
    // Check if all checklist items are completed to auto-complete task
    const allCompleted = updatedChecklist.every(item => item.completed)
    if (allCompleted && updatedChecklist.length > 0) {
      updateData.status = 'completed'
      updateData.completedAt = new Date()
    }

    return this.updateTask(taskId, updateData)
  }

  // Get overdue tasks
  async getOverdueTasks(): Promise<Task[]> {
    const tasks = await this.getTasks()
    const now = new Date()
    
    return tasks.filter(task => 
      task.dueDate && 
      task.dueDate < now && 
      task.status !== 'completed'
    )
  }

  // Get tasks due today
  async getTasksDueToday(): Promise<Task[]> {
    const tasks = await this.getTasks()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return tasks.filter(task => 
      task.dueDate && 
      task.dueDate >= today && 
      task.dueDate < tomorrow &&
      task.status !== 'completed'
    )
  }

  // Get my tasks (for current user)
  async getMyTasks(userId: string): Promise<Task[]> {
    return this.getTasksByAssignee(userId)
  }

  // Get my pending tasks
  async getMyPendingTasks(userId: string): Promise<Task[]> {
    return this.repository.getAll({
      where: [
        { field: 'assigneeId', operator: '==', value: userId },
        { field: 'status', operator: '!=', value: 'completed' }
      ]
    })
  }

  // Get task statistics
  async getTaskStats(): Promise<{
    total: number
    todo: number
    inProgress: number
    completed: number
    overdue: number
    dueToday: number
    byPriority: Record<string, number>
  }> {
    const [tasks, overdueTasks, tasksDueToday] = await Promise.all([
      this.getTasks(),
      this.getOverdueTasks(),
      this.getTasksDueToday()
    ])

    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: overdueTasks.length,
      dueToday: tasksDueToday.length,
      byPriority: {} as Record<string, number>
    }

    tasks.forEach(task => {
      stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1
    })

    return stats
  }

  // Get tasks by date range
  async getTasksByDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    const tasks = await this.getTasks()
    
    return tasks.filter(task => {
      if (!task.dueDate) return false
      return task.dueDate >= startDate && task.dueDate <= endDate
    })
  }

  // Search tasks
  async searchTasks(query: string): Promise<Task[]> {
    const tasks = await this.getTasks()
    const lowercaseQuery = query.toLowerCase()
    
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description?.toLowerCase().includes(lowercaseQuery) ||
      task.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  // Get high priority tasks
  async getHighPriorityTasks(): Promise<Task[]> {
    return this.getTasksByPriority('high')
  }

  // Get urgent tasks
  async getUrgentTasks(): Promise<Task[]> {
    return this.getTasksByPriority('urgent')
  }

  // Check if task exists
  async taskExists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  // Get tasks summary for dashboard
  async getTasksSummary() {
    const [recentTasks, myTasks, overdueTasks, stats] = await Promise.all([
      this.repository.getAll({ 
        orderBy: [{ field: 'createdAt', direction: 'desc' }], 
        limit: 5 
      }),
      this.getTasksByStatus('in-progress'),
      this.getOverdueTasks(),
      this.getTaskStats()
    ])

    return {
      recentTasks,
      activeTasks: myTasks,
      overdueTasks,
      stats
    }
  }

  // Add comment to task
  async addTaskComment(taskId: string, comment: string, userId: string, mentions: string[] = []): Promise<void> {
    const task = await this.getTaskById(taskId)
    if (!task) {
      throw new Error('Task not found')
    }

    const newComment = {
      id: Date.now().toString(),
      content: comment,
      authorId: userId,
      createdAt: new Date(),
      mentions
    }

    const updatedComments = [...(task.comments || []), newComment]
    return this.updateTask(taskId, { comments: updatedComments })
  }

  // Update actual hours spent on task
  async updateActualHours(taskId: string, actualHours: number): Promise<void> {
    if (actualHours < 0) {
      throw new Error('Actual hours cannot be negative')
    }

    return this.updateTask(taskId, { actualHours })
  }

  // Add checklist item to task
  async addChecklistItem(taskId: string, text: string, assigneeId?: string, dueDate?: Date): Promise<void> {
    const task = await this.getTaskById(taskId)
    if (!task) {
      throw new Error('Task not found')
    }

    const newItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      assigneeId,
      dueDate
    }

    const updatedChecklist = [...(task.checklist || []), newItem]
    return this.updateTask(taskId, { checklist: updatedChecklist })
  }
}

// Export singleton instance
export const taskService = new TaskService()