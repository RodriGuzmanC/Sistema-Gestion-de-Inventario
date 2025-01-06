'use server'
import ProductStatusService from "@/features/products/ProductStatusService";
import { handleError } from "@/utils/serverUtils";
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Busqueda de parametros
        const searchParams = request.nextUrl.searchParams
        const queryPage = searchParams.get('page')
        const pagina = queryPage ? parseInt(queryPage) : 1

        const queryitems = searchParams.get('limit')
        const items = queryitems ? parseInt(queryitems) : 10

        // Busqueda de productos
        const products = await ProductStatusService.getAll(pagina, items);
        // Retornar la respuesta
        return new Response(JSON.stringify(products), { 
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


export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const newProduct = await ProductStatusService.create(data);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return handleError(error)
    }
}