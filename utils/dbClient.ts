// utils/dbClient.ts
import { createClient } from "@supabase/supabase-js";

// Crear cliente de Supabase para el navegador
const createSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export default createSupabaseClient;
