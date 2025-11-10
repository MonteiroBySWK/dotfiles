import { BaseRepository } from './base.repository'
import { Ticket } from '@/types'

export class TicketRepository extends BaseRepository<Ticket> {
  constructor() {
    super('tickets')
  }

  // Get tickets by status
  async getByStatus(status: Ticket['status']): Promise<Ticket[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: status }],
      orderBy: [{ field: 'updatedAt', direction: 'desc' }]
    })
  }

  // Get tickets by category
  async getByCategory(category: Ticket['category']): Promise<Ticket[]> {
    return this.getAll({
      where: [{ field: 'category', operator: '==', value: category }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    })
  }

  // Get tickets by priority
  async getByPriority(priority: Ticket['priority']): Promise<Ticket[]> {
    return this.getAll({
      where: [{ field: 'priority', operator: '==', value: priority }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    })
  }

  // Get tickets by assignee
  async getByAssignee(assigneeId: string): Promise<Ticket[]> {
    return this.getAll({
      where: [{ field: 'assigneeId', operator: '==', value: assigneeId }],
      orderBy: [{ field: 'updatedAt', direction: 'desc' }]
    })
  }

  // Get tickets by reporter
  async getByReporter(reporterId: string): Promise<Ticket[]> {
    return this.getAll({
      where: [{ field: 'reporterId', operator: '==', value: reporterId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    })
  }

  // Get open tickets
  async getOpenTickets(): Promise<Ticket[]> {
    return this.getAll({
      where: [
        { field: 'status', operator: 'in', value: ['open', 'in-progress'] }
      ],
      orderBy: [{ field: 'priority', direction: 'desc' }]
    })
  }

  // Get unassigned tickets
  async getUnassignedTickets(): Promise<Ticket[]> {
    return this.getAll({
      where: [
        { field: 'assigneeId', operator: '==', value: null },
        { field: 'status', operator: '!=', value: 'closed' }
      ],
      orderBy: [{ field: 'priority', direction: 'desc' }]
    })
  }

  // Assign ticket to user
  async assignTicket(ticketId: string, assigneeId: string): Promise<void> {
    await this.update(ticketId, { 
      assigneeId,
      status: 'in-progress'
    })
  }

  // Update ticket status
  async updateStatus(ticketId: string, status: Ticket['status']): Promise<void> {
    await this.update(ticketId, { status })
  }

  // Update ticket priority
  async updatePriority(ticketId: string, priority: Ticket['priority']): Promise<void> {
    await this.update(ticketId, { priority })
  }

  // Search tickets
  async search(searchTerm: string): Promise<Ticket[]> {
    const tickets = await this.getAll({
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    })

    const searchLower = searchTerm.toLowerCase()
    return tickets.filter(ticket => 
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.description.toLowerCase().includes(searchLower)
    )
  }

  // Get ticket statistics
  async getStats(): Promise<{
    total: number
    open: number
    inProgress: number
    resolved: number
    closed: number
    unassigned: number
    byCategory: Record<string, number>
    byPriority: Record<string, number>
    byStatus: Record<string, number>
  }> {
    const tickets = await this.getAll()

    const stats = {
      total: tickets.length,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      unassigned: tickets.filter(t => !t.assigneeId).length,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    }

    tickets.forEach(ticket => {
      // Count by status
      stats.byStatus[ticket.status] = (stats.byStatus[ticket.status] || 0) + 1
      stats.byCategory[ticket.category] = (stats.byCategory[ticket.category] || 0) + 1
      stats.byPriority[ticket.priority] = (stats.byPriority[ticket.priority] || 0) + 1

      switch (ticket.status) {
        case 'open':
          stats.open++
          break
        case 'in-progress':
          stats.inProgress++
          break
        case 'resolved':
          stats.resolved++
          break
        case 'closed':
          stats.closed++
          break
      }
    })

    return stats
  }

  // Get tickets that need attention (high priority, unassigned, or overdue)
  async getTicketsNeedingAttention(): Promise<{
    highPriority: Ticket[]
    unassigned: Ticket[]
    stale: Ticket[] // not updated in 7 days
  }> {
    const tickets = await this.getOpenTickets()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    return {
      highPriority: tickets.filter(t => t.priority === 'urgent' || t.priority === 'high'),
      unassigned: tickets.filter(t => !t.assigneeId),
      stale: tickets.filter(t => t.updatedAt < sevenDaysAgo)
    }
  }

  // Get my tickets (assigned to user or reported by user)
  async getMyTickets(userId: string): Promise<{
    assigned: Ticket[]
    reported: Ticket[]
  }> {
    const [assigned, reported] = await Promise.all([
      this.getByAssignee(userId),
      this.getByReporter(userId)
    ])

    return { assigned, reported }
  }

  // Close ticket
  async closeTicket(ticketId: string): Promise<void> {
    await this.updateStatus(ticketId, 'closed')
  }

  // Reopen ticket
  async reopenTicket(ticketId: string): Promise<void> {
    await this.updateStatus(ticketId, 'open')
  }

  // Resolve ticket
  async resolveTicket(ticketId: string): Promise<void> {
    await this.updateStatus(ticketId, 'resolved')
  }
}