import type { Address, CompanySettings, Subscription } from './company.helpers'

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
