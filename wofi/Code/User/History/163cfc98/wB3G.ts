import { BaseRepository, QueryFilter } from './base.repository'
import { User } from '@/types'

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users')
  }

  async findByEmail(email: string): Promise<User | null> {
    const filter: QueryFilter = { field: 'email', operator: '==', value: email }
    const users = await this.findWhere([filter])
    return users.length > 0 ? users[0] : null
  }

  // Alias for findByEmail for backward compatibility
  async getByEmail(email: string): Promise<User | null> {
    return this.findByEmail(email)
  }

  async findByRole(role: User['role']): Promise<User[]> {
    const filter: QueryFilter = { field: 'role', operator: '==', value: role }
    return this.findWhere([filter])
  }

  async findActiveUsers(): Promise<User[]> {
    const filter: QueryFilter = { field: 'status', operator: '==', value: 'active' }
    return this.findWhere([filter])
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, { 
      lastLogin: new Date(),
      updatedAt: new Date()
    })
  }
}
