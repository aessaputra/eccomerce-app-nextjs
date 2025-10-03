import { NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth";
import { verify } from "argon2";
import prisma from "@/lib/prisma";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await verify(user.password, password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Create session
    const session = await lucia.createSession(user.id.toString(), {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Return success response with session cookie
    const response = NextResponse.json(
      { 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          name: user.name, 
          email: user.email,
          role: user.role
        } 
      },
      { status: 200 }
    );

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}