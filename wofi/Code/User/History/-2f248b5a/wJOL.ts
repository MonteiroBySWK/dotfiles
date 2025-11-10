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
const url = new URL(request.url);

  const searchParams = url.searchParams;

  const clientId = searchParams.get('clientId');
  const planId = searchParams.get('planId');
  const search = searchParams.get('search');
  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');

  const params = { clientId, planId, search, page }
  console.log(params)


  const response = await apiExternal.get(`${API_BASE_URL}/projects`, params);

  console.log(response.data.data);

  return NextResponse.json(response.data.data);
}

export async function POST(request: NextRequest) {}
