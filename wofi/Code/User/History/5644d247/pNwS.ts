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
