// Base repository
export { BaseRepository } from './base.repository'
export type { QueryOptions, PaginationResult } from './base.repository'

// Specific repositories
export { UserRepository } from './user.repository'
export { ProjectRepository } from './project.repository'
export { TaskRepository } from './task.repository'
export { ClientRepository } from './client.repository'
export { NotificationRepository } from './notification.repository'
export { TicketRepository } from './ticket.repository'

// Import repository classes
import { UserRepository } from './user.repository'
import { ProjectRepository } from './project.repository'
import { TaskRepository } from './task.repository'
import { ClientRepository } from './client.repository'
import { NotificationRepository } from './notification.repository'
import { TicketRepository } from './ticket.repository'

// Repository instances (singleton pattern)
export const userRepository = new UserRepository()
export const projectRepository = new ProjectRepository()
export const taskRepository = new TaskRepository()
export const clientRepository = new ClientRepository()
export const notificationRepository = new NotificationRepository()
export const ticketRepository = new TicketRepository()

// Repository factory
export const repositories = {
  user: userRepository,
  project: projectRepository,
  task: taskRepository,
  client: clientRepository,
  notification: notificationRepository,
  ticket: ticketRepository
} as const

export type RepositoryType = keyof typeof repositories