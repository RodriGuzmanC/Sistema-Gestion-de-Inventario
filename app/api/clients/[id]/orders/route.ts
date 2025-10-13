import OrderService from '@/features/orders/OrderService';
import { handleError } from '@/utils/serverUtils';
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const searchParams = request.nextUrl.searchParams
    const queryState = searchParams.get('orderStateId')
    if (!queryState) {
        return NextResponse.json({ error: 'State ID is required' }, { status: 400 });
    }
    const orderState = queryState ? parseInt(queryState) : 1 // Por defecto "Por pagar"

    const queryStartDate = searchParams.get('startDate')
    if (!queryStartDate) {
        return NextResponse.json({ error: 'startDate is required' }, { status: 400 });
    }

    const queryEndDate = searchParams.get('endDate')
    if (!queryEndDate) {
        return NextResponse.json({ error: 'endDate is required' }, { status: 400 });
    }

    const queryOrderCategory = searchParams.get('orderCategory')
    if (!queryOrderCategory) {
        return NextResponse.json({ error: 'orderCategoryId is required' }, { status: 400 });
    }

    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    try {
        const data = await OrderService.getAllByDateAndClient(orderState, queryStartDate, queryEndDate, queryOrderCategory, parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}
