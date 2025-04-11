import CategoryProductService from '@/features/products/CategoryProductService';
import { handleError } from '@/utils/serverUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Busqueda de parametros
    const searchParams = request.nextUrl.searchParams
    const queryPage = searchParams.get('page')
    const pagina = queryPage ? parseInt(queryPage) : 1

    const queryitems = searchParams.get('limit')
    const items = queryitems ? parseInt(queryitems) : 10


    try {
        const product = await CategoryProductService.getAllCategoriesProduct(parseInt(id), pagina, items);
        // Retornar la respuesta
        return new Response(JSON.stringify(product), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const newData = await CategoryProductService.create(data);
        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        return handleError(error)
    }
}