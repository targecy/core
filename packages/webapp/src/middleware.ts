import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log('session auth url', (process.env.NEXTAUTH_URL || process.env.VERCEL_URL || '') + '/api/auth/session');
  console.log('session cookie', req.headers.get('cookie'));

  let session;
  if (req.headers.get('cookie')) {
    const resSession = await fetch((process.env.NEXTAUTH_URL || process.env.VERCEL_URL || '') + '/api/auth/session', {
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      method: 'GET',
    });

    session = await resSession.json();
  }

  if (!token || !session.data.isBetaUser) {
    const requestedPage = req.nextUrl.pathname;
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
    '/((?!api|beta|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
