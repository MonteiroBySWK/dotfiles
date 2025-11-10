import { apiExternal } from "@/lib/apiExternal";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEST_API_URL;

function handleApiError(error: any) {
  const status = error?.response?.status || 500;
  const message =
    error?.response?.data?.message || "Erro na comunicação com a API externa.";
  return NextResponse.json({ message }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Constrói query params para a API externa
    const params = new URLSearchParams();

    if (searchParams.get("search")) {
      params.set("search", searchParams.get("search")!);
    }
    if (searchParams.get("clientId")) {
      params.set("clientId", searchParams.get("clientId")!);
    }
    if (searchParams.get("planId")) {
      params.set("planId", searchParams.get("planId")!);
    }
    if (searchParams.get("page")) {
      params.set("page", searchParams.get("page")!);
    }
    if (searchParams.get("pageSize")) {
      params.set("pageSize", searchParams.get("pageSize")!);
    }

    const queryString = params.toString();
    const url = queryString ? `v1/projects?${queryString}` : "v1/projects";

    const response = await apiExternal.get(url);

    // A API retorna: { success: true, message: "...", data: { projects: [...], total: N } }
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await apiExternal.post('v1/projects', body);
    
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('[PROJECTS_POST]', error);
    return handleApiError(error);
  }
}