import { NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Invalidate session
    await lucia.invalidateSession(sessionId);
    
    // Create blank session cookie
    const sessionCookie = lucia.createBlankSessionCookie();
    
    // Return success response with blank session cookie
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}