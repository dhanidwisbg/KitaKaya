import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const userCookie = request.cookies.get("kitakaya_user_id")?.value;

  // Jika cookie belum ada, buat cookie default agar pengguna langsung bisa memakai dashboard
  if (!userCookie) {
    response.cookies.set("kitakaya_user_id", "usr_local_primary", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
