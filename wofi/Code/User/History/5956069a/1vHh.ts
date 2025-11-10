import { apiExternal } from "@/lib/apiExternal";
import { resolveNaptr } from "dns";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEST_API_URL;

/**
 * Lida com erros vindos da API externa e os formata para o cliente.
 */
function handleApiError(error: any) {
  const status = error.response?.status || 500;
  const message =
    error.response?.data?.message || "Erro na comunicação com a API externa.";
  return NextResponse.json({ message }, { status });
}

// Handler para requisições POST
export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;

  const path = slug.join("/");
  const apiUrl = `${API_BASE_URL}/auth/${path}`;

  let body;
  try {
    // O corpo só é necessário para a maioria das rotas POST
    if (request.headers.get("content-type")?.includes("application/json")) {
      body = await request.json();
    }
  } catch (e) {
    console.error(e);
    body = null;
  }

  try {
    const response = await apiExternal.post<any>(apiUrl, body);

    if (path === "login") {
      const idToken = response.data.data["idToken"];

      console.log(idToken);

      const userData = response.data;
      const responseLogin = NextResponse.json(userData);

      responseLogin.cookies.set({
        name: "auth-token",
        value: idToken,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
      });

      return responseLogin;
    }

    if (path === "logout") {
      const responseLogout = NextResponse.json({
        message: "Logout bem-sucedido",
      });

      responseLogout.cookies.set("auth-token", "", { maxAge: -1, path: "/" });

      return responseLogout;
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
}

// Handler para requisições GET
