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
