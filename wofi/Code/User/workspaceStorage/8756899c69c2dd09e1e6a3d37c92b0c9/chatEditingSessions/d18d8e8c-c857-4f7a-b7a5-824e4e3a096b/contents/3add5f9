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
  client: string
  project: string
  amount: number
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled"
  dueDate: Date
  createdDate: Date
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

export interface Expense {
  id: string
  description: string
  category: string
  amount: number
  date: Date
  type: "subscription" | "service" | "training" | "equipment" | "travel" | "other"
  receipt?: string
  projectId?: string
  approvedBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface Budget {
  id: string
  name: string
  totalBudget: number
  spent: number
  remaining: number
  progress: number
  status: "on-track" | "under-budget" | "over-budget"
  projectId?: string
  category: string
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  method: "credit-card" | "bank-transfer" | "pix" | "cash" | "check"
  status: "pending" | "completed" | "failed" | "cancelled"
  date: Date
  reference?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface FinancialOverview {
  totalRevenue: number
  monthlyRevenue: number
  pendingInvoices: number
  expenses: number
  profit: number
  growthRate: number
}
