import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const userId = (await getSessionUserId()) || req.cookies.get("kitakaya_user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const startTime = Date.now();
    const prompt = `Ekstrak transaksi dari kalimat berikut (hari ini ${
      new Date().toISOString().split("T")[0]
    }): "${text}"`;

    const candidateModels = ["gemini-flash-lite-latest", "gemini-flash-latest"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
          systemInstruction: `Anda adalah parser transaksi keuangan cerdas untuk aplikasi KitaKaya.
Tugas Anda adalah mengekstrak entitas transaksi dari teks bahasa Indonesia alami menjadi format JSON valid:
{
  "description": string (nama transaksi yang rapi, contoh: "Beli Kopi Kenangan", "Gaji Pokok", "Bensin Shell"),
  "type": "income" | "expense",
  "category": "salary" | "freelance" | "investment" | "gift" | "other_income" | "food" | "transport" | "shopping" | "entertainment" | "health" | "education" | "utilities" | "rent" | "insurance" | "savings" | "other_expense",
  "amount": number (nominal numerik bersih tanpa titik/koma, contoh: 25000 untuk 25rb, 5000000 untuk 5jt),
  "date": string (format YYYY-MM-DD, default hari ini jika tidak disebutkan),
  "note": string | null (informasi tambahan jika ada, contoh: "via Gopay", "di Senopati")
}`,
        });

        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[KitaKaya AI] Model ${modelName} failed, trying next:`, err.message);
      }
    }

    if (!responseText) {
      throw lastError || new Error("Semua model Gemini sedang sibuk");
    }

    const latency = Date.now() - startTime;
    const parsed = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: parsed,
      latency: `${latency}ms`,
    });
  } catch (error: any) {
    console.error("Parse transaction error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memproses transaksi dengan AI" },
      { status: 500 }
    );
  }
}
