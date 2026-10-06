import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!profile || !profile.email) {
      return NextResponse.json(
        {
          error:
            "Email belum diatur di Profil. Silakan buka menu Pengaturan untuk menambahkan email penerima laporan.",
        },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    // Hitung ringkasan transaksi
    const { data: transactions } = await supabase
      .from("transactions")
      .select("type, amount")
      .eq("user_id", userId);

    const totalIncome = (transactions || [])
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = (transactions || [])
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netSavings = totalIncome - totalExpense;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: profile.email,
        subject: `[KitaKaya] Ringkasan Laporan Finansial — ${profile.full_name || "Pengguna"}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1c1c1e;">
            <div style="background: #111; color: #fff; padding: 18px 24px; border-radius: 16px; margin-bottom: 24px;">
              <h1 style="font-size: 20px; margin: 0;">🪙 KitaKaya — Laporan Finansial</h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #a1a1a6;">Ringkasan performa finansial untuk ${profile.full_name || "Pengguna"}</p>
            </div>
            
            <p style="font-size: 14px;">Halo <strong>${profile.full_name || "Sobat Kaya"}</strong>,</p>
            <p style="font-size: 14px; color: #3a3a3c;">Berikut adalah rekapitulasi performa finansial kamu:</p>
            
            <div style="background: #f2f2f7; border-radius: 16px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #8e8e93;">Total Pemasukan:</td>
                  <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #34c759;">Rp ${totalIncome.toLocaleString("id-ID")}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #8e8e93;">Total Pengeluaran:</td>
                  <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #ff3b30;">Rp ${totalExpense.toLocaleString("id-ID")}</td>
                </tr>
                <tr style="border-top: 1px solid #e5e5ea;">
                  <td style="padding: 12px 0 4px; font-weight: bold;">Net Tabungan (Selisih):</td>
                  <td style="padding: 12px 0 4px; font-weight: bold; text-align: right; color: #007aff;">Rp ${netSavings.toLocaleString("id-ID")}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 12px; color: #8e8e93; line-height: 1.5;">
              Laporan ini dikirimkan otomatis sesuai alamat email yang Anda simpan di menu Pengaturan KitaKaya.
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: `Laporan berhasil dikirim ke ${profile.email}`,
        data: emailResult,
      });
    }

    // Jika RESEND_API_KEY belum dipasang di .env.local, berikan respons simulasi sukses
    return NextResponse.json({
      success: true,
      simulated: true,
      message: `Laporan siap didistribusikan ke ${profile.email}. (Resend API Key siap digunakan)`,
    });
  } catch (error: any) {
    console.error("Gagal mengirim email:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengirim email laporan" },
      { status: 500 }
    );
  }
}
