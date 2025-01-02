import ProductService from '@/features/products/ProductService';
import { handleError } from '@/utils/serverUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } } // Asegúrate de que el parámetro sea 'id'
  ) {
    const id = params.id; // Obtén el id directamente

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const product = await ProductService.getOne(parseInt(id));
        // Retornar la respuesta
        return new Response(JSON.stringify(product), { 
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
        const newProduct = await ProductService.create(data);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return handleError(error)
    }
}

export async function PUT(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const updatedProduct = await ProductService.update(parseInt(id), data);
        // Retornar la respuesta
        return new Response(JSON.stringify(updatedProduct), { 
            status: 200, 
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return handleError(error)
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        await ProductService.delete(parseInt(id));
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return handleError(error)
    }
}