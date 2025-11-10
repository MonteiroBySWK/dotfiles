import { BaseRepository, QueryFilter } from './base.repository'
import { Task, TaskComment, ChecklistItem } from '@/types'

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super('tasks')
  }

  async findByProject(projectId: string): Promise<Task[]> {
    const filter: QueryFilter = { field: 'projectId', operator: '==', value: projectId }
    return this.findWhere([filter])
  }

  async findByAssignee(assigneeId: string): Promise<Task[]> {
    const filter: QueryFilter = { field: 'assigneeId', operator: '==', value: assigneeId }
    return this.findWhere([filter])
  }

  async findByStatus(status: Task['status']): Promise<Task[]> {
    const filter: QueryFilter = { field: 'status', operator: '==', value: status }
    return this.findWhere([filter])
  }

  async updateStatus(taskId: string, status: Task['status']): Promise<void> {
    const updateData: Record<string, unknown> = { status }
    
    if (status === 'completed') {
      updateData.completedAt = new Date()
    }

    await this.update(taskId, updateData)
  }

  async addComment(taskId: string, comment: TaskComment): Promise<void> {
    const task = await this.findById(taskId)
    if (task) {
      const updatedComments = [...task.comments, comment]
      await this.update(taskId, { 
        comments: updatedComments,
        updatedAt: new Date()
      })
    }
  }
}
