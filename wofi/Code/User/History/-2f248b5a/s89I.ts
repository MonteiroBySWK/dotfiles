import { apiExternal } from "@/lib/apiExternal";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEST_API_URL;

interface ProjectFilters {
  clientId?: string;
  planId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function GET(request: NextRequest) {
  request.body;

  const response = await apiExternal.get(`${API_BASE_URL}/projects`, {
    params: {
      clientId: "some-client-id", // Exemplo de valor
      planId: null, // Se o valor for null, undefined ou string vazia, o axios o ignora (ideal!)
      search: "projeto X",
      page: 1,
      pageSize: 20,
    },
  });

  console.log(response.data.data);

  return NextResponse.json(response.data.data);
}

export async function POST(request: NextRequest) {}
