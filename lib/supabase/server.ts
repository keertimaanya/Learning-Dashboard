import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use in Server Components.
 *
 * Why a separate server client?
 * - Server Components run on the server, so we can safely use env variables
 *   without exposing them to the browser bundle.
 * - This client is used ONLY in `app/page.tsx` for data fetching.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Check your .env.local file."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
