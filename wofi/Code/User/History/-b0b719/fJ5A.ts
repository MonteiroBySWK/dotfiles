import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.NEST_API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
