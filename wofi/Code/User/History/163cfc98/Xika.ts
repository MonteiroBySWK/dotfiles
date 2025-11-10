import { BaseRepository } from './base.repository'
import { User, UserPreferences } from '@/types'
import { query, where, orderBy } from 'firebase/firestore'

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users')
  }

  // Get user by email
  async getByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAll({
        where: [{ field: 'email', operator: '==', value: email }],
        limit: 1
      })
      return users.length > 0 ? users[0] : null
    } catch (error) {
      console.error('Error getting user by email:', error)
      throw error
    }
  }

  // Get users by role
  async getByRole(role: string): Promise<User[]> {
    return this.getAll({
      where: [{ field: 'role', operator: '==', value: role }],
      orderBy: [{ field: 'name', direction: 'asc' }]
    })
  }

  // Get users by company
  async getByCompany(companyId: string): Promise<User[]> {
    return this.getAll({
      where: [{ field: 'companyId', operator: '==', value: companyId }],
      orderBy: [{ field: 'name', direction: 'asc' }]
    })
  }

  // Get users by team
  async getByTeam(teamId: string): Promise<User[]> {
    return this.getAll({
      where: [{ field: 'teamIds', operator: 'array-contains', value: teamId }],
      orderBy: [{ field: 'name', direction: 'asc' }]
    })
  }

  // Get active users
  async getActiveUsers(): Promise<User[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: [{ field: 'lastLogin', direction: 'desc' }]
    })
  }

  // Update user preferences
  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
    const user = await this.getById(userId)
    if (!user) throw new Error('User not found')

    const updatedPreferences = {
      ...user.preferences,
      ...preferences
    }

    return this.update(userId, { preferences: updatedPreferences })
  }

  // Update last login
  async updateLastLogin(userId: string): Promise<void> {
    return this.update(userId, { lastLogin: new Date() })
  }

  // Add user to team
  async addToTeam(userId: string, teamId: string): Promise<void> {
    const user = await this.getById(userId)
    if (!user) throw new Error('User not found')

    if (!user.teamIds.includes(teamId)) {
      const updatedTeamIds = [...user.teamIds, teamId]
      await this.update(userId, { teamIds: updatedTeamIds })
    }
  }

  // Remove user from team
  async removeFromTeam(userId: string, teamId: string): Promise<void> {
    const user = await this.getById(userId)
    if (!user) throw new Error('User not found')

    const updatedTeamIds = user.teamIds.filter(id => id !== teamId)
    await this.update(userId, { teamIds: updatedTeamIds })
  }

  // Search users by name or email
  async search(searchTerm: string, companyId?: string): Promise<User[]> {
    const whereClause = companyId 
      ? [{ field: 'companyId', operator: '==', value: companyId }]
      : []

    // Note: Firestore doesn't support text search, so we get all users and filter client-side
    // In production, consider using Algolia or similar for better search
    const users = await this.getAll({
      where: whereClause,
      orderBy: [{ field: 'name', direction: 'asc' }]
    })

    const searchLower = searchTerm.toLowerCase()
    return users.filter(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  }

  // Get user statistics
  async getStats(companyId?: string): Promise<{
    total: number
    active: number
    inactive: number
    byRole: Record<string, number>
  }> {
    const whereClause = companyId 
      ? [{ field: 'companyId', operator: '==', value: companyId }]
      : []

    const users = await this.getAll({ where: whereClause })

    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      byRole: {} as Record<string, number>
    }

    // Count by role
    users.forEach(user => {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1
    })

    return stats
  }
}