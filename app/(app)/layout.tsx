import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import AppHeader from "@/components/layout/AppHeader";
import AppBottomNav from "@/components/layout/AppBottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUser();

  if (!profile) {
    redirect("/welcome");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-white">
      {/* Top Floating Glass Navigation Header (Stitch Style) */}
      <AppHeader user={profile} />

      {/* Main Content Area */}
      <main className="w-full pt-18 sm:pt-20 pb-24 md:pb-12 flex-1">
        <div className="max-w-[1600px] 2xl:max-w-[1780px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <AppBottomNav />
    </div>
  );
}
