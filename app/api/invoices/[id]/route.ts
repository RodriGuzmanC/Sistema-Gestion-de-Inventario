import InvoiceService from '@/features/invoices/InvoiceService';
import { handleError } from '@/utils/serverUtils';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Social Network ID is required' }, { status: 400 });
    }

    try {
        const data = await InvoiceService.getOne(parseInt(id));
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
        return NextResponse.json({ error: 'Social Network ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedData = await InvoiceService.update(parseInt(id), data);
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
        return NextResponse.json({ error: 'Social Network ID is required' }, { status: 400 });
    }

    try {
        const deleteData = await InvoiceService.delete(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(deleteData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}