import CategoryProductService from '@/features/products/CategoryProductService';
import { handleError } from '@/utils/serverUtils';
import { NextResponse } from 'next/server';

export async function GET(
    { params }: { params: { id: string, slug: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const productId = params.id; // Obtén el id directamente
    const categoryId = params.slug // Id de la variacion

    if (!productId || !categoryId) {
        return NextResponse.json({ error: 'Product ID and Category Product ID are required' }, { status: 400 });
    }

    try {
        const data = await CategoryProductService.getOne(parseInt(categoryId));
        // Retornar la respuesta
        return new Response(JSON.stringify(data), {
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
    const categoryId = params.slug // Id de la variacion

    if (!categoryId) {
        return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedData = await CategoryProductService.update(parseInt(categoryId), data);
        // Retornar la respuesta
        return new Response(JSON.stringify(updatedData), {
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
    const categoryId = params.slug; // Obtén el id directamente

    if (!categoryId) {
        return NextResponse.json({ error: 'Category product ID is required' }, { status: 400 });
    }

    try {
        const res = await CategoryProductService.delete(parseInt(categoryId));
        // Retornar la respuesta
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}