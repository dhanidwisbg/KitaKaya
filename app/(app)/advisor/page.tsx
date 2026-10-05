"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User as UserIcon, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "Analisis kebiasaan belanjaku bulan ini 📊",
  "Gimana cara hemat Rp 500.000 bulan ini? 💡",
  "Evaluasi alokasi 50/30/20 dari pengeluaranku ⚖️",
  "Berapa lama lagi target impianku tercapai? 🎯",
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya **KitaKaya AI**, konsultan keuangan pribadimu. Saya dapat menganalisis arus kas, mengevaluasi budget 50/30/20, serta memberi tips cerdas agar target tabunganmu lebih cepat tercapai. Ada yang ingin kamu tanyakan hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: messageText.trim() },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        throw new Error(data.error || "Gagal mendapatkan respon");
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, terjadi kesalahan saat menghubungi AI Advisor. Pastikan kunci API Gemini sudah terpasang di file `.env.local`.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-apple-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-apple-blue to-purple-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-apple-primary flex items-center gap-2">
              KitaKaya AI Advisor
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">
                Gemini Pro
              </span>
            </h1>
            <p className="text-xs text-apple-secondary">
              Perencanaan finansial cerdas yang dipersonalisasi sesuai data keuanganmu.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                m.role === "user"
                  ? "bg-apple-primary text-white"
                  : "bg-gradient-to-tr from-apple-blue to-purple-500 text-white"
              }`}
            >
              {m.role === "user" ? (
                <UserIcon className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-apple-primary text-white font-medium"
                  : "bg-white border border-apple-subtle text-apple-primary shadow-apple-card prose-sm whitespace-pre-line"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-apple-blue to-purple-500 flex items-center justify-center text-white text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white border border-apple-subtle rounded-2xl px-4 py-3 text-xs text-apple-secondary flex items-center gap-2 shadow-apple-card">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-apple-blue" />
              Sedang menganalisis data keuanganmu...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-[11px] px-3 py-1.5 rounded-full bg-white border border-apple-subtle text-apple-secondary hover:text-apple-primary hover:border-apple-primary/40 whitespace-nowrap transition-all shadow-sm flex-shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan rekomendasi keuangan atau cara hemat..."
          disabled={isLoading}
          className="flex-1 px-4 py-3.5 text-xs rounded-2xl border border-apple-subtle bg-white text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all shadow-apple-card disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3.5 rounded-2xl bg-apple-primary text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
