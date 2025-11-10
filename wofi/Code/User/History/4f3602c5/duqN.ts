import { clientRepository } from '@/repositories'
import { Client } from '@/types'

export class ClientService {
  private repository = clientRepository

  // Get all clients
  async getClients(): Promise<Client[]> {
    return this.repository.findAll()
  }

  // Get client by ID
  async getClientById(id: string): Promise<Client | null> {
    return this.repository.getById(id)
  }

  // Get clients by status
  async getClientsByStatus(status: Client['status']): Promise<Client[]> {
    return this.repository.getAll({
      where: [{ field: 'status', operator: '==', value: status }]
    })
  }

  // Get active clients
  async getActiveClients(): Promise<Client[]> {
    return this.getClientsByStatus('active')
  }

  // Create client
  async createClient(clientData: Omit<Client, 'id'>): Promise<string> {
    return this.repository.create(clientData)
  }

  // Update client
  async updateClient(id: string, clientData: Partial<Client>): Promise<void> {
    return this.repository.update(id, {
      ...clientData,
      updatedAt: new Date()
    })
  }

  // Delete client
  async deleteClient(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  // Update client status
  async updateClientStatus(clientId: string, status: Client['status']): Promise<void> {
    return this.updateClient(clientId, { status })
  }

  // Activate client
  async activateClient(clientId: string): Promise<void> {
    return this.updateClientStatus(clientId, 'active')
  }

  // Deactivate client
  async deactivateClient(clientId: string): Promise<void> {
    return this.updateClientStatus(clientId, 'inactive')
  }

  // Update client contact information
  async updateContactInfo(clientId: string, contactInfo: {
    email?: string
    phone?: string
    website?: string
    address?: string
  }): Promise<void> {
    return this.updateClient(clientId, contactInfo)
  }

  // Update client company information
  async updateCompanyInfo(clientId: string, companyInfo: {
    company?: string
    type?: Client['type']
  }): Promise<void> {
    return this.updateClient(clientId, companyInfo)
  }

  // Search clients
  async searchClients(query: string): Promise<Client[]> {
    const clients = await this.getClients()
    const lowercaseQuery = query.toLowerCase()
    
    return clients.filter(client =>
      client.name.toLowerCase().includes(lowercaseQuery) ||
      client.email?.toLowerCase().includes(lowercaseQuery) ||
      client.website?.toLowerCase().includes(lowercaseQuery) ||
      client.industry?.toLowerCase().includes(lowercaseQuery) ||
      client.contacts.some(contact => 
        contact.name.toLowerCase().includes(lowercaseQuery) ||
        contact.email.toLowerCase().includes(lowercaseQuery)
      )
    )
  }

  // Get clients by industry
  async getClientsByIndustry(industry: string): Promise<Client[]> {
    const clients = await this.getClients()
    return clients.filter(client => 
      client.industry?.toLowerCase() === industry.toLowerCase()
    )
  }

  // Get clients by size
  async getClientsBySize(size: Client['size']): Promise<Client[]> {
    const clients = await this.getClients()
    return clients.filter(client => client.size === size)
  }

  // Get client statistics
  async getClientStats(): Promise<{
    total: number
    active: number
    inactive: number
    prospective: number
    bySize: Record<string, number>
    byIndustry: Record<string, number>
  }> {
    const clients = await this.getClients()

    const stats = {
      total: clients.length,
      active: clients.filter(c => c.status === 'active').length,
      inactive: clients.filter(c => c.status === 'inactive').length,
      prospective: clients.filter(c => c.status === 'prospective').length,
      bySize: {} as Record<string, number>,
      byIndustry: {} as Record<string, number>
    }

    clients.forEach(client => {
      if (client.size) {
        stats.bySize[client.size] = (stats.bySize[client.size] || 0) + 1
      }
      if (client.industry) {
        stats.byIndustry[client.industry] = (stats.byIndustry[client.industry] || 0) + 1
      }
    })

    return stats
  }

  // Get recent clients
  async getRecentClients(limit: number = 5): Promise<Client[]> {
    return this.repository.getAll({
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit
    })
  }

  // Check if client exists
  async clientExists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  // Check if client email exists
  async emailExists(email: string): Promise<boolean> {
    const clients = await this.repository.getAll({
      where: [{ field: 'email', operator: '==', value: email }]
    })
    return clients.length > 0
  }

  // Get client projects count
  async getClientProjectsCount(clientId: string): Promise<number> {
    // This would need to be implemented with project repository
    // For now, return 0 as placeholder
    return 0
  }

  // Get client revenue
  async getClientRevenue(clientId: string): Promise<number> {
    // This would need to be implemented with project/invoice repository
    // For now, return 0 as placeholder
    return 0
  }

  // Update client notes
  async updateClientNotes(clientId: string, notes: string): Promise<void> {
    return this.updateClient(clientId, { notes })
  }

  // Update client tags
  async updateClientTags(clientId: string, tags: string[]): Promise<void> {
    return this.updateClient(clientId, { tags })
  }

  // Add tag to client
  async addTagToClient(clientId: string, tag: string): Promise<void> {
    const client = await this.getClientById(clientId)
    if (!client) {
      throw new Error('Client not found')
    }

    if (!client.tags.includes(tag)) {
      const updatedTags = [...client.tags, tag]
      return this.updateClient(clientId, { tags: updatedTags })
    }
  }

  // Remove tag from client
  async removeTagFromClient(clientId: string, tag: string): Promise<void> {
    const client = await this.getClientById(clientId)
    if (!client) {
      throw new Error('Client not found')
    }

    const updatedTags = client.tags.filter(t => t !== tag)
    return this.updateClient(clientId, { tags: updatedTags })
  }

  // Get clients summary for dashboard
  async getClientsSummary() {
    const [recentClients, activeClients, stats] = await Promise.all([
      this.getRecentClients(),
      this.getActiveClients(),
      this.getClientStats()
    ])

    return {
      recentClients,
      activeClients,
      stats
    }
  }
}

// Export singleton instance
export const clientService = new ClientService()