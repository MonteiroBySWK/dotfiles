import type { Project } from '@/types/project';
import { mockProjects } from '../project';
import { randomUUID } from 'node:crypto';

type CreateProjectInput = Pick<Project, 'name' | 'description'>;
type UpdateProjectInput = Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>;

// Utilitário para garantir campos obrigatórios do Project
function withDefaults(partial: Partial<Project>): Project {
  const now = new Date();
  return {
    id: partial.id ?? randomUUID(),
    name: partial.name ?? 'Projeto sem nome',
    description: partial.description ?? '',
    status: partial.status ?? 'planning',
    progress: partial.progress ?? 0,
    startDate: partial.startDate ?? now,
    endDate: partial.endDate,
    deadline: partial.deadline,
    priority: partial.priority ?? 'medium',
    teamMembers: partial.teamMembers ?? [],
    team: partial.team,
    managerId: partial.managerId ?? '',
    category: partial.category ?? 'general',
    tags: partial.tags,
    milestones: partial.milestones ?? [],
    attachments: partial.attachments ?? [],
    budget: partial.budget,
    clientId: partial.clientId,
    clientName: partial.clientName,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  };
}

class ProjectRepository {
  private items: Project[];

  constructor() {
    // Inicializa com os dados mockados
    this.items = [...mockProjects];
  }

  async list(): Promise<Project[]> {
    return [...this.items];
  }

  async getById(id: string): Promise<Project | null> {
    return this.items.find((p) => p.id === id) ?? null;
  }

  async create(data: CreateProjectInput): Promise<Project> {
    const project = withDefaults({
      name: data.name,
      description: data.description,
    });
    this.items.unshift(project);
    return project;
  }

  async update(id: string, data: UpdateProjectInput): Promise<Project | null> {
    const index = this.items.findIndex((p) => p.id === id);
    if (index < 0) return null;

    const updated = withDefaults({
      ...this.items[index],
      ...data,
      id, // Garante que o ID não seja alterado
      updatedAt: new Date(),
    });

    this.items[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const initialLength = this.items.length;
    this.items = this.items.filter((p) => p.id !== id);
    return this.items.length !== initialLength;
  }
}

// Exporta uma instância única (singleton)
export const projectRepository = new ProjectRepository();
