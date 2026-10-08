// ============================================================
// KitaKaya — Session Management (Cookie & Pure Browser State)
// ============================================================
import { cookies } from "next/headers";
import { User } from "@/lib/types/database.types";

export const USER_COOKIE_NAME = "kitakaya_user_id";

export type UserProfile = User;

const FALLBACK_USER: UserProfile = {
  id: "usr_local_primary",
  email: "dhani@kitakaya.id",
  full_name: "Dhani",
  avatar_url: null,
  monthly_income: 18500000,
  monthly_budget: 8000000,
  currency: "IDR",
  timezone: "Asia/Jakarta",
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mengambil User ID dari cookies browser (Server Component / Action)
 */
export async function getSessionUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(USER_COOKIE_NAME)?.value || "usr_local_primary";
  } catch {
    return "usr_local_primary";
  }
}

/**
 * Mengambil data profil user untuk Server Component
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const userId = await getSessionUserId();
  if (!userId) return FALLBACK_USER;

  return {
    ...FALLBACK_USER,
    id: userId,
  };
}

/**
 * Menyimpan nama pengguna ke cookie sesi
 */
export async function registerOrLoginUser(
  name: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanName = name.trim();
  if (!cleanName) {
    return { success: false, error: "Nama tidak boleh kosong" };
  }

  const cookieStore = await cookies();
  let userId = cookieStore.get(USER_COOKIE_NAME)?.value || "usr_local_primary";

  const user: UserProfile = {
    ...FALLBACK_USER,
    id: userId,
    full_name: cleanName,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  };

  // Simpan ke Cookies (1 tahun)
  cookieStore.set(USER_COOKIE_NAME, userId, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { success: true, user };
}

/**
 * Keluar / Hapus sesi cookie
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE_NAME);
}
