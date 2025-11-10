import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const token = req.cookies.get("session")?.value;
  } catch (e) {
    console.error(e);
  }
}
