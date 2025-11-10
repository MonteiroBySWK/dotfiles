import type { Project } from "@/types";
import { createResourceHook } from "./createResourceHook";

type CreateProjectPayload = Omit<Project, "id" | "createdAt" | "updatedAt">;
type UpdateProjectPayload = Partial<CreateProjectPayload>;

export const useProjects = createResourceHook<Project, CreateProjectPayload, UpdateProjectPayload>("/projects");
