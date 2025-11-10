import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  sub: string
  exp: number
  role: string
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register'

  // Get token from cookie
  const token = request.cookies.get('token')?.value

  // If the token exists, validate it
  let isValidToken = false
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      const currentTime = Date.now() / 1000
      isValidToken = decoded.exp > currentTime
    } catch {
      isValidToken = false
    }
  }

  // Redirect logic
  if (isPublicPath && isValidToken) {
    // If user is signed in and tries to access login/register page,
    // redirect them to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !isValidToken) {
    // If user is not signed in and tries to access protected page,
    // redirect them to login page
    const from = path
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    )
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
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
