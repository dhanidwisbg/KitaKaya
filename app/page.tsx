import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  PiggyBank,
  TrendingUp,
  BarChart3,
  FileText,
  Sparkles,
  Lock,
  Download,
  CheckCircle2,
  XCircle,
  Zap,
  Layers,
  ArrowUpRight,
  Plus,
  Minus,
} from "lucide-react";
import CategoryIcon from "@/components/ui/CategoryIcon";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#faf9fe] text-[#1a1b1f] selection:bg-primary selection:text-white">
      {/* 1. Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1600px] 2xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Kita Kaya"
              width={108}
              height={40}
              className="h-8 w-auto object-contain group-hover:opacity-80 transition-opacity"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-on-surface-variant">
            <Link href="#features" className="hover:text-primary transition-colors">
              Fitur
            </Link>
            <Link href="#comparison" className="hover:text-primary transition-colors">
              Keunggulan
            </Link>
            <Link href="#workflow" className="hover:text-primary transition-colors">
              Cara Kerja
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-surface-container-low hidden sm:inline-block"
            >
              Masuk Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-bold bg-primary text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Buka Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-32 sm:pt-36 pb-20 px-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Privacy Pill */}
          <div className="inline-flex items-center gap-2 bg-white border border-surface-container-high px-4 py-1.5 rounded-full text-xs font-semibold text-primary shadow-sm mb-6 animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Penyimpanan Browser Lokal • Bebas Login Rumit</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-headline text-primary mb-6 leading-[1.08] animate-slide-up">
            Kuasai Arus Kasmu.{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neutral-700 to-neutral-500">
              Bangun Kekayaan Nyata.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed font-normal animate-fade-in">
            Aplikasi pencatatan keuangan pribadi dan kantong tabungan yang berjalan langsung di
            perambanmu. Cepat, privat, tanpa iklan pinjol, dan seluruh datamu tersimpan aman di
            perangkatmu sendiri.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-neutral-800 active:scale-95 transition-all text-sm shadow-[0_4px_20px_rgba(0,0,0,0.1)] group"
            >
              <span>Buka Dashboard Saya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:bg-surface-container-low border border-surface-container-high transition-all text-sm shadow-sm"
            >
              Lihat Fitur Lengkap
            </Link>
          </div>

          {/* Grounded Stats (No AI Slop) */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-surface-container-high/60">
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-primary font-headline">0 Detik</div>
              <div className="text-xs text-outline mt-1 font-medium">Buka Langsung Pakai</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-primary font-headline">100%</div>
              <div className="text-xs text-outline mt-1 font-medium">Privasi di Browsermu</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-primary font-headline">Rp 0</div>
              <div className="text-xs text-outline mt-1 font-medium">Gratis Selamanya</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-primary font-headline">50/30/20</div>
              <div className="text-xs text-outline mt-1 font-medium">Budgeting Terukur</div>
            </div>
          </div>
        </div>

        {/* 3. Hero Visual Artifact (Interactive Mockup Preview) */}
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto mt-12 sm:mt-16 relative z-10 animate-fade-in">
          <div className="rounded-3xl bg-white p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-surface-container-high/80 relative overflow-hidden">
            {/* Top Bar of the Mockup */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-surface-container-high/60">
              <div className="flex items-center gap-3">
                <Image src="/icon.png" width={32} height={32} alt="KitaKaya" className="w-8 h-8 object-contain" />
                <div>
                  <div className="text-xs font-bold text-primary font-headline">Pratinjau Dashboard KitaKaya</div>
                  <div className="text-[11px] text-outline">Simulasi Waktu Nyata • Data Tersimpan Lokal</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container text-tertiary-on-container text-[11px] font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Surplus Kas Stabil</span>
                </span>
              </div>
            </div>

            {/* Inner Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {/* Metric 1 */}
              <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Total Kekayaan Bersih
                </span>
                <div className="text-3xl font-bold text-primary font-headline mt-1 tabular-nums">
                  Rp 10.550.000
                </div>
                <div className="text-[11px] text-tertiary-on-container font-semibold mt-1">
                  ↑ +14.8% dari bulan lalu
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Pemasukan Bulan Ini
                </span>
                <div className="text-3xl font-bold text-emerald-600 font-headline mt-1 tabular-nums">
                  Rp 18.000.000
                </div>
                <div className="text-[11px] text-outline mt-1 font-medium">
                  Payroll & Penghasilan Proyek
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Pengeluaran Bulan Ini
                </span>
                <div className="text-3xl font-bold text-primary font-headline mt-1 tabular-nums">
                  Rp 7.450.000
                </div>
                <div className="text-[11px] text-outline mt-1 font-medium">
                  41% dari batas pagu (Aman)
                </div>
              </div>
            </div>

            {/* 3 Savings Goals Preview Cards */}
            <div className="mt-6 pt-6 border-t border-surface-container-high/60">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-outline">
                  Kantong Tabungan Aktif
                </h4>
                <Link href="/dashboard" className="text-xs font-bold text-secondary hover:underline">
                  Kelola di Dashboard →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/70 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                      <CategoryIcon name="Shield" size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary">Dana Darurat</div>
                      <div className="text-[10px] text-outline">Rp 35jt / Rp 50jt</div>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: "70%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/70 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white">
                      <CategoryIcon name="Laptop" size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary">MacBook Pro</div>
                      <div className="text-[10px] text-outline">Rp 21jt / Rp 28jt</div>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-neutral-900 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/70 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                      <CategoryIcon name="Plane" size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary">Liburan Musim Gugur</div>
                      <div className="text-[10px] text-outline">Rp 9jt / Rp 15jt</div>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Section: Kenapa KitaKaya Berbeda */}
      <section id="comparison" className="py-20 px-4 sm:px-6 bg-white border-y border-surface-container-high/60">
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Bandingkan & Rasakan Bedanya
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary font-headline mt-1">
              Bukan Aplikasi Finansial Biasa.
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto mt-2">
              Bebaskan diri dari aplikasi ribet yang menjual data pribadimu dan penuh iklan pinjol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box: Aplikasi Umum */}
            <div className="p-8 rounded-3xl bg-surface-container-low/60 border border-surface-container-high/60 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-red/10 text-apple-red text-xs font-bold mb-4">
                  <XCircle className="w-4 h-4" />
                  <span>Aplikasi Konvensional</span>
                </div>
                <h3 className="text-lg font-bold text-primary font-headline mb-4">
                  Banyak Hambatan & Risiko Privasi
                </h3>
                <ul className="space-y-3.5 text-xs text-on-surface-variant">
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-apple-red shrink-0 mt-0.5" />
                    <span>Harus registrasi dengan password rumit dan nomor HP aktif.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-apple-red shrink-0 mt-0.5" />
                    <span>Data finansial disimpan di cloud server asing dan rawan kebocoran.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-apple-red shrink-0 mt-0.5" />
                    <span>Dipenuhi pop-up iklan pinjaman online dan produk kredit konsumtif.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-apple-red shrink-0 mt-0.5" />
                    <span>Fitur laporan atau ekspor dibatasi paywall langganan bulanan.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Box: KitaKaya */}
            <div className="p-8 rounded-3xl bg-primary text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pengalaman KitaKaya</span>
                </div>
                <h3 className="text-lg font-bold text-white font-headline mb-4">
                  Privat, Ringan & Sepenuhnya Gratis
                </h3>
                <ul className="space-y-3.5 text-xs text-white/80">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Buka browser langsung pakai tanpa perlu buat akun atau kata sandi.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>100% tersimpan di localStorage browsermu. Tidak ada server yang membaca.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Antarmuka bersih, tanpa banner iklan sponsor, tanpa gangguan promosi.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Unduh arsip JSON dan cetak laporan PDF eksekutif gratis kapan saja.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Grid (With Lucide Vector Icons) */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Solusi Finansial Menyeluruh
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary font-headline mt-1">
              Dirancang untuk Kemudahan Nyata.
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto mt-2">
              Setiap modul dibangun dengan presisi untuk mendukung kebiasaan finansial yang sehat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-surface-container-high/60 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center mb-5 text-primary border border-surface-container-high/60 group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-primary font-headline mb-2">
                    {item.title}
                  </h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Workflow Section */}
      <section id="workflow" className="py-20 px-4 sm:px-6 bg-white border-t border-surface-container-high/60">
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Alur Penggunaan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary font-headline mt-1">
              Mulai dalam 3 Langkah Mudah.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center font-bold text-base mx-auto border border-surface-container-high">
                1
              </div>
              <h3 className="font-bold text-sm text-primary font-headline">Buka Peramban</h3>
              <p className="text-xs text-outline leading-relaxed">
                Kunjungi KitaKaya kapan saja di browser laptop atau HP. Tidak perlu unduh aplikasi berat.
              </p>
            </div>

            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center font-bold text-base mx-auto border border-surface-container-high">
                2
              </div>
              <h3 className="font-bold text-sm text-primary font-headline">Catat Arus Kas</h3>
              <p className="text-xs text-outline leading-relaxed">
                Catat pengeluaran harian dan pemasukan lewat input cepat atau form terstruktur.
              </p>
            </div>

            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center font-bold text-base mx-auto border border-surface-container-high">
                3
              </div>
              <h3 className="font-bold text-sm text-primary font-headline">Wujudkan Impian</h3>
              <p className="text-xs text-outline leading-relaxed">
                Pantau progres kantong tabungan dan evaluasi rasio arus kasmu secara konsisten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Action Banner */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-primary text-white rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 overflow-hidden mx-auto mb-6">
              <Image src="/icon.png" width={64} height={64} alt="KitaKaya" className="w-full h-full object-contain" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline mb-4">
              Siap Memulai Finansial yang Lebih Rapi?
            </h2>
            <p className="text-white/70 mb-8 text-sm sm:text-base max-w-lg mx-auto">
              Seluruh catatanmu tersimpan aman di browser Anda. Langsung buka dashboard dan rasakan kemudahannya.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:bg-neutral-100 active:scale-95 transition-all text-sm shadow-md"
            >
              <span>Buka Dashboard Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-surface-container-high/60 py-10 px-4 sm:px-6 lg:px-10 bg-surface-container-lowest text-xs text-outline">
        <div className="max-w-[1600px] 2xl:max-w-[1780px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/icon.png" width={24} height={24} alt="KitaKaya" className="w-6 h-6 object-contain" />
            <span className="font-headline font-bold text-sm text-primary">Kita Kaya</span>
            <span>— Personal Finance Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/goals" className="hover:text-primary transition-colors">
              Kantong Tabungan
            </Link>
            <Link href="/transactions" className="hover:text-primary transition-colors">
              Transaksi
            </Link>
            <Link href="/settings" className="hover:text-primary transition-colors">
              Cadangkan Data
            </Link>
          </div>

          <p>© 2026 KitaKaya. Tersimpan lokal di perangkat Anda.</p>
        </div>
      </footer>
    </main>
  );
}

const featuresList = [
  {
    icon: PiggyBank,
    title: "Kantong Tabungan Terencana",
    description:
      "Alokasikan dana darurat, liburan, dan gadget impian ke pos terpisah agar tidak terpakai untuk belanja harian.",
  },
  {
    icon: Sparkles,
    title: "Pencatatan Cepat & Natural",
    description:
      "Cukup ketik secara santai seperti 'Kopi Kenangan 28rb' atau gunakan form cepat untuk mencatat mutasi pengeluaran.",
  },
  {
    icon: BarChart3,
    title: "Visualisasi Rasio 50/30/20",
    description:
      "Pantau rasio kebutuhan, keinginan, dan tabungan dalam grafik interaktif yang mudah dipahami.",
  },
  {
    icon: ShieldCheck,
    title: "100% Privat di Browser",
    description:
      "Data tersimpan di penyimpanan lokal perambanmu. Tidak ada server eksternal yang melihat arus keuanganmu.",
  },
  {
    icon: FileText,
    title: "Ekspor & Cetak Laporan PDF",
    description:
      "Cetak atau ekspor ringkasan performa finansial bulanan dalam format dokumen eksekutif yang rapi.",
  },
  {
    icon: Download,
    title: "Cadangan JSON Portabel",
    description:
      "Unduh dan pulihkan seluruh riwayat keuanganmu dalam satu berkas JSON kapan saja tanpa batasan.",
  },
];
