import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch(`${process.env.NEST_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  const cookie = res.headers.get("set-cookie");
  if (cookie) response.headers.set("set-cookie", cookie);

  return response;
}
