import OrderStatusService from '@/features/orders/OrderStatusService';
import { handleError } from '@/utils/serverUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Order Status ID is required' }, { status: 400 });
    }

    try {
        const data = await OrderStatusService.getOne(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(data), {
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
        const newOrderStatus = await OrderStatusService.create(data);
        return NextResponse.json(newOrderStatus, { status: 201 });
    } catch (error) {
        return handleError(error)
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Order Status ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedOrderStatus = await OrderStatusService.update(parseInt(id), data);
        // Retornar la respuesta
        return new Response(JSON.stringify(updatedOrderStatus), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Order Status ID is required' }, { status: 400 });
    }

    try {
        const deletedData = await OrderStatusService.delete(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(deletedData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}