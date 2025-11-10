import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface ProjectMember {
  projectId: string;
  memberId: string;
  role: 'manager' | 'developer' | 'designer' | 'tester' | 'analyst' | 'stakeholder';
  permissions: string[];
  joinedAt: string;
  allocation: number;
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

import { useMember, default as MemberProvider } from '@/contexts/MemberContext'

export function useMemberStore() {
  return useMember()
}

export { MemberProvider }
