import { ticketRepository } from '@/repositories'
import { Ticket } from '@/types'

export class TicketService {
  private repository = ticketRepository

  // Get all tickets
  async getTickets(): Promise<Ticket[]> {
    return this.repository.findAll()
  }

  // Get ticket by ID
  async getTicketById(id: string): Promise<Ticket | null> {
    return this.repository.getById(id)
  }

  // Get tickets by status
  async getTicketsByStatus(status: Ticket['status']): Promise<Ticket[]> {
    return this.repository.getAll({
      where: [{ field: 'status', operator: '==', value: status }]
    })
  }

  // Get tickets by priority
  async getTicketsByPriority(priority: Ticket['priority']): Promise<Ticket[]> {
    return this.repository.getAll({
      where: [{ field: 'priority', operator: '==', value: priority }]
    })
  }

  // Get tickets by assignee
  async getTicketsByAssignee(assigneeId: string): Promise<Ticket[]> {
    return this.repository.getAll({
      where: [{ field: 'assigneeId', operator: '==', value: assigneeId }]
    })
  }

  // Get tickets by reporter
  async getTicketsByReporter(reporterId: string): Promise<Ticket[]> {
    return this.repository.getAll({
      where: [{ field: 'reporterId', operator: '==', value: reporterId }]
    })
  }

  // Get tickets by category
  async getTicketsByCategory(category: Ticket['category']): Promise<Ticket[]> {
    return this.repository.getAll({
      where: [{ field: 'category', operator: '==', value: category }]
    })
  }

  // Create ticket
  async createTicket(ticketData: Omit<Ticket, 'id'>): Promise<string> {
    return this.repository.create(ticketData)
  }

  // Update ticket
  async updateTicket(id: string, ticketData: Partial<Ticket>): Promise<void> {
    return this.repository.update(id, {
      ...ticketData,
      updatedAt: new Date()
    })
  }

  // Delete ticket
  async deleteTicket(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: Ticket['status']): Promise<void> {
    return this.updateTicket(ticketId, { status })
  }

  // Assign ticket
  async assignTicket(ticketId: string, assigneeId: string): Promise<void> {
    return this.updateTicket(ticketId, { assigneeId })
  }

  // Update ticket priority
  async updateTicketPriority(ticketId: string, priority: Ticket['priority']): Promise<void> {
    return this.updateTicket(ticketId, { priority })
  }

  // Resolve ticket
  async resolveTicket(ticketId: string, resolution?: string): Promise<void> {
    const updateData: Partial<Ticket> = { 
      status: 'resolved',
      resolvedAt: new Date()
    }

    if (resolution) {
      updateData.resolution = resolution
    }

    return this.updateTicket(ticketId, updateData)
  }

  // Close ticket
  async closeTicket(ticketId: string): Promise<void> {
    return this.updateTicketStatus(ticketId, 'closed')
  }

  // Reopen ticket
  async reopenTicket(ticketId: string): Promise<void> {
    return this.updateTicket(ticketId, { 
      status: 'open',
      resolvedAt: undefined
    })
  }

  // Get open tickets
  async getOpenTickets(): Promise<Ticket[]> {
    return this.getTicketsByStatus('open')
  }

  // Get closed tickets
  async getClosedTickets(): Promise<Ticket[]> {
    return this.getTicketsByStatus('closed')
  }

  // Get resolved tickets
  async getResolvedTickets(): Promise<Ticket[]> {
    return this.getTicketsByStatus('resolved')
  }

  // Get high priority tickets
  async getHighPriorityTickets(): Promise<Ticket[]> {
    return this.getTicketsByPriority('high')
  }

  // Get urgent tickets
  async getUrgentTickets(): Promise<Ticket[]> {
    return this.getTicketsByPriority('urgent')
  }

  // Get my tickets (for current user)
  async getMyTickets(userId: string): Promise<Ticket[]> {
    return this.getTicketsByAssignee(userId)
  }

  // Get my reported tickets
  async getMyReportedTickets(userId: string): Promise<Ticket[]> {
    return this.getTicketsByReporter(userId)
  }

  // Get ticket statistics
  async getTicketStats(): Promise<{
    total: number
    open: number
    inProgress: number
    resolved: number
    closed: number
    byPriority: Record<string, number>
    byCategory: Record<string, number>
  }> {
    const tickets = await this.getTickets()

    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      byPriority: {} as Record<string, number>,
      byCategory: {} as Record<string, number>
    }

    tickets.forEach(ticket => {
      stats.byPriority[ticket.priority] = (stats.byPriority[ticket.priority] || 0) + 1
      stats.byCategory[ticket.category] = (stats.byCategory[ticket.category] || 0) + 1
    })

    return stats
  }

  // Search tickets
  async searchTickets(query: string): Promise<Ticket[]> {
    const tickets = await this.getTickets()
    const lowercaseQuery = query.toLowerCase()
    
    return tickets.filter(ticket =>
      ticket.title.toLowerCase().includes(lowercaseQuery) ||
      ticket.description.toLowerCase().includes(lowercaseQuery) ||
      ticket.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  // Get tickets by date range
  async getTicketsByDateRange(startDate: Date, endDate: Date): Promise<Ticket[]> {
    const tickets = await this.getTickets()
    
    return tickets.filter(ticket => {
      const ticketDate = ticket.createdAt
      return ticketDate >= startDate && ticketDate <= endDate
    })
  }

  // Get overdue tickets (if they have a due date)
  async getOverdueTickets(): Promise<Ticket[]> {
    const tickets = await this.getTickets()
    const now = new Date()
    
    return tickets.filter(ticket => 
      ticket.dueDate && 
      ticket.dueDate < now && 
      ticket.status !== 'resolved' && 
      ticket.status !== 'closed'
    )
  }

  // Add comment to ticket
  async addTicketComment(ticketId: string, comment: string, authorId: string): Promise<void> {
    const ticket = await this.getTicketById(ticketId)
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    const newComment = {
      id: Date.now().toString(),
      content: comment,
      authorId,
      createdAt: new Date()
    }

    const updatedComments = [...(ticket.comments || []), newComment]
    return this.updateTicket(ticketId, { comments: updatedComments })
  }

  // Update ticket tags
  async updateTicketTags(ticketId: string, tags: string[]): Promise<void> {
    return this.updateTicket(ticketId, { tags })
  }

  // Add tag to ticket
  async addTagToTicket(ticketId: string, tag: string): Promise<void> {
    const ticket = await this.getTicketById(ticketId)
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    if (!ticket.tags?.includes(tag)) {
      const updatedTags = [...(ticket.tags || []), tag]
      return this.updateTicket(ticketId, { tags: updatedTags })
    }
  }

  // Remove tag from ticket
  async removeTagFromTicket(ticketId: string, tag: string): Promise<void> {
    const ticket = await this.getTicketById(ticketId)
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    const updatedTags = (ticket.tags || []).filter(t => t !== tag)
    return this.updateTicket(ticketId, { tags: updatedTags })
  }

  // Get ticket resolution time (average)
  async getAverageResolutionTime(): Promise<number> {
    const resolvedTickets = await this.getResolvedTickets()
    
    if (resolvedTickets.length === 0) return 0

    const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
      if (ticket.resolvedAt) {
        const resolutionTime = ticket.resolvedAt.getTime() - ticket.createdAt.getTime()
        return sum + resolutionTime
      }
      return sum
    }, 0)

    return totalResolutionTime / resolvedTickets.length / (1000 * 60 * 60 * 24) // Convert to days
  }

  // Check if ticket exists
  async ticketExists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  // Get tickets summary for dashboard
  async getTicketsSummary() {
    const [recentTickets, openTickets, urgentTickets, stats] = await Promise.all([
      this.repository.getAll({ 
        orderBy: [{ field: 'createdAt', direction: 'desc' }], 
        limit: 5 
      }),
      this.getOpenTickets(),
      this.getUrgentTickets(),
      this.getTicketStats()
    ])

    return {
      recentTickets,
      openTickets,
      urgentTickets,
      stats
    }
  }

  // Update ticket due date
  async updateTicketDueDate(ticketId: string, dueDate: Date): Promise<void> {
    return this.updateTicket(ticketId, { dueDate })
  }

  // Update ticket resolution
  async updateTicketResolution(ticketId: string, resolution: string): Promise<void> {
    return this.updateTicket(ticketId, { resolution })
  }

  // Escalate ticket (increase priority)
  async escalateTicket(ticketId: string): Promise<void> {
    const ticket = await this.getTicketById(ticketId)
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    let newPriority: Ticket['priority']
    switch (ticket.priority) {
      case 'low':
        newPriority = 'medium'
        break
      case 'medium':
        newPriority = 'high'
        break
      case 'high':
        newPriority = 'urgent'
        break
      default:
        newPriority = ticket.priority // Already urgent
    }

    return this.updateTicketPriority(ticketId, newPriority)
  }
}

// Export singleton instance
export const ticketService = new TicketService()