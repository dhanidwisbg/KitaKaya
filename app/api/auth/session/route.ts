import { NextResponse } from "next/server";
import { USER_COOKIE_NAME } from "@/lib/session";
import { generateId } from "@/lib/db/indexeddb";

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const cleanName = typeof name === "string" ? name.trim() : "";

    if (!cleanName) {
      return NextResponse.json(
        { error: "Nama tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Generate new user ID
    const newUserId = generateId();

    // Create response with session cookie (1 year)
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUserId,
        name: cleanName,
        currency: "IDR",
        onboarding_completed: true,
      },
    });

    response.cookies.set(USER_COOKIE_NAME, newUserId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // Allow browser sync
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(USER_COOKIE_NAME);
  return response;
}
