import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Zap, ChartPie, Bot } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-apple-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-foreground tracking-tight">
            🪙 KitaKaya
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-muted"
            >
              Masuk
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold bg-foreground text-background px-5 py-2.5 rounded-full hover:opacity-80 transition-all press-effect"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-light text-gold border border-gold/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Financial Assistant
          </div>

          <h1 className="text-[3.5rem] sm:text-[5rem] font-black tracking-[-0.04em] leading-none text-foreground mb-6 animate-slide-up">
            Catat keuanganmu.{" "}
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              Tumbuh bersama.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            KitaKaya membantu kamu mencatat pengeluaran, mengelola tabungan, 
            dan memahami keuanganmu — semua dengan bantuan AI yang cerdas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-semibold px-8 py-4 rounded-2xl hover:opacity-80 transition-all press-effect text-lg shadow-apple-md"
            >
              Mulai Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-muted text-foreground font-semibold px-8 py-4 rounded-2xl hover:bg-accent transition-all text-lg"
            >
              Lihat Fitur
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "~54%", label: "Less code written" },
              { value: "100%", label: "Data privacy" },
              { value: "⚡ AI", label: "Powered assistant" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-foreground mb-4">
              Semua yang kamu butuhkan
            </h2>
            <p className="text-lg text-muted-foreground">
              Dirancang untuk milenial & Gen Z yang ingin finansial lebih sehat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white squircle p-7 shadow-apple hover:shadow-apple-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div
                  className="w-12 h-12 squircle flex items-center justify-center mb-5 text-2xl"
                  style={{ background: feature.bgColor }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-foreground text-background squircle-xl p-12 shadow-apple-lg">
            <h2 className="text-4xl font-black tracking-tight mb-4">
              Siap mulai perjalanan finansialmu?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Gratis selamanya. Tidak perlu kartu kredit.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-foreground font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all press-effect text-lg"
            >
              Daftar Sekarang — Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <p>© 2026 KitaKaya. Dibuat dengan ❤️ di Indonesia.</p>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "✍️",
    title: "Catat dengan Bahasa Natural",
    description: 'Ketik "Kopi Starbucks 75rb" dan AI akan langsung mencatat — tanpa form yang ribet.',
    bgColor: "#E5F2FF",
  },
  {
    icon: "🎯",
    title: "Goals Tabungan",
    description: "Buat target tabungan dengan deadline dan pantau progressnya setiap hari.",
    bgColor: "#E8F8ED",
  },
  {
    icon: "📊",
    title: "Visualisasi Cerdas",
    description: "Chart dan grafik yang cantik untuk memahami pola pengeluaran kamu.",
    bgColor: "#FFF0EE",
  },
  {
    icon: "🤖",
    title: "AI Financial Advisor",
    description: "Tanya apa saja soal keuanganmu. AI kami memahami konteks keuangan personalmu.",
    bgColor: "#FFFBE5",
  },
  {
    icon: "📄",
    title: "Laporan PDF Otomatis",
    description: "Terima laporan keuangan bulanan langsung ke email — cantik dan mudah dibaca.",
    bgColor: "#F3E8FF",
  },
  {
    icon: "🔒",
    title: "Aman & Private",
    description: "Data kamu dienkripsi end-to-end. Hanya kamu yang bisa melihat keuanganmu.",
    bgColor: "#E8F4FD",
  },
];
