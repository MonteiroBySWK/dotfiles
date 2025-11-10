import { NextRequest, NextResponse } from "next/server"
import type { Project } from "@/types"
import { mockProjects } from "@/data"
import { randomUUID } from "node:crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type CreateProject = Pick<Project, "name" | "description">
type UpdateProject = Partial<Pick<Project, "name" | "description">>

interface Repo {
  list(): Promise<Project[]>
  get(id: string): Promise<Project | null>
  create(data: CreateProject): Promise<Project>
  update(id: string, patch: UpdateProject): Promise<Project | null>
  remove(id: string): Promise<boolean>
}

// Utilitário interno para garantir campos obrigatórios do Project
function withDefaults(partial: Partial<Project>): Project {
  const now = new Date()
  return {
    id: partial.id ?? randomUUID(),
    name: partial.name ?? "Projeto sem nome",
    description: partial.description ?? "",
    status: partial.status ?? "planning",
    progress: partial.progress ?? 0,
    startDate: partial.startDate ?? now,
    endDate: partial.endDate,
    deadline: partial.deadline,
    priority: partial.priority ?? "medium",
    teamMembers: partial.teamMembers ?? [],
    team: partial.team,
    managerId: partial.managerId ?? "",
    category: partial.category ?? "general",
    tags: partial.tags,
    milestones: partial.milestones ?? [],
    attachments: partial.attachments ?? [],
    budget: partial.budget,
    clientId: partial.clientId,
    clientName: partial.clientName,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

class MockRepo implements Repo {
  private items: Project[]
  constructor() {
    // Usa os dados mockados de src/data
    this.items = [...mockProjects]
  }
  async list() {
    return [...this.items]
  }
  async get(id: string) {
    return this.items.find((p) => p.id === id) ?? null
  }
  async create(data: CreateProject) {
    const proj = withDefaults({ name: data.name, description: data.description })
    this.items.unshift(proj)
    return proj
  }
  async update(id: string, patch: UpdateProject) {
    const idx = this.items.findIndex((p) => p.id === id)
    if (idx < 0) return null
    const updated = withDefaults({ ...this.items[idx], ...patch, updatedAt: new Date(), id })
    this.items[idx] = updated
    return updated
  }
  async remove(id: string) {
    const before = this.items.length
    this.items = this.items.filter((p) => p.id !== id)
    return this.items.length !== before
  }
}

const repo: Repo = new MockRepo()

function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { error: message, details },
    { status: 400, headers: { "Cache-Control": "no-store" } }
  )
}
function notFound(message = "Not found") {
  return NextResponse.json(
    { error: message },
    { status: 404, headers: { "Cache-Control": "no-store" } }
  )
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id")
  if (id) {
    const project = await repo.get(id)
    if (!project) return notFound("Projeto não encontrado")
    return NextResponse.json(
      { data: project },
      { headers: { "Cache-Control": "no-store" } }
    )
  }
  const list = await repo.list()
  return NextResponse.json(
    { data: list, meta: { total: list.length } },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export async function POST(req: NextRequest) {
  let data: CreateProject
  try {
    data = await req.json()
  } catch {
    return badRequest("JSON inválido")
  }
  if (!data?.name || typeof data.name !== "string") {
    return badRequest("Campo 'name' é obrigatório")
  }
  const created = await repo.create({
    name: data.name.trim(),
    description: typeof data.description === "string" ? data.description : "",
  })
  return NextResponse.json(
    { data: created },
    { status: 201, headers: { "Cache-Control": "no-store" } }
  )
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url)
  const idFromQuery = url.searchParams.get("id")
  let body: UpdateProject & { id?: string }

  try {
    body = await req.json()
  } catch {
    return badRequest("JSON inválido")
  }

  const id = idFromQuery ?? body?.id
  if (!id)
    return badRequest("Parâmetro 'id' é obrigatório (query ?id= ou no corpo)")

  if (body.name !== undefined && typeof body.name !== "string") {
    return badRequest("Campo 'name' deve ser string")
  }
  if (body.description !== undefined && typeof body.description !== "string") {
    return badRequest("Campo 'description' deve ser string")
  }

  const updated = await repo.update(id, {
    name: body.name,
    description: body.description,
  })
  if (!updated) return notFound("Projeto não encontrado")
  return NextResponse.json(
    { data: updated },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return badRequest("Parâmetro 'id' é obrigatório (?id=)")
  const ok = await repo.remove(id)
  if (!ok) return notFound("Projeto não encontrado")
  return NextResponse.json(
    { data: { deleted: true, id } },
    { headers: { "Cache-Control": "no-store" } }
  )
}
