import OrderService from '@/features/orders/OrderService';
import { handleError } from '@/utils/serverUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        const order = await OrderService.getOne(parseInt(id));
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
        const newOrder = await OrderService.create(data);
        return NextResponse.json(newOrder, { status: 201 });
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
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedOrder = await OrderService.update(parseInt(id), data);
        // Retornar la respuesta
        return new Response(JSON.stringify(updatedOrder), {
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
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        const res = await OrderService.delete(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}