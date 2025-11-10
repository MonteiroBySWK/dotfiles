import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Caminhos que requerem autenticação
  const protectedPaths = ['/dashboard']
  
  // Caminhos públicos que usuários autenticados não devem acessar
  const publicPaths = ['/login', '/']
  
  const { pathname } = request.nextUrl
  
  // Verifica se é uma rota protegida
  const isProtectedRoute = protectedPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // Verifica se é uma rota pública
  const isPublicRoute = publicPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // Por enquanto, como não temos acesso direto ao estado de autenticação do Firebase no middleware,
  // vamos permitir que o JavaScript do lado do cliente handle a autenticação
  // Este middleware serve principalmente para futuras implementações
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}