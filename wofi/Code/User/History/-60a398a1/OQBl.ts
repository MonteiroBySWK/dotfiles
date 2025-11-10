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
