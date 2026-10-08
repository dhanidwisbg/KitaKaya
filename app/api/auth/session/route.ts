import { NextResponse } from "next/server";
import { USER_COOKIE_NAME } from "@/lib/session";

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

    const userId = "usr_local_primary";

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: cleanName,
        currency: "IDR",
      },
    });

    response.cookies.set(USER_COOKIE_NAME, userId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
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
