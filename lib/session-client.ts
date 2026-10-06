export const USER_COOKIE_NAME = "kitakaya_user_id";

/**
 * Mendapatkan userId dari cookies di sisi client (browser)
 */
export function getClientUserId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + USER_COOKIE_NAME + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Menyimpan userId ke cookies di browser
 */
export function setClientUserId(userId: string) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365; // 1 tahun
  document.cookie = `${USER_COOKIE_NAME}=${encodeURIComponent(userId)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Menghapus cookies sesi di browser
 */
export function clearClientUserId() {
  if (typeof document === "undefined") return;
  document.cookie = `${USER_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
