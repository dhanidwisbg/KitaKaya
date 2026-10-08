import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    const profile = context?.profile || {
      full_name: "Dhani",
      monthly_income: 18500000,
      monthly_budget: 8000000,
    };
    const transactions = context?.transactions || [];
    const goals = context?.goals || [];

    const totalIncome = transactions
      .filter((t: any) => t.type === "income")
      .reduce((s: number, t: any) => s + Number(t.amount || 0), 0) || 18000000;

    const totalExpense = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((s: number, t: any) => s + Number(t.amount || 0), 0) || 7450000;

    const financialContext = `
Data Finansial Pengguna (dari penyimpanan lokal browser):
- Nama: ${profile?.full_name || "Pengguna"}
- Estimasi Gaji Bulanan: Rp ${(profile?.monthly_income || 0).toLocaleString("id-ID")}
- Target Budget Bulanan: Rp ${(profile?.monthly_budget || 0).toLocaleString("id-ID")}
- Total Pemasukan Tercatat: Rp ${totalIncome.toLocaleString("id-ID")}
- Total Pengeluaran Tercatat: Rp ${totalExpense.toLocaleString("id-ID")}
- Sisa Saldo Bersih: Rp ${(totalIncome - totalExpense).toLocaleString("id-ID")}
- Target Kantong Tabungan: ${goals && goals.length > 0
        ? goals
          .map(
            (g: any) =>
              `${g.title || g.name} (Terkumpul: Rp ${(g.current_amount || 0).toLocaleString(
                "id-ID"
              )} / Rp ${(g.target_amount || 0).toLocaleString("id-ID")})`
          )
          .join(", ")
        : "Dana Darurat (Rp 35.000.000 / Rp 50.000.000), Laptop Baru (Rp 21.000.000 / Rp 28.000.000)"
      }
- Ringkasan Transaksi Terkini:
${(transactions || [])
        .slice(0, 8)
        .map(
          (t: any) =>
            `• ${t.date || "Hari ini"}: [${t.type === "income" ? "Masuk" : "Keluar"}] ${t.description
            } (Rp ${(t.amount || 0).toLocaleString("id-ID")}) - Kategori: ${t.category}`
        )
        .join("\n")}
`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Mohon maaf, kunci API Gemini (`GEMINI_API_KEY`) belum dikonfigurasi di file `.env.local`. Silakan tambahkan API key Anda untuk mengaktifkan AI Financial Advisor.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const userMessage = messages?.[messages.length - 1]?.content || "Analisis keuangan saya";

    const candidateModels = ["gemini-flash-lite-latest", "gemini-flash-latest"];
    let replyText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: `Anda adalah "KitaKaya AI", asisten perencana keuangan pribadi yang ramah, bijak, solutif, dan profesional untuk anak muda / milenial / Gen Z Indonesia.
Gunakan gaya bahasa santun, suportif, dan mudah dipahami (bahasa Indonesia modern yang elegan dan terarah).
Gunakan prinsip budgeting 50/30/20 (Needs, Wants, Savings) dan berikan saran yang sangat realistis serta terarah sesuai data finansial pengguna berikut:

${financialContext}

Format jawaban dengan rapi menggunakan Markdown (bullet points, bold text). Berikan rekomendasi yang spesifik dan actionable.`,
        });

        const result = await model.generateContent(userMessage);
        replyText = result.response.text();
        if (replyText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[KitaKaya AI Advisor] Model ${modelName} failed, trying next:`, err.message);
      }
    }

    if (!replyText) {
      throw lastError || new Error("Semua model AI sedang sibuk");
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("AI Advisor Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Gagal menghasilkan respon AI",
        reply: "Terjadi kendala saat menghubungkan ke AI Financial Advisor. Pastikan GEMINI_API_KEY sudah valid.",
      },
      { status: 500 }
    );
  }
}
