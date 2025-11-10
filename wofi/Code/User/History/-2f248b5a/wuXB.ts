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
    params: {},
  });


  console.log(response.data.data)

  return NextResponse.json(response.data.data)
}
