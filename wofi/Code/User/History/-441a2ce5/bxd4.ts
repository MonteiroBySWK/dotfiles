import { User } from './user';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'bug' | 'feature-request' | 'technical-support' | 'other';
  reporter: User | { id: string; name: string };
  assignee?: User | { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  comments?: TicketComment[];
  attachments?: TicketAttachment[];
}

export interface TicketComment {
  id: string;
  user: User | { id: string; name: string };
  comment: string;
  createdAt: string;
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  url: string;
  uploadedAt: string;
}
