import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      const token = request.cookies.get('admin_session')?.value

      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      const session = await verifySession(token)

      if (!session) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }

    if (pathname === '/admin/login') {
      const token = request.cookies.get('admin_session')?.value

      if (token) {
        const session = await verifySession(token)
        if (session) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
    }

    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
  ],
}
