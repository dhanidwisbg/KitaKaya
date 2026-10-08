import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#faf9fe",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["500", "600", "700", "800"],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "KitaKaya — Catat Keuangan, Tumbuh Bersama",
    template: "%s | KitaKaya",
  },
  description:
    "Aplikasi pencatatan keuangan cerdas dengan AI assistant untuk membantu kamu mencapai kebebasan finansial.",
  keywords: ["keuangan", "tabungan", "budgeting", "AI", "finansial", "Indonesia"],
  authors: [{ name: "KitaKaya" }],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "KitaKaya — Catat Keuangan Pribadi & Kantong Tabungan",
    description:
      "Aplikasi pencatatan keuangan pribadi dan kantong tabungan yang berjalan 100% di browser Anda.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                "glass squircle border-0 shadow-apple-md text-foreground font-medium text-sm",
              success: "!text-income",
              error: "!text-expense",
            },
          }}
        />
      </body>
    </html>
  );
}
