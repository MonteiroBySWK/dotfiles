import { userRepository } from '@/repositories'
import { User } from '@/types'

export class UserService {
  private repository = userRepository

  // Get all users
  async getUsers(): Promise<User[]> {
    return this.repository.findAll()
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    return this.repository.getById(id)
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    return this.repository.getByEmail(email)
  }

  // Get users by role
  async getUsersByRole(role: User['role']): Promise<User[]> {
    return this.repository.findByRole(role)
  }

  // Get active users
  async getActiveUsers(): Promise<User[]> {
    return this.repository.findActiveUsers()
  }

  // Create user
  async createUser(userData: Omit<User, 'id'>): Promise<string> {
    return this.repository.create(userData)
  }

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<void> {
    return this.repository.update(id, {
      ...userData,
      updatedAt: new Date()
    })
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  // Update user last login
  async updateLastLogin(userId: string): Promise<void> {
    return this.repository.updateLastLogin(userId)
  }

  // Update user profile
  async updateProfile(userId: string, profileData: {
    name?: string
    avatar?: string
    phone?: string
    bio?: string
    skills?: string[]
    department?: string
    position?: string
  }): Promise<void> {
    return this.updateUser(userId, profileData)
  }

  // Update user preferences
  async updatePreferences(userId: string, preferences: Partial<User['preferences']>): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedPreferences = {
      ...user.preferences,
      ...preferences
    }

    return this.updateUser(userId, { preferences: updatedPreferences })
  }

  // Update user permissions
  async updatePermissions(userId: string, permissions: string[]): Promise<void> {
    return this.updateUser(userId, { permissions })
  }

  // Add user to team
  async addUserToTeam(userId: string, teamId: string): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (!user.teamIds.includes(teamId)) {
      const updatedTeamIds = [...user.teamIds, teamId]
      return this.updateUser(userId, { teamIds: updatedTeamIds })
    }
  }

  // Remove user from team
  async removeUserFromTeam(userId: string, teamId: string): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedTeamIds = user.teamIds.filter(id => id !== teamId)
    return this.updateUser(userId, { teamIds: updatedTeamIds })
  }

  // Update user status
  async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    return this.updateUser(userId, { status })
  }

  // Activate user
  async activateUser(userId: string): Promise<void> {
    return this.updateUserStatus(userId, 'active')
  }

  // Deactivate user
  async deactivateUser(userId: string): Promise<void> {
    return this.updateUserStatus(userId, 'inactive')
  }

  // Get user statistics
  async getUserStats(): Promise<{
    total: number
    active: number
    inactive: number
    pending: number
    byRole: Record<string, number>
  }> {
    const users = await this.getUsers()

    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      pending: users.filter(u => u.status === 'pending').length,
      byRole: {} as Record<string, number>
    }

    users.forEach(user => {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1
    })

    return stats
  }

  // Check if user exists
  async userExists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email)
    return user !== null
  }
}

// Export singleton instance
export const userService = new UserService()