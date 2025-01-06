import ClientService from '@/features/client/ClientService';
import { handleError } from '@/utils/serverUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    try {
        const data = await ClientService.getOne(parseInt(id));
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
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedData = await ClientService.update(parseInt(id), data);
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
    request: Request,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    try {
        const deletedData = await ClientService.delete(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(deletedData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}