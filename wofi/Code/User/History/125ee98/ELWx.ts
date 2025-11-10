import { BaseRepository } from './base.repository'
import { Client } from '@/types'

export class ClientRepository extends BaseRepository<Client> {
  constructor() {
    super('clients')
  }

  // Get clients by status
  async getByStatus(status: Client['status']): Promise<Client[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: status }],
      orderBy: [{ field: 'name', direction: 'asc' }]
    })
  }

  // Get clients by type
  async getByType(type: Client['type']): Promise<Client[]> {
    return this.getAll({
      where: [{ field: 'type', operator: '==', value: type }],
      orderBy: [{ field: 'name', direction: 'asc' }]
    })
  }

  // Get active clients
  async getActiveClients(): Promise<Client[]> {
    return this.getByStatus('active')
  }

  // Get client by email
  async getByEmail(email: string): Promise<Client | null> {
    const clients = await this.getAll({
      where: [{ field: 'email', operator: '==', value: email }],
      limit: 1
    })
    return clients.length > 0 ? clients[0] : null
  }

  // Add project to client
  async addProject(clientId: string, projectId: string): Promise<void> {
    const client = await this.getById(clientId)
    if (!client) throw new Error('Client not found')

    if (!client.projects.includes(projectId)) {
      const updatedProjects = [...client.projects, projectId]
      await this.update(clientId, { projects: updatedProjects })
    }
  }

  // Remove project from client
  async removeProject(clientId: string, projectId: string): Promise<void> {
    const client = await this.getById(clientId)
    if (!client) throw new Error('Client not found')

    const updatedProjects = client.projects.filter(id => id !== projectId)
    await this.update(clientId, { projects: updatedProjects })
  }

  // Search clients
  async search(searchTerm: string): Promise<Client[]> {
    const clients = await this.getAll({
      orderBy: [{ field: 'name', direction: 'asc' }]
    })

    const searchLower = searchTerm.toLowerCase()
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.company && client.company.toLowerCase().includes(searchLower))
    )
  }

  // Get client statistics
  async getStats(): Promise<{
    total: number
    active: number
    inactive: number
    individual: number
    company: number
    withProjects: number
  }> {
    const clients = await this.getAll()

    return {
      total: clients.length,
      active: clients.filter(c => c.status === 'active').length,
      inactive: clients.filter(c => c.status === 'inactive').length,
      individual: clients.filter(c => c.type === 'individual').length,
      company: clients.filter(c => c.type === 'company').length,
      withProjects: clients.filter(c => c.projects.length > 0).length
    }
  }
}