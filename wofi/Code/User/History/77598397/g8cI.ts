import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { projectService } from '@/services'
import { Project } from '@/types'

interface ProjectState {
  // Data
  projects: Project[]
  currentProject: Project | null
  stats: {
    total: number
    active: number
    completed: number
    onHold: number
    cancelled: number
    byPriority: Record<string, number>
    byStatus: Record<string, number>
  } | null
  
  // UI State
  loading: boolean
  error: string | null
  searchResults: Project[]
  searchLoading: boolean
  
  // Actions
  fetchProjects: () => Promise<void>
  fetchProjectById: (id: string) => Promise<Project | null>
  fetchProjectsByStatus: (status: Project['status']) => Promise<void>
  fetchProjectsByPriority: (priority: Project['priority']) => Promise<void>
  fetchProjectsByManager: (managerId: string) => Promise<void>
  fetchProjectsByClient: (clientId: string) => Promise<void>
  fetchActiveProjects: () => Promise<void>
  fetchCompletedProjects: () => Promise<void>
  fetchProjectStats: () => Promise<void>
  
  createProject: (projectData: Omit<Project, 'id'>) => Promise<string>
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  
  searchProjects: (query: string) => Promise<void>
  clearSearch: () => void
  
  // Project management
  updateProjectStatus: (id: string, status: Project['status']) => Promise<void>
  updateProjectProgress: (id: string, progress: number) => Promise<void>
  addTeamMember: (projectId: string, member: { userId: string; role: string; allocation: number }) => Promise<void>
  removeTeamMember: (projectId: string, userId: string) => Promise<void>
  updateTeamMember: (projectId: string, userId: string, updates: Partial<{ role: string; allocation: number }>) => Promise<void>
  addMilestone: (projectId: string, milestone: any) => Promise<void>
  updateMilestone: (projectId: string, milestoneId: string, updates: any) => Promise<void>
  completeMilestone: (projectId: string, milestoneId: string) => Promise<void>
  
  // Utils
  setCurrentProject: (project: Project | null) => void
  clearError: () => void
  clearProjects: () => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      projects: [
        {
          id: "alpha",
          name: "Projeto Alpha",
          description: "Sistema de gestão empresarial completo",
          status: "in-progress",
          team: 8,
          progress: 65,
          deadline: "2025-12-15",
          priority: "high",
          createdAt: "2025-08-01",
          budget: "R$ 250.000",
          client: "Empresa XYZ Ltda",
          owner: "user123"
        },
        {
          id: "beta",
          name: "Website Redesign",
          description: "Renovação completa do site institucional",
          status: "planning",
          team: 5,
          progress: 20,
          deadline: "2025-11-30",
          priority: "medium",
          createdAt: "2025-09-15",
          budget: "R$ 80.000",
          client: "Startup ABC",
          owner: "user123"
        },
        {
          id: "gamma",
          name: "Mobile App",
          description: "Aplicativo mobile para iOS e Android",
          status: "completed",
          team: 6,
          progress: 100,
          deadline: "2025-10-20",
          priority: "high",
          createdAt: "2025-07-01",
          budget: "R$ 150.000",
          client: "Tech Corp",
          owner: "user123"
        },
        {
          id: "delta",
          name: "E-commerce Platform",
          description: "Plataforma de vendas online",
          status: "in-progress",
          team: 12,
          progress: 45,
          deadline: "2026-02-28",
          priority: "critical",
          createdAt: "2025-09-01",
          budget: "R$ 400.000",
          client: "Retail Plus",
          owner: "user123"
        }
      ],
      currentProject: null,
      tasks: [],
      loading: false,
      error: null,

      // Ações para Projetos
      setProjects: (projects) => set({ projects }),
      
      setCurrentProject: (project) => set({ currentProject: project }),
      
      addProject: (project) => set((state) => ({ 
        projects: [...state.projects, project] 
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(project => 
          project.id === id ? { ...project, ...updates } : project
        ),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates } 
          : state.currentProject
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(project => project.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        tasks: state.tasks.filter(task => task.projectId !== id)
      })),

      // Ações para Tasks
      setTasks: (tasks) => set({ tasks }),
      
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, task] 
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
        )
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      
      getTasksByProject: (projectId) => {
        return get().tasks.filter(task => task.projectId === projectId);
      },

      // Utilitários
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      getProjectById: (id) => {
        return get().projects.find(project => project.id === id);
      },

      // Funções para trabalhar com membros (integração com memberStore)
      getProjectsByMember: (memberId: string) => {
        // Esta função será usada em conjunto com o memberStore
        // Para buscar projetos onde um membro está envolvido
        return get().projects.filter(project => {
          // Aqui poderia haver uma lógica mais complexa
          // Por enquanto, retorna todos os projetos ativos
          return project.status === 'in-progress';
        });
      },

      getProjectProgress: (projectId: string) => {
        const project = get().projects.find(p => p.id === projectId);
        const tasks = get().tasks.filter(t => t.projectId === projectId);
        
        if (!project || tasks.length === 0) return 0;
        
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        return Math.round((completedTasks / tasks.length) * 100);
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({ 
        projects: state.projects,
        tasks: state.tasks,
        currentProject: state.currentProject
      }),
    }
  )
);
