import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/types/database.types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if Supabase is properly configured
  const isConfigured = 
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith("http") && 
    !supabaseUrl.includes("placeholder");

  if (!isConfigured) {
    console.warn("Supabase is not configured. Running in demo mode.");
    // Return a mock client that won't throw errors
    return null as any;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
