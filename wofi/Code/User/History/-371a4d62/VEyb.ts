import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req:NextRequest) {
  const body = await req.json();

  const res = await fetch("", {
    method: "POST",
    body: JSON.stringify(body);
    headers: {"Content-Type": "application/json"}
  })
}