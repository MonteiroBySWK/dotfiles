import { NextRequest, NextResponse } from "next/server";
import type { Project } from "@/types"; // Ensure Project type is defined correctly
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateProject = Pick<Project, "name" | "description">;
type UpdateProject = Partial<Pick<Project, "name" | "description">>;

interface Repo {
  list(): Promise<Project[]>;
  get(id: string): Promise<Project | null>;
  create(data: CreateProject): Promise<Project>;
  update(id: string, patch: UpdateProject): Promise<Project | null>;
  remove(id: string): Promise<boolean>;
}

const inTest = process.env.IN_TEST === "true";

class MockRepo implements Repo {
  private items: Project[];

  constructor() {
    const now = new Date();
    this.items = [
      {
        id: "p1",
        name: "Projeto Alpha",
        description: "Projeto de teste",
        createdAt: now,
        updatedAt: now,
        status: "active", // Add appropriate default value
        progress: 0, // Add appropriate default value
        startDate: now, // Add appropriate default value
        priority: "medium", // Add appropriate default value
        teamMembers: [], // Add appropriate default value
        managerId: null as string | null, // Add appropriate default value
      },
      {
        id: "p2",
        name: "Projeto Beta",
        description: "Outro projeto de teste",
        createdAt: now,
        updatedAt: now,
        status: "active", // Add appropriate default value
        progress: 0, // Add appropriate default value
        startDate: now, // Add appropriate default value
        priority: "medium", // Add appropriate default value
        teamMembers: [], // Add appropriate default value
        managerId: null, // Add appropriate default value
        category: "general", // Add appropriate default value
      },
        // Add other required properties with default values
      }list(): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }
get(id: string): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }
create(data: CreateProject): Promise<Project> {
    throw new Error("Method not implemented.");
  }
update(id: string, patch: UpdateProject): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }
remove(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
,
    ];
  }

  async list() {
    return [...this.items];
  }
  async get(id: string) {
    return this.items.find((p) => p.id === id) ?? null;
  }
  async create(data: CreateProject) {
    const now = new Date().toISOString();
    const proj: Project = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      createdAt: now,
      updatedAt: now,
    };
    this.items.unshift(proj);
    return proj;
  }
  async update(id: string, patch: UpdateProject) {
    const idx = this.items.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const updated: Project = {
      ...this.items[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.items[idx] = updated;
    return updated;
  }
  async remove(id: string) {
    const before = this.items.length;
    this.items = this.items.filter((p) => p.id !== id);
    return this.items.length !== before;
  }
}

class MemoryRepo implements Repo {
  private items: Project[] = [];
  async list() {
    return [...this.items];
  }
  async get(id: string) {
    return this.items.find((p) => p.id === id) ?? null;
  }
  async create(data: CreateProject) {
    const now = new Date().toISOString();
    const proj: Project = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      createdAt: now,
      updatedAt: now,
    };
    this.items.unshift(proj);
    return proj;
  }
  async update(id: string, patch: UpdateProject) {
    const idx = this.items.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const updated: Project = {
      ...this.items[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.items[idx] = updated;
    return updated;
  }
  async remove(id: string) {
    const before = this.items.length;
    this.items = this.items.filter((p) => p.id !== id);
    return this.items.length !== before;
  }
}

const repo: Repo = inTest ? new MockRepo() : new MemoryRepo();

function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { error: message, details },
    { status: 400, headers: { "Cache-Control": "no-store" } }
  );
}
function notFound(message = "Not found") {
  return NextResponse.json(
    { error: message },
    { status: 404, headers: { "Cache-Control": "no-store" } }
  );
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (id) {
    const project = await repo.get(id);
    if (!project) return notFound("Projeto não encontrado");
    return NextResponse.json(
      { data: project },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
  const list = await repo.list();
  return NextResponse.json(
    { data: list, meta: { total: list.length } },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  let data: CreateProject;
  try {
    data = await req.json();
  } catch {
    return badRequest("JSON inválido");
  }
  if (!data?.name || typeof data.name !== "string") {
    return badRequest("Campo 'name' é obrigatório");
  }
  const created = await repo.create({
    name: data.name.trim(),
    description: data.description,
  });
  return NextResponse.json(
    { data: created },
    { status: 201, headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const idFromQuery = url.searchParams.get("id");
  let body: UpdateProject & { id?: string };

  try {
    body = await req.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const id = idFromQuery ?? body?.id;
  if (!id)
    return badRequest("Parâmetro 'id' é obrigatório (query ?id= ou no corpo)");

  if (body.name !== undefined && typeof body.name !== "string") {
    return badRequest("Campo 'name' deve ser string");
  }
  if (body.description !== undefined && typeof body.description !== "string") {
    return badRequest("Campo 'description' deve ser string");
  }

  const updated = await repo.update(id, {
    name: body.name,
    description: body.description,
  });
  if (!updated) return notFound("Projeto não encontrado");
  return NextResponse.json(
    { data: updated },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return badRequest("Parâmetro 'id' é obrigatório (?id=)");
  const ok = await repo.remove(id);
  if (!ok) return notFound("Projeto não encontrado");
  return NextResponse.json(
    { data: { deleted: true, id } },
    { headers: { "Cache-Control": "no-store" } }
  );
}
