import Link from "next/link";
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Bot, 
  FileText, 
  Lock,
  Wallet,
  Target,
  PieChart,
  Sparkles,
  CheckCircle2,
  ExternalLink,\n  MessageCircle
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              KitaKaya
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-full hover:bg-gray-100"
            >
              Masuk
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-1.5 text-sm font-medium mb-8 text-amber-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Financial Assistant</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
              Catat keuanganmu.
              <br />
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Tumbuh bersama.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              KitaKaya membantu kamu mencatat pengeluaran, mengelola tabungan, 
              dan memahami keuanganmu — semua dengan bantuan AI yang cerdas dan mudah digunakan.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 max-w-lg mx-auto">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-all text-base shadow-lg shadow-amber-500/20 flex-1 min-w-[200px]"
              >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all text-base border border-gray-300 flex-1 min-w-[200px]"
              >
                Lihat Fitur
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Gratis Selamanya</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Tidak Perlu Kartu Kredit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Data Aman & Terenkripsi</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
            {[
              { 
                icon: TrendingUp, 
                value: "100%", 
                label: "Data Privacy",
                color: "text-green-600",
                bgColor: "bg-green-50"
              },
              { 
                icon: Zap, 
                value: "AI", 
                label: "Powered Assistant",
                color: "text-amber-600",
                bgColor: "bg-amber-50"
              },
              { 
                icon: BarChart3, 
                value: "Real-time", 
                label: "Analytics",
                color: "text-blue-600",
                bgColor: "bg-blue-50"
              },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-900/5 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xl"
              >
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-4">
              Semua yang kamu butuhkan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dirancang untuk milenial & Gen Z yang ingin finansial lebih sehat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-7 shadow-lg shadow-gray-900/5 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${feature.bgColor}`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-4">
              Cara Kerja
            </h2>
            <p className="text-lg text-gray-600">
              Mulai dalam 3 langkah sederhana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Buat Akun",
                description: "Daftar gratis dengan email atau Google. Tidak perlu kartu kredit.",
                icon: Wallet
              },
              {
                step: "02", 
                title: "Catat Transaksi",
                description: "Ketik pengeluaranmu dengan bahasa natural. AI akan mencatat otomatis.",
                icon: FileText
              },
              {
                step: "03",
                title: "Pantau & Analisis",
                description: "Lihat visualisasi keuanganmu dan dapatkan insight dari AI advisor.",
                icon: PieChart
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-900/5 border border-gray-100">
                  <div className="text-6xl font-black text-gray-100 mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-4">
              Kata Mereka
            </h2>
            <p className="text-lg text-gray-600">
              Dipercaya oleh ribuan pengguna di Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rina W.",
                role: "Freelancer",
                content: "Akhirnya ada app yang bikin ngurus keuangan jadi gampang! AI-nya beneran helpful.",
                avatar: "R"
              },
              {
                name: "Dimas P.",
                role: "Software Engineer",
                content: "Fitur goal tabungannya keren banget. Bisa track progress dengan jelas.",
                avatar: "D"
              },
              {
                name: "Sarah A.",
                role: "Content Creator",
                content: "Laporan bulanannya cantik banget dan langsung ke email. Recommended!",
                avatar: "S"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-12 shadow-2xl shadow-gray-900/20 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
                Siap mulai perjalanan finansialmu?
              </h2>
              <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                Bergabung dengan ribuan pengguna yang sudah merasakan kemudahan mengelola keuangan dengan KitaKaya.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-6 py-3.5 rounded-xl hover:opacity-90 transition-all text-base shadow-lg"
              >
                Daftar Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">KitaKaya</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© 2026 KitaKaya. Dibuat dengan ❤️ di Indonesia.</p>
            <p className="mt-2">
              <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <span className="mx-2">•</span>
              <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: FileText,
    title: "Catat dengan Bahasa Natural",
    description: 'Ketik "Kopi Starbucks 75rb" dan AI akan langsung mencatat — tanpa form yang ribet.',
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Target,
    title: "Goals Tabungan",
    description: "Buat target tabungan dengan deadline dan pantau progressnya setiap hari.",
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: BarChart3,
    title: "Visualisasi Cerdas",
    description: "Chart dan grafik yang cantik untuk memahami pola pengeluaran kamu.",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Bot,
    title: "AI Financial Advisor",
    description: "Tanya apa saja soal keuanganmu. AI kami memahami konteks keuangan personalmu.",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: FileText,
    title: "Laporan PDF Otomatis",
    description: "Terima laporan keuangan bulanan langsung ke email — cantik dan mudah dibaca.",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Lock,
    title: "Aman & Private",
    description: "Data kamu dienkripsi end-to-end. Hanya kamu yang bisa melihat keuanganmu.",
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
  },
];
