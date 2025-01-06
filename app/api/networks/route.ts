'use server'
import SocialNetworkService from "@/features/networks/SocialNetworkService";
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

        // Busqueda
        const data = await SocialNetworkService.getAll(pagina, items);
        // Retornar
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


export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const newData = await SocialNetworkService.create(data);
        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        return handleError(error)
    }
}