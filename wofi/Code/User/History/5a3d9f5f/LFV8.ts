export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueProjects?: number;
  overdueTasks?: number;
  teamMembers?: number;
  recentActivity?: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "project" | "task" | "comment" | "status_change" | "assignment";
  title: string;
  description?: string;
  userId: string;
  userName?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface DashboardData {
  stats: DashboardStats;
  recentProjects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    endDate?: Date;
    teamMembers: Array<{ userId: string }>;
  }>;
  recentTasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    assigneeId?: string;
    dueDate?: Date;
  }>;
}
