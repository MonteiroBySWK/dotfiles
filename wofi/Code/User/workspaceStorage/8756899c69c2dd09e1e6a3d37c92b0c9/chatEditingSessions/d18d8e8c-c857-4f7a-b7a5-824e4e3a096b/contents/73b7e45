import type { Attachment } from './file'

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "testing" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  assigneeId?: string
  reporterId: string
  projectId?: string
  milestoneId?: string
  parentTaskId?: string // for subtasks
  dueDate?: Date
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  labels: TaskLabel[]
  comments: TaskComment[]
  attachments: Attachment[]
  checklist: ChecklistItem[]
  dependencies: string[] // task IDs that must be completed first
  watchers: string[] // user IDs watching this task
  customFields: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface TaskLabel {
  id: string
  name: string
  color: string
}

export interface TaskComment {
  id: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt?: Date
  mentions: string[] // user IDs mentioned
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  assigneeId?: string
  dueDate?: Date
}
