import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database.types";

export const USER_COOKIE_NAME = "kitakaya_user_id";

export type UserProfile = Database["public"]["Tables"]["users"]["Row"];

/**
 * Mengambil User ID dari cookies browser (Server Component / Action)
 */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(USER_COOKIE_NAME)?.value || null;
}

/**
 * Mengambil data profil user aktif dari Supabase berdasarkan cookie
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Menyimpan nama pengguna baru ke database dan men-set cookies sesi
 */
export async function registerOrLoginUser(name: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanName = name.trim();
  if (!cleanName) {
    return { success: false, error: "Nama tidak boleh kosong" };
  }

  const cookieStore = await cookies();
  let userId = cookieStore.get(USER_COOKIE_NAME)?.value;

  const supabase = await createClient();

  if (userId) {
    // Update profil yang ada jika cookie sudah ada
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (existingUser) {
      const { data: updated, error: updateErr } = await supabase
        .from("users")
        .update({
          full_name: cleanName,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (!updateErr && updated) {
        return { success: true, user: updated };
      }
    }
  }

  // Jika belum ada cookie atau user lama tidak ditemukan, generate UUID baru
  const newUserId = crypto.randomUUID();
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
    return { success: false, error: insertErr?.message || "Gagal membuat sesi pengguna" };
  }

  // Simpan ke Cookies (1 tahun)
  cookieStore.set(USER_COOKIE_NAME, newUserId, {
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
    path: "/",
    httpOnly: false, // Boleh diakses client untuk kemudahan sinkronisasi
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { success: true, user: newUser };
}

/**
 * Keluar / Hapus sesi cookie
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE_NAME);
}
