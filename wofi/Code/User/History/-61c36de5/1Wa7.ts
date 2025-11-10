import type { Project } from "@/types";
import { useMemo } from "react";
import { createResourceHook } from "./useResource";

// Tipos para o payload de criação/atualização (se diferentes do modelo principal)
type CreateProjectPayload = Omit<Project, "id" | "createdAt" | "updatedAt">;
type UpdateProjectPayload = Partial<CreateProjectPayload>;

function filter(searchTerm: string, statusFilter: string, data: any): Project[] {
  if (data) {
    return data?.filter((project: Project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  return [];
}

export const useProjects = createResourceHook<Project[], CreateProjectPayload, UpdateProjectPayload>("/projects");

// Hook para projeto individual - UMA VEZ  
export const useProject = createResourceHook<Project, CreateProjectPayload, UpdateProjectPayload>("/projects");
