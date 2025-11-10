export interface Task {
  id: string;
  title: string;
  description?: string;
  type: "task" | "bug" | "feature";
  status: "todo" | "in-progress" | "review" | "testing" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  projectId?: string;
  assigneeId?: string;
  reporterId?: string;
  dueDate?: Date;
  startDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  completedHours?: number;
  starred?: boolean;
  tags?: string[];
  dependencies?: string[];
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TaskWithStringDate {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId?: string;
  assigneeId?: string;
  reporterId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
