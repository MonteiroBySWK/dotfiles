import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos para membros da empresa
export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  tags: string[];
  github?: string;
  linkedin?: string;
  dateFrom: string;
  location: string;
  avatar?: string;
  phone?: string;
  department?: string;
  skills: string[];
  projects: string[]; // IDs dos projetos associados
  status: 'active' | 'inactive' | 'vacation';
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
}

// Tipos para relacionamento projeto-membro
export interface ProjectMember {
  projectId: string;
  memberId: string;
  role: 'manager' | 'developer' | 'designer' | 'tester' | 'analyst' | 'stakeholder';
  permissions: string[];
  joinedAt: string;
  allocation: number; // Porcentagem de dedicação ao projeto (0-100)
}

interface MemberState {
  // Estado
  members: Member[];
  projectMembers: ProjectMember[];
  currentMember: Member | null;
  loading: boolean;
  error: string | null;
  
  // Ações para Membros
  setMembers: (members: Member[]) => void;
  setCurrentMember: (member: Member | null) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  getMemberById: (id: string) => Member | undefined;
  getMembersByProject: (projectId: string) => Member[];
  searchMembers: (query: string) => Member[];
  
  // Ações para Relacionamentos Projeto-Membro
  setProjectMembers: (projectMembers: ProjectMember[]) => void;
  addMemberToProject: (projectMember: ProjectMember) => void;
  removeMemberFromProject: (projectId: string, memberId: string) => void;
  updateProjectMemberRole: (projectId: string, memberId: string, role: ProjectMember['role']) => void;
  getProjectMembers: (projectId: string) => ProjectMember[];
  getMemberProjects: (memberId: string) => ProjectMember[];
  
  // Utilitários
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      members: [
        {
          id: "gabriel-monteiro",
          name: "Gabriel Monteiro",
          email: "eumonteiro.ofc@gmail.com",
          role: "Coordenador",
          tags: ["Coordenador"],
          github: "github.com/Mon...oBySWK",
          linkedin: "https://www.linkedin.com/in/montbyswk/",
          dateFrom: "01/03/2023",
          location: "Uema",
          avatar: "",
          phone: "",
          department: "Tecnologia",
          skills: ["JavaScript", "TypeScript", "React", "Node.js", "Firebase"],
          projects: ["alpha", "beta"],
          status: "active",
          createdAt: "2023-03-01T14:08:00Z",
          updatedAt: "2025-09-21T14:08:00Z",
          isOwner: true
        }
      ],
      projectMembers: [
        {
          projectId: "alpha",
          memberId: "gabriel-monteiro",
          role: "manager",
          permissions: ["read", "write", "delete", "manage"],
          joinedAt: "2023-03-01T14:08:00Z",
          allocation: 80
        }
      ],
      currentMember: null,
      loading: false,
      error: null,

      // Ações para Membros
      setMembers: (members) => set({ members }),
      
      setCurrentMember: (member) => set({ currentMember: member }),
      
      addMember: (member) => set((state) => ({
        members: [...state.members, member]
      })),
      
      updateMember: (id, updates) => set((state) => ({
        members: state.members.map(member =>
          member.id === id ? { ...member, ...updates, updatedAt: new Date().toISOString() } : member
        )
      })),
      
      deleteMember: (id) => set((state) => ({
        members: state.members.filter(member => member.id !== id),
        projectMembers: state.projectMembers.filter(pm => pm.memberId !== id)
      })),
      
      getMemberById: (id) => {
        return get().members.find(member => member.id === id);
      },
      
      getMembersByProject: (projectId) => {
        const { members, projectMembers } = get();
        const memberIds = projectMembers
          .filter(pm => pm.projectId === projectId)
          .map(pm => pm.memberId);
        return members.filter(member => memberIds.includes(member.id));
      },
      
      searchMembers: (query) => {
        const { members } = get();
        const lowerQuery = query.toLowerCase();
        return members.filter(member =>
          member.name.toLowerCase().includes(lowerQuery) ||
          member.email.toLowerCase().includes(lowerQuery) ||
          member.role.toLowerCase().includes(lowerQuery) ||
          member.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
          member.skills.some(skill => skill.toLowerCase().includes(lowerQuery))
        );
      },

      // Ações para Relacionamentos Projeto-Membro
      setProjectMembers: (projectMembers) => set({ projectMembers }),
      
      addMemberToProject: (projectMember) => set((state) => {
        // Verificar se já existe a associação
        const exists = state.projectMembers.some(
          pm => pm.projectId === projectMember.projectId && pm.memberId === projectMember.memberId
        );
        
        if (exists) return state;
        
        return {
          projectMembers: [...state.projectMembers, projectMember],
          // Adicionar projeto à lista de projetos do membro
          members: state.members.map(member =>
            member.id === projectMember.memberId
              ? { ...member, projects: [...new Set([...member.projects, projectMember.projectId])] }
              : member
          )
        };
      }),
      
      removeMemberFromProject: (projectId, memberId) => set((state) => ({
        projectMembers: state.projectMembers.filter(
          pm => !(pm.projectId === projectId && pm.memberId === memberId)
        ),
        // Remover projeto da lista de projetos do membro
        members: state.members.map(member =>
          member.id === memberId
            ? { ...member, projects: member.projects.filter(p => p !== projectId) }
            : member
        )
      })),
      
      updateProjectMemberRole: (projectId, memberId, role) => set((state) => ({
        projectMembers: state.projectMembers.map(pm =>
          pm.projectId === projectId && pm.memberId === memberId
            ? { ...pm, role }
            : pm
        )
      })),
      
      getProjectMembers: (projectId) => {
        return get().projectMembers.filter(pm => pm.projectId === projectId);
      },
      
      getMemberProjects: (memberId) => {
        return get().projectMembers.filter(pm => pm.memberId === memberId);
      },

      // Utilitários
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'member-storage',
      partialize: (state) => ({
        members: state.members,
        projectMembers: state.projectMembers
      })
    }
  )
);
