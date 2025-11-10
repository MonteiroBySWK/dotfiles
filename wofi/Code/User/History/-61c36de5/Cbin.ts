import type { Project } from "@/types";
import { useResource } from "./useResource";
import { useMemo } from "react";

// Tipos para o payload de criação/atualização (se diferentes do modelo principal)
type CreateProjectPayload = Omit<Project, "id" | "createdAt" | "updatedAt">;
type UpdateProjectPayload = Partial<CreateProjectPayload>;

function filter(searchTerm: string, statusFilter: string): Project[] {
    if (data) {
      return data?.filter((project: Project) => {
        const matchesSearch =
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          false;
        const matchesStatus =
          statusFilter === "all" || project.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }

    return [];
  }

// Hook para a lista de projetos
export function useProjects() {
  

  

  return {
    projects: data, // `data` já é Project[] ou null
    loading,
    error,
    // Tipamos as funções para o consumidor final ter a melhor experiência
    functions: functions,
    filter,
  };
}

// Hook para um único projeto
export function useProject(id: string | null) {
  
}
