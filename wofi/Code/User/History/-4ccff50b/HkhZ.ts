import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const token = req.cookies.get("session")?.value;
    if (!token) return res.json({ "error": "Unauthorized", "status": 401 });
  } catch (e) {
    console.error(e);
  }
}
