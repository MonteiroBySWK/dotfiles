import { NextRequest, NextResponse } from "next/server";

export async function validateToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Aqui você deve implementar a validação do token JWT
    // Esta é uma implementação básica que deve ser substituída por uma validação real
    if (!token) {
      throw new Error("Invalid token");
    }

    return null; // Token válido
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
