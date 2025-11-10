import { NextRequest, NextResponse } from "next/server"
import { projectRepository } from "@/data"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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
    const project = await projectRepository.getById(id)
    if (!project) return notFound("Projeto não encontrado")
    return NextResponse.json(
      { data: project },
      { headers: { "Cache-Control": "no-store" } }
    )
  }
  
  const list = await projectRepository.list()
  return NextResponse.json(
    { data: list, meta: { total: list.length } },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export async function POST(req: NextRequest) {
  let data: { name?: string; description?: string }
  
  try {
    data = await req.json()
  } catch {
    return badRequest("JSON inválido")
  }
  
  if (!data?.name || typeof data.name !== "string") {
    return badRequest("Campo 'name' é obrigatório")
  }
  
  const created = await projectRepository.create({
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
  let body: any

  try {
    body = await req.json()
  } catch {
    return badRequest("JSON inválido")
  }

  const id = idFromQuery ?? body?.id
  if (!id) {
    return badRequest("Parâmetro 'id' é obrigatório (query ?id= ou no corpo)")
  }

  const updated = await projectRepository.update(id, body)
  if (!updated) return notFound("Projeto não encontrado")
  
  return NextResponse.json(
    { data: updated },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id")
  
  if (!id) return badRequest("Parâmetro 'id' é obrigatório (?id=)")
  
  const ok = await projectRepository.remove(id)
  if (!ok) return notFound("Projeto não encontrado")
  
  return NextResponse.json(
    { data: { deleted: true, id } },
    { headers: { "Cache-Control": "no-store" } }
  )
}
