// src/lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is OPTIONAL.
 * If env vars are missing (Netlify, static deploy),
 * the app will NOT crash.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
