export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "manager" | "developer" | "designer" | "client" | "viewer"
  department?: string
  position?: string
  phone?: string
  bio?: string
  skills?: string[]
  status: "active" | "inactive" | "pending"
  lastLogin?: Date
  preferences: UserPreferences
  permissions: string[]
  companyId?: string
  teamIds: string[]
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  dashboard: {
    layout: string
    widgets: string[]
  }
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled"
  progress: number
  startDate: Date
  endDate?: Date
  priority: "low" | "medium" | "high" | "urgent"
  budget?: ProjectBudget
  teamMembers: ProjectMember[]
  clientId?: string
  managerId: string
  category: string
  tags: string[]
  repository?: {
    url: string
    platform: "github" | "gitlab" | "bitbucket"
  }
  deployment?: {
    url: string
    status: "pending" | "deployed" | "failed"
  }
  milestones: Milestone[]
  attachments: Attachment[]
  createdAt: Date
  updatedAt: Date
}

export interface ProjectBudget {
  estimated: number
  actual: number
  currency: string
  breakdown: {
    development: number
    design: number
    testing: number
    deployment: number
    other: number
  }
}

export interface ProjectMember {
  userId: string
  role: "lead" | "developer" | "designer" | "tester" | "analyst"
  allocation: number // percentage
  joinedAt: Date
}

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: Date
  status: "pending" | "in-progress" | "completed" | "overdue"
  tasks: string[] // task IDs
  completedAt?: Date
}

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
  totalClients: number
  totalTickets: number
  openTickets: number
  revenue: number
  expenses: number
}

// Additional Firebase-specific types
export interface Company {
  id: string
  name: string
  logo?: string
  website?: string
  industry: string
  size: "startup" | "small" | "medium" | "large" | "enterprise"
  address: Address
  settings: CompanySettings
  subscription: Subscription
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface CompanySettings {
  workingHours: {
    start: string
    end: string
    timezone: string
  }
  workingDays: string[]
  currency: string
  dateFormat: string
  features: string[]
}

export interface Subscription {
  plan: "free" | "starter" | "professional" | "enterprise"
  status: "active" | "cancelled" | "expired" | "trial"
  startDate: Date
  endDate?: Date
  features: string[]
  limits: {
    users: number
    projects: number
    storage: number // in GB
  }
}

export interface Team {
  id: string
  name: string
  description: string
  leaderId: string
  memberIds: string[]
  projectIds: string[]
  avatar?: string
  companyId: string
  settings: TeamSettings
  createdAt: Date
  updatedAt: Date
}

export interface TeamSettings {
  isPrivate: boolean
  canMembersInvite: boolean
  defaultRole: string
  workflowId?: string
}

export interface TimeEntry {
  id: string
  userId: string
  taskId?: string
  projectId?: string
  description: string
  startTime: Date
  endTime?: Date
  duration?: number // in minutes
  billable: boolean
  hourlyRate?: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  number: string
  clientId: string
  projectId?: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  dueDate: Date
  paidAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  taxable: boolean
}

export interface Report {
  id: string
  name: string
  type: "project" | "time" | "financial" | "productivity" | "custom"
  filters: ReportFilters
  data: Record<string, unknown>
  generatedBy: string
  generatedAt: Date
  scheduledAt?: Date
  recipients: string[]
}

export interface ReportFilters {
  dateRange: {
    start: Date
    end: Date
  }
  projectIds?: string[]
  userIds?: string[]
  clientIds?: string[]
  status?: string[]
  tags?: string[]
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  entityType: "project" | "task" | "user" | "client" | "ticket"
  entityId: string
  details: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

export interface FileUpload {
  id: string
  name: string
  originalName: string
  size: number
  type: string
  url: string
  thumbnailUrl?: string
  uploadedBy: string
  entityType?: string
  entityId?: string
  tags: string[]
  createdAt: Date
}

export interface Integration {
  id: string
  name: string
  type: "github" | "gitlab" | "slack" | "trello" | "jira" | "custom"
  status: "connected" | "disconnected" | "error"
  config: Record<string, unknown>
  lastSync?: Date
  companyId: string
  createdAt: Date
  updatedAt: Date
}

// Form types
export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "textarea" | "select" | "date" | "number" | "checkbox" | "file"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: Record<string, unknown>
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
