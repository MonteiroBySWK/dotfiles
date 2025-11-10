import { Project } from "@/types";
import type { TeamMember } from "@/types";

const teamMembers: TeamMember[] = [
  { userId: "u1", role: "developer", joinedAt: new Date("2024-01-01T00:00:00Z") },
  { userId: "u2", role: "designer", joinedAt: new Date("2024-02-01T00:00:00Z") },
  { userId: "u3", role: "manager", joinedAt: new Date("2024-03-01T00:00:00Z") },
];

const projects: Project[] = [
  {
    id: "p1",
    name: "Projeto Alpha",
    description: "Desenvolvimento do novo sistema de e-commerce para a Thera.",
    status: "active",
    progress: 75,
    priority: "high",
    teamMembers: teamMembers,
    clientName: "Thera Corp",
    budget: { estimated: 150000, actual: 125000 },
    createdAt: new Date("2025-01-15T09:00:00Z"),
    deadline: new Date("2025-12-20T17:00:00Z"),
    startDate: new Date("2024-01-15T09:00:00Z"), // Added startDate
    managerId: "u3", // Added managerId
    category: "e-commerce", // Added category
    updatedAt: new Date("2025-01-15T09:00:00Z"), // Added updatedAt
  }
];
