import { projectRepository } from '@/repositories'
import { Project } from '@/types'

export class ProjectService {
  private repository = projectRepository

  // Get all projects
  async getProjects(): Promise<Project[]> {
    return this.repository.findAll()
  }

  // Get project by ID
  async getProjectById(id: string): Promise<Project | null> {
    return this.repository.getById(id)
  }

  // Get projects by client
  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return this.repository.getByClient(clientId)
  }

  // Get projects by manager
  async getProjectsByManager(managerId: string): Promise<Project[]> {
    return this.repository.getByManager(managerId)
  }

  // Get projects by status
  async getProjectsByStatus(status: Project['status']): Promise<Project[]> {
    return this.repository.getByStatus(status)
  }

  // Get active projects
  async getActiveProjects(): Promise<Project[]> {
    return this.repository.getActiveProjects()
  }

  // Create project
  async createProject(projectData: Omit<Project, 'id'>): Promise<string> {
    return this.repository.create(projectData)
  }

  // Update project
  async updateProject(id: string, projectData: Partial<Project>): Promise<void> {
    return this.repository.update(id, {
      ...projectData,
      updatedAt: new Date()
    })
  }

  // Delete project
  async deleteProject(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  // Add team member to project
  async addTeamMember(
    projectId: string, 
    memberId: string, 
    role: ProjectMember['role'] = 'developer',
    allocation: number = 100
  ): Promise<void> {
    const memberData: Omit<ProjectMember, 'joinedAt'> = {
      userId: memberId,
      role,
      allocation
    }
    return this.repository.addTeamMember(projectId, memberData)
  }

  // Remove team member from project
  async removeTeamMember(projectId: string, memberId: string): Promise<void> {
    return this.repository.removeTeamMember(projectId, memberId)
  }

  // Update project progress
  async updateProgress(projectId: string, progress: number): Promise<void> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100')
    }

    const status: Project['status'] = progress === 100 ? 'completed' : 'active'
    
    return this.updateProject(projectId, { 
      progress,
      status
    })
  }

  // Update project status
  async updateStatus(projectId: string, status: Project['status']): Promise<void> {
    const updateData: Partial<Project> = { status }

    // Set completion date if marking as completed
    if (status === 'completed') {
      updateData.endDate = new Date()
      updateData.progress = 100
    }

    return this.updateProject(projectId, updateData)
  }

  // Start project
  async startProject(projectId: string): Promise<void> {
    return this.updateProject(projectId, { 
      status: 'active',
      startDate: new Date()
    })
  }

  // Complete project
  async completeProject(projectId: string): Promise<void> {
    return this.updateStatus(projectId, 'completed')
  }

  // Pause project
  async pauseProject(projectId: string): Promise<void> {
    return this.updateStatus(projectId, 'on-hold')
  }

  // Cancel project
  async cancelProject(projectId: string): Promise<void> {
    return this.updateStatus(projectId, 'cancelled')
  }

  // Update project budget
  async updateBudget(projectId: string, budget: number): Promise<void> {
    if (budget < 0) {
      throw new Error('Budget cannot be negative')
    }
    return this.updateProject(projectId, { budget })
  }

  // Update project deadline
  async updateDeadline(projectId: string, deadline: Date): Promise<void> {
    return this.updateProject(projectId, { deadline })
  }

  // Get project statistics
  async getProjectStats(): Promise<{
    total: number
    active: number
    completed: number
    onHold: number
    cancelled: number
    overdue: number
    totalBudget: number
    averageProgress: number
  }> {
    const projects = await this.getProjects()
    const now = new Date()

    const stats = {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onHold: projects.filter(p => p.status === 'on-hold').length,
      cancelled: projects.filter(p => p.status === 'cancelled').length,
      overdue: projects.filter(p => p.deadline && p.deadline < now && p.status !== 'completed').length,
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
      averageProgress: projects.length > 0 
        ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length 
        : 0
    }

    return stats
  }

  // Get overdue projects
  async getOverdueProjects(): Promise<Project[]> {
    const projects = await this.getActiveProjects()
    const now = new Date()
    
    return projects.filter(project => 
      project.deadline && project.deadline < now
    )
  }

  // Get projects by date range
  async getProjectsByDateRange(startDate: Date, endDate: Date): Promise<Project[]> {
    const projects = await this.getProjects()
    
    return projects.filter(project => {
      const projectStart = project.startDate || project.createdAt
      return projectStart >= startDate && projectStart <= endDate
    })
  }

  // Search projects
  async searchProjects(query: string): Promise<Project[]> {
    const projects = await this.getProjects()
    const lowercaseQuery = query.toLowerCase()
    
    return projects.filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description?.toLowerCase().includes(lowercaseQuery) ||
      project.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  // Get projects by priority
  async getProjectsByPriority(priority: Project['priority']): Promise<Project[]> {
    const projects = await this.getProjects()
    return projects.filter(project => project.priority === priority)
  }

  // Get high priority projects
  async getHighPriorityProjects(): Promise<Project[]> {
    return this.getProjectsByPriority('high')
  }

  // Check if project exists
  async projectExists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  // Get projects summary for dashboard
  async getProjectsSummary(): Promise<{
    recentProjects: Project[]
    activeProjects: Project[]
    overdueProjects: Project[]
    stats: Awaited<ReturnType<typeof this.getProjectStats>>
  }> {
    const [recentProjects, activeProjects, overdueProjects, stats] = await Promise.all([
      this.repository.getAll({ 
        orderBy: [{ field: 'createdAt', direction: 'desc' }], 
        limit: 5 
      }),
      this.getActiveProjects(),
      this.getOverdueProjects(),
      this.getProjectStats()
    ])

    return {
      recentProjects,
      activeProjects,
      overdueProjects,
      stats
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService()