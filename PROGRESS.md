# 🪙 KitaKaya — Master Progress & Roadmap Tracker

> **Panduan:** Buka file ini setiap kali mulai coding. File ini mencatat progres terstruktur dari PRD KitaKaya & Stitch Design System agar pengembangan dapat dilanjutkan kapan saja tanpa kendala.

---

## 📋 Tech Stack Reference
| Layer | Teknologi | Status |
|---|---|---|
| Framework | **Next.js 14 (App Router)** + TypeScript | ✅ Terpasang & Type-Safe |
| Styling | **Tailwind CSS** (Apple Editorial Minimalist Theme — Stitch) | ✅ Terpasang & Synced |
| Database & Auth | **Supabase** (PostgreSQL + RLS + Passwordless Magic Link) | ✅ Live Connected |
| AI Integration | **Google Gemini AI SDK** (`@google/generative-ai`, Omnibar NLP) | ✅ Active Pipeline |
| Icons & Visuals | **Lucide React**, **Recharts**, **Sonner** | ✅ Terpasang |
| PDF & Export | **@react-pdf/renderer** | ✅ Terpasang |

---

## 🗺️ Fitur & Screen Hasil Sinkronisasi Stitch

### 🟢 1. Dashboard Finansial (Selesai ✅)
- [x] Top Floating Header dengan Navigasi Pill & Status Akun PRO
- [x] Sapaan editorial dengan badge tanggal real-time & watermark **"KAYA"**
- [x] Master Wealth Hero Card: Total Saldo Bersih, Arus Kas Masuk/Keluar, & Rasio Tabungan 50/30/20
- [x] 3-Kolom Kantong Tabungan dengan track progres Apple-style
- [x] Grafik Arus Kas 7 Hari Terakhir & Tabel Transaksi Terkini

### 🟢 2. Transaksi & Natural Language AI Omnibar (Selesai ✅)
- [x] Watermark **"CATAT"**
- [x] AI Omnibar: Input kalimat alami (cth: *"Beli kopi 25rb pakai Gopay"*) -> Auto-parse ke JSON (Kategori, Tipe, Nominal) oleh Gemini 1.5 Flash
- [x] Kartu Live Feedback *AI Structured Entity* dengan estimasi latency & tombol konfirmasi simpan
- [x] Mode Toggle: Input Natural AI vs Input Manual
- [x] Filter transaksi, pencarian instan, dan aksi hapus/edit

### 🟢 3. Login & Autentikasi Passwordless (Selesai ✅)
- [x] Watermark **"MASUK"**
- [x] Form Magic Link Supabase E2E Enkripsi 256-Bit
- [x] Login Alternatif via Password & Social OIDC (Google, Apple ID)
- [x] 3 Pilar Keamanan: *Tanpa Kata Sandi*, *Verifikasi 10 Menit*, *Terenkripsi 256-Bit*

### 🟢 4. Kantong Tabungan & Alokasi Impian (Selesai ✅)
- [x] Ringkasan akumulasi seluruh pos tabungan vs target
- [x] Modal buat target baru & modal setor tabungan
- [x] Sinkronisasi otomatis ke buku kas transaksi

### 🟢 5. Laporan Bulanan Otomatis PDF & Resend Engine (Selesai ✅)
- [x] Container Pratinjau Dokumen A4 Apple-Editorial
- [x] Rangkuman status kesehatan keuangan (Superior 92/100, Tier A+)
- [x] Tabel perbandingan *Anggaran vs Realisasi* per kategori
- [x] Sintesis AI Finansial Gemini (Disiplin Anggaran, Kinerja Kas, Rekomendasi)
- [x] Panel Telemetri Pengiriman Email Resend & Konfigurasi Frekuensi Cron

---

## ⚙️ Petunjuk Menjalankan Proyek
1. Dev server otomatis berjalan di background:
   ```bash
   npm run dev
   ```
2. Buka di browser: [http://localhost:3000](http://localhost:3000)
