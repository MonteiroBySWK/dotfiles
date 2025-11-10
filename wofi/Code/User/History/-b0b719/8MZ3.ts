import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";
  const res = await fetch(`${process.env.NEST_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      cookie,
      "cache-control": "no-store",
    },
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // corpo vazio (ex.: 204) — ignore
  }

  return NextResponse.json(data, { status: res.status });
}
