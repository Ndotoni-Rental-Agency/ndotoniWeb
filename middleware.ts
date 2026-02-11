import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/landlord',
  '/admin',
  '/stays',
  '/favorites'
];

// Define routes that should be accessible without authentication (exceptions to protected routes)
const publicExceptions = [
  '/landlord/properties/create/draft'
];

// Define admin-only routes
const adminRoutes = [
  '/admin'
];

// Define landlord routes (landlord or admin access)
const landlordRoutes = [
  '/landlord'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a public exception (guest property creation)
  const isPublicException = publicExceptions.some(route => 
    pathname.startsWith(route)
  );
  
  if (isPublicException) {
    return NextResponse.next();
  }
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Get auth tokens from cookies or headers
  const accessToken = request.cookies.get('accessToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');
  
  // If no token, redirect to home with a redirect parameter
  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('redirect', pathname);
    url.searchParams.set('auth', 'required');
    return NextResponse.redirect(url);
  }
  
  // For now, we'll let the client-side handle role-based access
  // In a production app, you'd decode the JWT here to check roles
  
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};