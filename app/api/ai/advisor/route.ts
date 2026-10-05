import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    // 1. Fetch user's financial context (Profile, Recent Transactions, Goals)
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(30);

    const { data: goals } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("user_id", user.id);

    const totalIncome = (transactions || [])
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const totalExpense = (transactions || [])
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const financialContext = `
Data Finansial Pengguna:
- Nama: ${profile?.full_name || "Pengguna"}
- Estimasi Gaji Bulanan: Rp ${(profile?.monthly_income || 0).toLocaleString("id-ID")}
- Target Budget Bulanan: Rp ${(profile?.monthly_budget || 0).toLocaleString("id-ID")}
- Total Pemasukan Tercatat: Rp ${totalIncome.toLocaleString("id-ID")}
- Total Pengeluaran Tercatat: Rp ${totalExpense.toLocaleString("id-ID")}
- Sisa Saldo: Rp ${(totalIncome - totalExpense).toLocaleString("id-ID")}
- Target Impian: ${
      goals && goals.length > 0
        ? goals
            .map(
              (g) =>
                `${g.title} (Terkumpul: Rp ${g.current_amount.toLocaleString(
                  "id-ID"
                )} / Rp ${g.target_amount.toLocaleString("id-ID")})`
            )
            .join(", ")
        : "Belum ada target impian"
    }
- 10 Transaksi Terakhir:
${(transactions || [])
  .slice(0, 10)
  .map(
    (t) =>
      `• ${t.date}: [${t.type === "income" ? "Masuk" : "Keluar"}] ${
        t.description
      } (Rp ${t.amount.toLocaleString("id-ID")}) - Kat: ${t.category}`
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
    const userMessage = messages[messages.length - 1]?.content || "Analisis keuangan saya";

    const candidateModels = ["gemini-flash-lite-latest", "gemini-flash-latest"];
    let replyText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: `Anda adalah "KitaKaya AI", asisten perencana keuangan pribadi yang ramah, bijak, solutif, dan profesional untuk anak muda / milenial / Gen Z Indonesia.
Gunakan gaya bahasa santun, suportif, dan mudah dipahami (bahasa Indonesia modern yang elegan ala Apple Editorial).
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
