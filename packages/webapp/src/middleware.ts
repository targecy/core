import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  let session;
  if (req.headers.get('cookie')) {
    const urlBase = process.env.NEXTAUTH_URL || process.env.VERCEL_URL;
    if (!urlBase) throw new Error('NEXTAUTH_URL or VERCEL_URL must be set');
    let url = urlBase + '/api/auth/session';
    if (!url.includes('http')) url = 'https://' + url;

    console.log('session auth url', url);

    const resSession = await fetch(url, {
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
