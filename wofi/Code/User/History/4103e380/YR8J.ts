import { NextResponse } from "next/server";
import { apiExternal } from "@/lib/apiExternal";

const API_BASE_URL = process.env.NEST_API_URL;

function handleApiError(error: any) {
  const status = error.response?.status || 500;
  const message =
    error.response?.data?.message || "Erro na comunicação com a API externa.";
  return NextResponse.json({ message }, { status });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;

  const path = slug.join("/");
  const apiUrl = `${API_BASE_URL}/users/${path}`;

  // Repassa o header de autorização para a API externa
  const authHeader = request.headers.get("Authorization");
  const headers: Record<string, string> = {};
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  try {
    const response = await apiExternal.get(apiUrl, { headers });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}
