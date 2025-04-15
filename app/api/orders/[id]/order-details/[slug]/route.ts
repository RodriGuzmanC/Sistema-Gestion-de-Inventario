import OrderDetailService from '@/features/orders/OrderDetailService.';
import { handleError } from '@/utils/serverUtils';
import { NextResponse } from 'next/server';

export async function GET(
    { params }: { params: { slug: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.slug; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Order detail ID is required' }, { status: 400 });
    }

    try {
        const data = await OrderDetailService.getOne(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}


export async function PUT(
    request: Request,
    { params }: { params: { slug: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.slug; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Order detail ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedOrder = await OrderDetailService.update(parseInt(id), data);
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
    { params }: { params: { slug: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.slug; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Order detail ID is required' }, { status: 400 });
    }

    try {
        const deletedData = await OrderDetailService.delete(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(deletedData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}