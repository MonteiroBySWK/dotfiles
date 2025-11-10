import type { Project } from "@/types";
import { createResourceHook } from "./createResourceHook";

type CreateProjectPayload = {
  name: string;
  description?: string;
  cost?: number;
  deadline?: string;
  scopeIds?: string[];
  backlogId: string;
  clientId: string;
  planId: string;
  sprintIds?: string[];
  requirementIds?: string[];
  memberIds?: string[];
};

type UpdateProjectPayload = Partial<CreateProjectPayload>;

const projectsHook = createResourceHook<
  Project,
  CreateProjectPayload,
  UpdateProjectPayload
>("/projects");

// Export com helper para facilitar uso
export function useProjects(id?: string) {
  const hook = projectsHook(id);
  
  return {
    // Estados
    data: hook.data,
    loading: hook.loading,
    error: hook.error,
    meta: hook.meta,
    
    // Actions desempacotadas para facilitar
    load: hook.actions.load,
    create: hook.actions.create,
    update: hook.actions.update,
    remove: hook.actions.remove,
    
    // Mantém actions também
    actions: hook.actions,
  };
}
