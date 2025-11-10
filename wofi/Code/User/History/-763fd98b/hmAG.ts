import { Project } from "@/types";

userId: string;
  role: string;
  joinedAt: Date;

const projects: Project[] = [
  {
    id: 'p1',
    name: 'Projeto Alpha',
    description: 'Desenvolvimento do novo sistema de e-commerce para a Thera.',
    status: 'active',
    progress: 75,
    priority: 'high',
    teamMembers: [{ userId: 'u1', role: '', joinedAt: new Date()}, { userId: 'u2', role: '', joinedAt: new Date() }],
    clientName: 'Thera Corp',
    budget: { estimated: 150000, actual: 125000 },
    createdAt: new Date('2025-01-15T09:00:00Z'),
    deadline: new Date('2025-12-20T17:00:00Z'),
  },
  {
    id: 'p2',
    name: 'Aplicativo de Logística',
    description: 'App mobile para otimização de rotas de entrega.',
    status: 'planning',
    progress: 10,
    priority: 'medium',
    teamMembers: [{ userId: 'u3' }],
    clientName: 'LogiFast',
    budget: { estimated: 80000 },
    createdAt: new Date('2025-03-10T09:00:00Z'),
    deadline: new Date('2026-02-28T17:00:00Z'),
  },
];