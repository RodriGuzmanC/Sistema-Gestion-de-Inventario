'use server'
import ProductService from "@/features/products/ProductService";
import VariationAttributeService from "@/features/variations/VariationAttributeService";
import VariationService from "@/features/variations/VariationService";
import { handleError } from "@/utils/serverUtils";
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest,
    { params }: { params: { id: string, slug: string } }) {
    try {
        // Parametros
        const productId = parseInt(params.id)
        const variationId = parseInt(params.slug)
        // Busqueda de parametros
        const searchParams = request.nextUrl.searchParams
        const queryPage = searchParams.get('page')
        const pagina = queryPage ? parseInt(queryPage) : 1

        const queryitems = searchParams.get('limit')
        const items = queryitems ? parseInt(queryitems) : 10

        // Comprueba que el producto de la variacion exista
        const product = await ProductService.getOne(productId);

        // Busqueda de los atributos de la variacion
        const attributes = await VariationAttributeService.getAllByVariation(variationId, pagina, items);
        // Retornar la respuesta
        return new Response(JSON.stringify(attributes), { 
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


export async function POST(request: NextRequest, { params }: { params: { id: string, slug: string } }) {
    try {
        // Parametros
        const productId = parseInt(params.id)
        const variationId = parseInt(params.slug)

        const data = await request.json();
        // Comprueba que el producto de la variacion exista
        const product = await ProductService.getOne(productId);
        // Comprueba que la varacion exista
        const variation = await VariationService.getOne(variationId)

        // Crea el nuevo atributo de la variacion
        const newVariationAttribute = await VariationAttributeService.create(data);
        return NextResponse.json(newVariationAttribute, { status: 201 });
    } catch (error) {
        return handleError(error)
    }
}