import { NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth";
import { generateId } from "lucia";
import { hash } from "argon2";
import prisma from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be at most 100 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    const { username, name, email, password } = result.data;

    // Check if username already exists
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hash(password);

    // Create user
    const userId = parseInt(generateId(15)); // Generate a numeric ID
    const user = await prisma.user.create({
      data: {
        id: userId,
        username,
        name,
        email,
        password: passwordHash,
      },
    });

    // Create session
    const session = await lucia.createSession(userId.toString(), {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Return success response with session cookie
    const response = NextResponse.json(
      { success: true, user: { id: user.id, username: user.username, name: user.name, email: user.email } },
      { status: 201 }
    );

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}