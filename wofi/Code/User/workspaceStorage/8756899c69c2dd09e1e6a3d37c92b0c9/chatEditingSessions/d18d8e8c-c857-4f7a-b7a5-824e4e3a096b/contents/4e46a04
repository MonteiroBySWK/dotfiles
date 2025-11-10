export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  progress: number;
  startDate: Date;
  endDate?: Date;
  priority: "low" | "medium" | "high" | "urgent";
  teamMembers: TeamMember[];
  managerId: string;
  category: string;
  tags?: string[];
  milestones?: Milestone[];
  attachments?: Attachment[];
  budget?: number | { estimated?: number; actual?: number };
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: string;
  joinedAt: Date;
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}
