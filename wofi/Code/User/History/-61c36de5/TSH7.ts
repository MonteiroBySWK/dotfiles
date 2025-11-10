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

export const useProjects = createResourceHook<
  Project,
  CreateProjectPayload,
  UpdateProjectPayload
>("/projects");
