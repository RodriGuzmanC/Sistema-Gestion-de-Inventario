import { SupabaseClient } from "@supabase/supabase-js";

// Manejar errores personalizados
export function handleError(error: any): Response {

    // Si es un error normal (Error nativo de JS)
    if (error instanceof Error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
    // Si el error no es un tipo conocido, puedes manejarlo como un error desconocido
    return new Response(
        JSON.stringify({ error: "Unknown error occurred" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
    );
}

export async function makePagination<T>(client: SupabaseClient, data: T[], table: string, pages: number, itemsPerPage: number): Promise<PaginatedResponse<T>> {
    // Obtener el total de items
    const { count: totalItems } = await client
        .from(table)
        .select('*', { count: 'exact' }); // Esto obtiene solo el total sin traer los registros completos
    if (!totalItems){
        throw new Error(`${table} not found`); 
    }
    // Calcular el total de páginas
    const totalPaginas = Math.ceil(totalItems / itemsPerPage);

    // Garantizar que `data` sea un array
    const validData = Array.isArray(data) ? data : [];

    const paginatedData: PaginatedResponse<T> = {
        data: validData || [],
        paginacion: {
            pagina_actual: pages,
            total_items: totalItems,
            items_por_pagina: itemsPerPage,
            total_paginas: totalPaginas,
        },
    };

    return paginatedData;
}