import type { Project } from "@/types";
import { useResource } from "./useResource";

// Tipos para o payload de criação/atualização (se diferentes do modelo principal)
type CreateProjectPayload = Omit<Project, "id" | "createdAt" | "updatedAt">;
type UpdateProjectPayload = Partial<CreateProjectPayload>;

// Hook para a lista de projetos
export function useProjects() {
  const { data, loading, error, functions } = useResource<Project[]>(
    "/projects",
    {
      autofetch: true,
    }
  );

  /*
  
    const filteredProjects = projects?.filter((project: Project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  
  */

  function filter() {}

  return {
    projects: data, // `data` já é Project[] ou null
    loading,
    error,
    // Tipamos as funções para o consumidor final ter a melhor experiência
    functions: {
      ...functions,
      create: (payload: CreateProjectPayload) =>
        functions.create<CreateProjectPayload, Project>(payload),
      update: (id: string, payload: UpdateProjectPayload) =>
        functions.update<UpdateProjectPayload, Project>(id, payload),

      filter: filter,
    },
  };
}

// Hook para um único projeto
export function useProject(id: string | null) {
  const { data, loading, error, functions } = useResource<Project>(
    id ? `/projects?id=${id}` : null, // Endpoint nulo se não houver ID
    {
      autofetch: true,
      // Extrai o objeto de `data` do envelope da API
      transformResponse: (response) => response?.data ?? null,
    }
  );

  return {
    project: data, // `data` já é Project ou null
    loading,
    error,
    functions: {
      ...functions,
      update: (payload: UpdateProjectPayload) =>
        id
          ? functions.update<UpdateProjectPayload, Project>(id, payload)
          : Promise.reject("ID do projeto não fornecido"),
      remove: () =>
        id
          ? functions.remove(id)
          : Promise.reject("ID do projeto não fornecido"),
    },
  };
}
