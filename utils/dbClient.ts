// utils/dbClient.ts
import { createClient } from "@supabase/supabase-js";

// Crear cliente de Supabase para el navegador


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Crear cliente global una sola vez
const createSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
export default createSupabaseClient;
