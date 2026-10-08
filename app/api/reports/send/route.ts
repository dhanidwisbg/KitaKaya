import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, userName, totalIncome, totalExpense, transactions } = body;

    const recipientEmail = email || "user@example.com";
    if (!recipientEmail) {
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

    const income = Number(totalIncome) || 0;
    const expense = Number(totalExpense) || 0;
    const netSavings = income - expense;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject: `[KitaKaya] Ringkasan Laporan Finansial — ${userName || "Pengguna"}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1c1c1e;">
            <div style="background: #111; color: #fff; padding: 18px 24px; border-radius: 16px; margin-bottom: 24px;">
              <h1 style="font-size: 20px; margin: 0;">KitaKaya — Laporan Finansial</h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #a1a1a6;">Ringkasan performa finansial untuk ${userName || "Pengguna"}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 12px; background: #f2f2f7; border-radius: 12px; width: 33%;">
                  <div style="font-size: 11px; color: #8e8e93; font-weight: 600;">TOTAL PEMASUKAN</div>
                  <div style="font-size: 16px; font-weight: 700; color: #34c759; margin-top: 4px;">Rp ${income.toLocaleString("id-ID")}</div>
                </td>
                <td style="width: 12px;"></td>
                <td style="padding: 12px; background: #f2f2f7; border-radius: 12px; width: 33%;">
                  <div style="font-size: 11px; color: #8e8e93; font-weight: 600;">TOTAL PENGELUARAN</div>
                  <div style="font-size: 16px; font-weight: 700; color: #ff3b30; margin-top: 4px;">Rp ${expense.toLocaleString("id-ID")}</div>
                </td>
                <td style="width: 12px;"></td>
                <td style="padding: 12px; background: #f2f2f7; border-radius: 12px; width: 33%;">
                  <div style="font-size: 11px; color: #8e8e93; font-weight: 600;">SURPLUS / NET</div>
                  <div style="font-size: 16px; font-weight: 700; color: #007aff; margin-top: 4px;">Rp ${netSavings.toLocaleString("id-ID")}</div>
                </td>
              </tr>
            </table>

            <p style="font-size: 12px; color: #8e8e93; text-align: center; margin-top: 32px;">
              Email ini dikirim otomatis oleh aplikasi KitaKaya dari penyimpanan lokal peramban Anda.
            </p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, emailResult });
    }

    // Simulasi jika belum ada RESEND_API_KEY
    return NextResponse.json({
      success: true,
      simulated: true,
      message: `Laporan berhasil disimulasikan untuk dikirim ke ${recipientEmail}. (Tambahkan RESEND_API_KEY untuk pengiriman live)`,
    });
  } catch (error: any) {
    console.error("Gagal mengirim laporan:", error);
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
