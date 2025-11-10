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
