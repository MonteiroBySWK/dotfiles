import { apiExternal } from "@/lib/apiExternal";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEST_API_URL;



export async function GET(request: NextRequest) {
  apiExternal.get(API_BASE_URL)
}