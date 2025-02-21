import VariationAttributeService from '@/features/variations/VariationAttributeService';
import VariationService from '@/features/variations/VariationService';
import { handleError } from '@/utils/serverUtils';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string, slug: string, attr: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const productId = params.id; // Obtén el id directamente
    const variationId = params.slug // Id de la variacion
    const attributeId = params.attr // Id de el atributo

    if (!productId || !variationId || !attributeId) {
        return NextResponse.json({ error: 'Product ID, Variation ID and Attribute ID are required' }, { status: 400 });
    }

    try {
        const variationAttribute = await VariationAttributeService.getOne(parseInt(attributeId));
        // Retornar la respuesta
        return new Response(JSON.stringify(variationAttribute), {
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
    { params }: { params: { id: string, slug: string, attr: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const productId = params.id; // Obtén el id directamente
    const variationId = params.slug // Id de la variacion
    const attributeId = params.attr // Id de el atributo

    if (!productId || !variationId || !attributeId) {
        return NextResponse.json({ error: 'Product ID, Variation ID and Attribute ID are required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedVariationAttribute = await VariationAttributeService.update(parseInt(attributeId), data);
        // Retornar la respuesta
        return new Response(JSON.stringify(updatedVariationAttribute), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string, slug: string, attr: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const productId = params.id; // Obtén el id directamente
    const variationId = params.slug // Id de la variacion
    const attributeId = params.attr // Id de el atributo

    if (!productId || !variationId || !attributeId) {
        return NextResponse.json({ error: 'Product ID, Variation ID and Attribute ID are required' }, { status: 400 });
    }

    try {
        const res = await VariationAttributeService.delete(parseInt(attributeId));
        // Retornar la respuesta
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}