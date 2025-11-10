export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  department?: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "paused" | "cancelled"
  progress: number
  startDate: Date
  endDate?: Date
  priority: "low" | "medium" | "high" | "urgent"
  budget?: number
  teamMembers: string[]
  clientId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  assigneeId?: string
  projectId?: string
  dueDate?: Date
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: "bug" | "feature" | "support" | "question"
  assigneeId?: string
  reporterId: string
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  website?: string
  status: "active" | "inactive"
  type: "individual" | "company"
  projects: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Email {
  id: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  content: string
  isRead: boolean
  isStarred: boolean
  folder: "inbox" | "sent" | "drafts" | "trash" | "spam"
  attachments: Attachment[]
  createdAt: Date
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  userId: string
  isRead: boolean
  actionUrl?: string
  createdAt: Date
}

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  totalUsers: number
  activeUsers: number
}

// Form types
export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "textarea" | "select" | "date" | "number" | "checkbox" | "file"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: any
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
