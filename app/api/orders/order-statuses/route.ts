'use server'
import OrderStatusService from '@/features/orders/OrderStatusService'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Busqueda de parametros
        const searchParams = request.nextUrl.searchParams
        const queryPage = searchParams.get('page')
        const pagina = queryPage ? parseInt(queryPage) : 1

        const queryitems = searchParams.get('limit')
        const items = queryitems ? parseInt(queryitems) : 10

        // Busqueda
        const data = await OrderStatusService.getAll(pagina, items);
        // Retornar la respuesta
        return new Response(JSON.stringify(data), { 
            status: 200, 
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        // Retornar un error en caso de que algo falle
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
            { 
                status: 500, 
                headers: { "Content-Type": "application/json" } 
            }
        );
    }
    
}
