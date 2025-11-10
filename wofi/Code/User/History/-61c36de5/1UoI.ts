import type { Project } from "@/types";
import { useMemo } from "react";
import { createResourceHook } from "./useResource";

// Tipos para o payload de criação/atualização (se diferentes do modelo principal)
type CreateProjectPayload = Omit<Project, "id" | "createdAt" | "updatedAt">;
type UpdateProjectPayload = Partial<CreateProjectPayload>;

export const useProjects = createResourceHook<Project, CreateProjectPayload, UpdateProjectPayload>("/projects");
export const useProject = createResourceHook<Project, CreateProjectPayload, UpdateProjectPayload>("/projects");
