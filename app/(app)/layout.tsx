import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/layout/AppHeader";
import AppBottomNav from "@/components/layout/AppBottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-white">
      {/* Top Floating Glass Navigation Header (Stitch Style) */}
      <AppHeader user={profile} />

      {/* Main Content Area */}
      <main className="w-full pt-20 pb-20 md:pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <AppBottomNav />
    </div>
  );
}
