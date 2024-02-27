import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const userRoleCookie = req.cookies.get('userRoles');
  const userRoles = JSON.parse(userRoleCookie?.value ?? '[]');

  if (!userRoles.length) {
    const requestedPage = req.nextUrl.pathname || '/';
    const url = req.nextUrl.clone();
    url.pathname = `/onboarding`;
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
    '/((?!api|onboarding|_next/static|_next/image|storage|images|favicon.ico).*)',
  ],
};
