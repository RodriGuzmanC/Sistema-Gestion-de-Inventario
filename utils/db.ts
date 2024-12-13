// utils/db.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Crear cliente de Supabase para el servidor
const createSupabaseServerClient = () => {
    const cookieStore = cookies(); // Obtener cookies del servidor

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        }
    );
};

export default createSupabaseServerClient;

