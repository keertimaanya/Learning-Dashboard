import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use in Client Components (browser).
 *
 * Note: For this project, all data fetching happens in Server Components,
 * so this client may not be used. It's here for future extensibility
 * (e.g., real-time subscriptions, client-side mutations).
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
