// ==== root_folder -> middleware.js ====
import { NextResponse } from 'next/server';

const protectedPaths = ['/all-products', '/edit-product', '/add-product'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to login and public files
  if (pathname === '/login' || pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isLoggedIn = request.cookies.get('auth')?.value === 'true';

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};
