import AttributeService from '@/features/attributes/AttributeService';
import { handleError } from '@/utils/serverUtils';
import { NextResponse } from 'next/server';

export async function GET(
    _request: Request,
    { params }: { params: { slug: string } } // Asegúrate de que el parámetro sea 'slug'
) {
    const slug = parseInt(params.slug); // Obtén el slug directamente

    if (!slug || isNaN(slug)) {
        // Verifica si el sluug es un numero valido
        return NextResponse.json({ error: 'Attribute ID is required' }, { status: 400 });
    }

    try {
        const data = await AttributeService.getOne(slug);
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
    { params }: { params: { slug: string } } // Asegúrate de que el parámetro sea 'slug'
) {
    const slug = parseInt(params.slug); // Obtén el slug directamente

    if (!slug || isNaN(slug)) {
        return NextResponse.json({ error: 'Attribute ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedData = await AttributeService.update(slug, data);
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
    _request: Request,
    { params }: { params: { slug: string } } // Asegúrate de que el parámetro sea 'slug'
) {
    const slug = parseInt(params.slug); // Obtén el slug directamente

    if (!slug) {
        return NextResponse.json({ error: 'Attribute slug is required' }, { status: 400 });
    }

    try {
        const res = await AttributeService.delete(slug);
        // Retornar la respuesta
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}