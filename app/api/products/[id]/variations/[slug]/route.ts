import VariationService from '@/features/variations/VariationService';
import { handleError } from '@/utils/serverUtils';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string, slug: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const productId = params.id; // Obtén el id directamente
    const variationId = params.slug // Id de la variacion

    if (!productId || !variationId) {
        return NextResponse.json({ error: 'Product ID and Variation ID are required' }, { status: 400 });
    }

    try {
        const variation = await VariationService.getOne(parseInt(variationId));
        // Retornar la respuesta
        return new Response(JSON.stringify(variation), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}

// Actualizar una variacion por su ID
export async function PUT(
    request: Request,
    { params }: { params: { id: string, slug: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const variationId = params.slug // Id de la variacion

    if (!variationId) {
        return NextResponse.json({ error: 'Variation ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedProduct = await VariationService.update(parseInt(variationId), data);
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
    { params }: { params: { slug: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const variationId = params.slug; // Obtén el id directamente

    if (!variationId) {
        return NextResponse.json({ error: 'Variation ID is required' }, { status: 400 });
    }

    try {
        const res = await VariationService.delete(parseInt(variationId));
        // Retornar la respuesta
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}