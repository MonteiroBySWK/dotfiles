export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'update';
  isRead: boolean;
  createdAt: string; // Using string for date to avoid serialization issues
  actionUrl?: string;
}
