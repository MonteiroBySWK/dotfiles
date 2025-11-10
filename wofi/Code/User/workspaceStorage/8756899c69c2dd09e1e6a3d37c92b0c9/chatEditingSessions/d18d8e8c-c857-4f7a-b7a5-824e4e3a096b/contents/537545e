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
