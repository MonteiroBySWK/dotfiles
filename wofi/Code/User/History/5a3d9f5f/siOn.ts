export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  totalUsers: number
  activeUsers: number
  totalClients: number
  totalTickets: number
  openTickets: number
  revenue: number
  expenses: number
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
  attachments: import('./file').Attachment[]
  createdAt: Date
}
