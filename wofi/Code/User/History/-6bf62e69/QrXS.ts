import { BaseRepository } from "./base.repository";
import { Project, ProjectMember, Milestone } from "@/types";

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super("projects");
  }

  async getByStatus(status: Project["status"]): Promise<Project[]> {
    return this.getAll({
      where: [{ field: "status", operator: "==", value: status }],
      orderBy: [{ field: "updatedAt", direction: "desc" }],
    });
  }

  async getByManager(managerId: string): Promise<Project[]> {
    return this.getAll({
      where: [{ field: "managerId", operator: "==", value: managerId }],
      orderBy: [{ field: "updatedAt", direction: "desc" }],
    });
  }

  async getByClient(clientId: string): Promise<Project[]> {
    return this.getAll({
      where: [{ field: "clientId", operator: "==", value: clientId }],
      orderBy: [{ field: "startDate", direction: "desc" }],
    });
  }

  async getByTeamMember(userId: string): Promise<Project[]> {
    const projects = await this.getAll({
      orderBy: [{ field: "updatedAt", direction: "desc" }],
    });

    return projects.filter((project) =>
      project.teamMembers.some((member) => member.userId === userId)
    );
  }

  async getActiveProjects(): Promise<Project[]> {
    return this.getByStatus("active");
  }

  async addTeamMember(
    projectId: string,
    member: Omit<ProjectMember, "joinedAt">
  ): Promise<void> {
    const project = await this.getById(projectId);
    if (!project) throw new Error("Project not found");

    // Check if user is already a member
    const existingMember = project.teamMembers.find(
      (m) => m.userId === member.userId
    );
    if (existingMember) {
      throw new Error("User is already a team member");
    }

    const newMember: ProjectMember = {
      ...member,
      joinedAt: new Date(),
    };

    const updatedMembers = [...project.teamMembers, newMember];
    await this.update(projectId, { teamMembers: updatedMembers });
  }

  // Remove team member from project
  async removeTeamMember(projectId: string, userId: string): Promise<void> {
    const project = await this.getById(projectId);
    if (!project) throw new Error("Project not found");

    const updatedMembers = project.teamMembers.filter(
      (member) => member.userId !== userId
    );
    await this.update(projectId, { teamMembers: updatedMembers });
  }

  // Update team member role
  async updateTeamMemberRole(
    projectId: string,
    userId: string,
    role: ProjectMember["role"]
  ): Promise<void> {
    const project = await this.getById(projectId);
    if (!project) throw new Error("Project not found");

    const updatedMembers = project.teamMembers.map((member) =>
      member.userId === userId ? { ...member, role } : member
    );

    await this.update(projectId, { teamMembers: updatedMembers });
  }

  // Update project progress
  async updateProgress(projectId: string, progress: number): Promise<void> {
    if (progress < 0 || progress > 100) {
      throw new Error("Progress must be between 0 and 100");
    }

    await this.update(projectId, { progress });
  }

  // Add milestone to project
  async addMilestone(
    projectId: string,
    milestone: Omit<Milestone, "id">
  ): Promise<void> {
    const project = await this.getById(projectId);
    if (!project) throw new Error("Project not found");

    const newMilestone: Milestone = {
      id: `milestone_${Date.now()}`,
      ...milestone,
    };

    const updatedMilestones = [...project.milestones, newMilestone];
    await this.update(projectId, { milestones: updatedMilestones });
  }

  // Update milestone status
  async updateMilestoneStatus(
    projectId: string,
    milestoneId: string,
    status: Milestone["status"]
  ): Promise<void> {
    const project = await this.getById(projectId);
    if (!project) throw new Error("Project not found");

    const updatedMilestones = project.milestones.map((milestone) => {
      if (milestone.id === milestoneId) {
        const updated = { ...milestone, status };
        if (status === "completed") {
          updated.completedAt = new Date();
        }
        return updated;
      }
      return milestone;
    });

    await this.update(projectId, { milestones: updatedMilestones });
  }

  // Get project statistics
  async getStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    onHold: number;
    cancelled: number;
    overdue: number;
    byStatus: Record<string, number>;
  }> {
    const projects = await this.getAll();
    const now = new Date();

    const stats = {
      total: projects.length,
      active: 0,
      completed: 0,
      onHold: 0,
      cancelled: 0,
      overdue: 0,
      byStatus: {} as Record<string, number>,
    };

    projects.forEach((project) => {
      // Count by status
      stats.byStatus[project.status] =
        (stats.byStatus[project.status] || 0) + 1;

      switch (project.status) {
        case "active":
          stats.active++;
          // Check if overdue
          if (project.endDate && project.endDate < now) {
            stats.overdue++;
          }
          break;
        case "completed":
          stats.completed++;
          break;
        case "on-hold":
          stats.onHold++;
          break;
        case "cancelled":
          stats.cancelled++;
          break;
      }
    });

    return stats;
  }

  // Search projects
  async search(searchTerm: string): Promise<Project[]> {
    const projects = await this.getAll({
      orderBy: [{ field: "name", direction: "asc" }],
    });

    const searchLower = searchTerm.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // Get projects ending soon (within specified days)
  async getProjectsEndingSoon(days: number = 7): Promise<Project[]> {
    const projects = await this.getAll({
      where: [{ field: "status", operator: "==", value: "active" }],
    });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return projects.filter(
      (project) =>
        project.endDate &&
        project.endDate <= cutoffDate &&
        project.endDate >= new Date()
    );
  }

  // Get overdue projects
  async getOverdueProjects(): Promise<Project[]> {
    const projects = await this.getAll({
      where: [{ field: "status", operator: "==", value: "active" }],
    });

    const now = new Date();
    return projects.filter(
      (project) => project.endDate && project.endDate < now
    );
  }

  async getNameById(id: string): Promise<string> {
    try {
      const result = await this.getById(id);
      return result?.name;
    } catch (error) {
      console.error(error);
    }
  }
}
