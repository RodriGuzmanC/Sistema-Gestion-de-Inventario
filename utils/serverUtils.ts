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

/**
 * 
 * @param client El cliente usado para acceder a la base de datos, puede ser cualquier servicio como SUPABASE, FIREBASE, ETC.
 * @param data Son los registros que seran contados en total. Los datos no son modificados, solo son retornados
 * @param table El nombre de la tabla en base de datos de la cual se contara el total de items.
 * @param page La pagina a la que se quiere acceder
 * @param itemsPerPage La cantidad de items que se retornaran por pagina
 * @param fieldName El nombre de la fila en la tabla de base de datos para hacer una consulta WHERE y contar el numero total de items.
 * @param fieldValue Ejemplo: el id del producto del cual quiero obtener todas ss variaciones
 * @returns 
 */
export async function makePagination<T>(
    client: SupabaseClient, 
    data: T[], 
    table: string, 
    page: number, 
    itemsPerPage: number,
    fieldName?: string,
    fieldValue?: any
): Promise<PaginatedResponse<T>> {

    let totalItems
    // Verifica si se requiere hacer un WHERE en la consulta SQL
    if(fieldName && fieldValue){
        // Obtener el total de items usando una clausula where
        const { count } = await client
        .from(table)
        .select('*', { count: 'exact' })
        .eq(fieldName, fieldValue);

        totalItems = count
    } else{
        // Obtener el total de items
        const { count } = await client
        .from(table)
        .select('*', { count: 'exact' });

        totalItems = count
    }
    
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
            pagina_actual: page,
            total_items: totalItems,
            items_por_pagina: itemsPerPage,
            total_paginas: totalPaginas,
        },
    };

    return paginatedData;
}
