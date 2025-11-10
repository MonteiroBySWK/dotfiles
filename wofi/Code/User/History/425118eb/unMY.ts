import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Rotas que exigem autenticação
  const protectedPaths = ["/dashboard"];

  // Rotas que um usuário autenticado não deve acessar (será redirecionado para o dashboard)
  const publicOnlyPaths = ["/login", "/"];

  const { pathname } = request.nextUrl;

  // Obtém o token da sessão dos cookies
  const sessionToken = request.cookies.get("auth-token")?.value;

  console.log(sessionToken);

  // Verifica se a rota atual é protegida
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Verifica se a rota atual é apenas para usuários não autenticados
  const isPublicOnlyRoute = publicOnlyPaths.includes(pathname);

  // 1. Se o usuário não tem um token e está tentando acessar uma rota protegida,
  //    redireciona para a página de login.
  if (!sessionToken && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Se o usuário tem um token e está tentando acessar uma rota pública
  //    (como login ou a página inicial), redireciona para o dashboard.
  if (sessionToken && isPublicOnlyRoute) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. Em todos os outros casos, permite que a requisição continue.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de solicitação, exceto para aqueles que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo de favicon)
     * - Qualquer arquivo na pasta /public
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
