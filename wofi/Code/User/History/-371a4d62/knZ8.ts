import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${process.env.NEST_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  // Se o Nest enviar um cookie (HttpOnly), você pode repassá-lo:
  const cookie = res.headers.get("set-cookie");
  if (cookie) response.headers.set("set-cookie", cookie);

  return response;
}
