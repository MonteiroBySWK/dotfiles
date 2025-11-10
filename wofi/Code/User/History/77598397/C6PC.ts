import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  team: number;
  progress: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  budget: string;
  client: string;
  owner: string; // UID do usuário
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  // Estado
  projects: Project[];
  currentProject: Project | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Ações para Projetos
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Ações para Tasks
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  
  // Utilitários
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  getProjectById: (id: string) => Project | undefined;
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
