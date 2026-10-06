import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    const supabase = await createClient();
    const newUserId = crypto.randomUUID();

    // Simpan data profil awal ke tabel users
    const { data: newUser, error: insertErr } = await supabase
      .from("users")
      .insert({
        id: newUserId,
        full_name: cleanName,
        email: null,
        monthly_income: 0,
        monthly_budget: 0,
        onboarding_completed: true,
      })
      .select()
      .single();

    if (insertErr || !newUser) {
      console.error("Gagal membuat user:", insertErr);
      return NextResponse.json(
        { error: insertErr?.message || "Gagal membuat sesi pengguna" },
        { status: 500 }
      );
    }

    // Buat response dengan cookie sesi 1 tahun
    const response = NextResponse.json({
      success: true,
      user: newUser,
    });

    response.cookies.set(USER_COOKIE_NAME, newUserId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 tahun
      httpOnly: false, // Memungkinkan sinkronisasi cepat di browser
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
