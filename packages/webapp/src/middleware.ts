import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { env } from './env.mjs';

const adminPaths = ['/audiences', '/segments', 'publishers'];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (env.NEXT_PUBLIC_VERCEL_ENV === 'development') return NextResponse.next();

  if (!token?.isBetaUser) {
    const requestedPage = req.nextUrl.pathname || '/';
    const url = req.nextUrl.clone();
    url.pathname = `/beta`;
    url.search = `p=${requestedPage}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|beta|_next/static|_next/image|storage|images|favicon.ico).*)',
  ],
};
