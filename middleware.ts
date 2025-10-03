import { NextRequest, NextResponse } from "next/server";
import { lucia } from "./src/lib/auth";

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;
  
  if (!sessionId) {
    // If no session ID, continue to the requested route
    return NextResponse.next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  
  if (session && session.fresh) {
    // If session is fresh, create a new session cookie
    const sessionCookie = lucia.createSessionCookie(session.id);
    const response = NextResponse.next();
    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return response;
  }

  if (!session) {
    // If session is invalid, clear the session cookie
    const sessionCookie = lucia.createBlankSessionCookie();
    const response = NextResponse.next();
    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return response;
  }

  // If session is valid, continue to the requested route
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};