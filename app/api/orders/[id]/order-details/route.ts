import OrderDetailService from '@/features/orders/OrderDetailService.';
import { handleError } from '@/utils/serverUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Busqueda de parametros
    const searchParams = request.nextUrl.searchParams
    const queryPage = searchParams.get('page')
    const pagina = queryPage ? parseInt(queryPage) : 1

    const queryitems = searchParams.get('limit')
    const items = queryitems ? parseInt(queryitems) : 10

    try {
        const order = await OrderDetailService.getAll(parseInt(id), pagina, items);
        // Retornar la respuesta
        return new Response(JSON.stringify(order), {
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
        const newOrder = await OrderDetailService.create(data);
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        return handleError(error)
    }
}
