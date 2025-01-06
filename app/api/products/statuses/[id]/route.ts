import ProductStatusService from '@/features/products/ProductStatusService';
import { handleError } from '@/utils/serverUtils';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Product Status ID is required' }, { status: 400 });
    }

    try {
        const product = await ProductStatusService.getOne(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(product), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
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
        return NextResponse.json({ error: 'Product Status ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedProduct = await ProductStatusService.update(parseInt(id), data);
        // Retornar la respuesta
        return new Response(JSON.stringify(updatedProduct), {
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
        return NextResponse.json({ error: 'Product Status ID is required' }, { status: 400 });
    }

    try {
        const res = await ProductStatusService.delete(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}