import { NextRequest, NextResponse } from "next/server";
import { apiExternal } from "@/lib/apiExternal";

function handleApiError(error: any) {
  const status = error?.response?.status || 500;
  const message =
    error?.response?.data?.message || "Erro na comunicação com a API externa.";
  return NextResponse.json({ message }, { status });
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/projects/:id
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    const response = await apiExternal.get(`/projects/${id}`);
    
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('[PROJECT_ID_GET]', error);
    return handleApiError(error);
  }
}

// PUT /api/projects/:id
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const response = await apiExternal.put(`/projects/${id}`, body);
    
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('[PROJECT_ID_PUT]', error);
    return handleApiError(error);
  }
}

// DELETE /api/projects/:id
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    const response = await apiExternal.delete(`/projects/${id}`);
    
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('[PROJECT_ID_DELETE]', error);
    return handleApiError(error);
  }
}