"use client";

import { useState } from "react";
import { Sparkles, X, Mic, ArrowUp, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FloatingAiWidgetProps {
  userName?: string;
}

export default function FloatingAiWidget({ userName = "Dhani" }: FloatingAiWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [adviceText, setAdviceText] = useState(
    `Hai ${userName}! Kamu menghemat 12% lebih banyak minggu ini. Ingin saya alokasikan Rp 1.500.000 surplus ini langsung ke Kantong Dana Darurat?`
  );

  const handleAction = async (prompt: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setAdviceText(data.reply);
      }
    } catch {
      toast.error("Gagal menghubungkan ke asisten AI");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
      >
        <Sparkles className="w-5 h-5 text-secondary-fixed group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-semibold pr-1 hidden sm:inline">Asisten Finansial</span>
        <span className="w-2 h-2 rounded-full bg-tertiary-on-container animate-ping" />
      </button>
    );
  }

  return (
    <aside className="fixed bottom-6 right-6 z-40 w-[380px] max-w-[calc(100vw-3rem)] rounded-3xl bg-surface-container-lowest/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-surface-container-high/70 p-4 flex flex-col gap-3 transition-all duration-300 animate-scale-up">
      {/* Header with Pulse Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-primary flex items-center gap-1.5">
              <span>Asisten Finansial</span>
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-on-container animate-pulse" />
            </div>
            <span className="text-[10px] text-outline font-medium">Aktif • Model Finansial v4.2</span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 rounded-full hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-primary transition-colors"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* AI Advice Bubble */}
      <div className="p-3 rounded-2xl bg-surface-container-low text-on-surface border border-surface-container-high/40">
        {isProcessing ? (
          <div className="flex items-center gap-2 text-xs text-outline py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-secondary" />
            <span>Sedang menganalisis keuangan...</span>
          </div>
        ) : (
          <p className="text-xs leading-relaxed">{adviceText}</p>
        )}
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <button
          type="button"
          onClick={() =>
            handleAction(
              "Alokasikan surplus Rp 1.500.000 ke Dana Darurat dan beri konfirmasi simulasi."
            )
          }
          className="whitespace-nowrap px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex-shrink-0"
        >
          Alokasikan sekarang
        </button>
        <button
          type="button"
          onClick={() => handleAction("Berapa budget jajan kopi yang sehat untuk saya bulan ini?")}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary text-[10px] font-semibold transition-colors flex-shrink-0"
        >
          Analisis kopi
        </button>
        <button
          type="button"
          onClick={() => handleAction("Simulasikan DP rumah 100jt dalam 2 tahun.")}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary text-[10px] font-semibold transition-colors flex-shrink-0"
        >
          Simulasi rumah
        </button>
      </div>

      {/* Natural Language Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            handleAction(input);
            setInput("");
          }
        }}
        className="relative flex items-center mt-0.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya finansial Anda..."
          className="w-full h-10 pl-3.5 pr-16 rounded-full bg-surface-container-low text-xs text-primary placeholder:text-outline border border-surface-container-high focus:outline-none focus:bg-white focus:border-secondary transition-all"
          type="text"
        />
        <div className="absolute right-1 flex items-center gap-1">
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-40"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </aside>
  );
}
