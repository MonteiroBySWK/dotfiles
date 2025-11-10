// Import service instances
import { userService } from './UserService'
import { projectService } from './ProjectService'
import { taskService } from './TaskService'
import { clientService } from './ClientService'
import { notificationService } from './NotificationService'
import { ticketService } from './TicketService'

// Export all services
export { UserService, userService } from './UserService'
export { ProjectService, projectService } from './ProjectService'
export { TaskService, taskService } from './TaskService'
export { ClientService, clientService } from './ClientService'
export { NotificationService, notificationService } from './NotificationService'
export { TicketService, ticketService } from './TicketService'

// Service instances for easy access
export const services = {
  user: userService,
  project: projectService,
  task: taskService,
  client: clientService,
  notification: notificationService,
  ticket: ticketService
} as const

export type ServiceType = keyof typeof services