// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value;
//   console.log('Token:', token); // Debugging line to check the token value
//   const pathname = request.nextUrl.pathname;

//   const isAuthPage = pathname === '/auth' || pathname === '/';

//   if (!token && !isAuthPage) {
//     // Not authenticated, trying to access protected route
//     return NextResponse.redirect(new URL('/auth', request.url));
//   }

//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   // Allow access
//   return NextResponse.next();
// }

// export const config = {
//     matcher: ['/', '/auth', '/dashboard/:path*'], // add other protected routes as needed
//   }
  