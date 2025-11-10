export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "bug" | "feature" | "support" | "question";
  assigneeId?: string;
  reporterId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  message: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}
