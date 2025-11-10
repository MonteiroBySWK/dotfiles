export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "manager" | "member" | "viewer";
  department?: string;
  position?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  status: "active" | "pending" | "inactive";
  preferences?: UserPreferences;
  permissions?: string[];
  companyId?: string;
  teamIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications?: NotificationSettings;
  dashboard?: DashboardSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface DashboardSettings {
  layout: string;
  widgets: string[];
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  dashboard: DashboardSettings;
}
