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
