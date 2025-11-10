import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  marketing: boolean;
  security: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  sidebarCollapsed: boolean;
  compactMode: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number; // em minutos
  loginNotifications: boolean;
}

interface AppState {
  // Configurações
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  security: SecuritySettings;
  
  // Estado da UI
  sidebarOpen: boolean;
  currentPage: string;
  breadcrumbs: { label: string; href?: string }[];
  
  // Ações para Configurações
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
  updateSecurity: (settings: Partial<SecuritySettings>) => void;
  
  // Ações para UI
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  setBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void;
  
  // Reset
  resetSettings: () => void;
}

const defaultSettings = {
  notifications: {
    email: true,
    push: true,
    inApp: true,
    marketing: false,
    security: true,
  },
  appearance: {
    theme: 'system' as const,
    language: 'pt-BR' as const,
    sidebarCollapsed: false,
    compactMode: false,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 60,
    loginNotifications: true,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      notifications: defaultSettings.notifications,
      appearance: defaultSettings.appearance,
      security: defaultSettings.security,
      sidebarOpen: true,
      currentPage: '/dashboard',
      breadcrumbs: [{ label: 'Dashboard' }],

      // Ações para Configurações
      updateNotifications: (settings) => set((state) => ({
        notifications: { ...state.notifications, ...settings }
      })),
      
      updateAppearance: (settings) => set((state) => ({
        appearance: { ...state.appearance, ...settings }
      })),
      
      updateSecurity: (settings) => set((state) => ({
        security: { ...state.security, ...settings }
      })),

      // Ações para UI
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

      // Reset
      resetSettings: () => set({
        notifications: defaultSettings.notifications,
        appearance: defaultSettings.appearance,
        security: defaultSettings.security,
      }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        appearance: state.appearance,
        security: state.security,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
