import crypto from 'crypto';
import { handleError } from '@/utils/serverUtils';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No se envió ninguna imagen' }, { status: 400 });
        }

        // Convertir el File en un buffer
        const bytes = await file.arrayBuffer();
        // Crear un Blob a partir del ArrayBuffer
        const blob = new Blob([bytes], { type: file.type });

        // Preparar el formData que Cloudinary espera
        const cloudinaryForm = new FormData();
        cloudinaryForm.append('file', blob, file.name);
        cloudinaryForm.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!);

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
        const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: cloudinaryForm,
            }
        );

        const result = await cloudinaryRes.json();
        console.log(result);
        return NextResponse.json(result, { status: cloudinaryRes.status });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
    }
}
/*export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { public_id } = body;

        const timestamp = Math.floor(Date.now() / 1000);
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.NEXT_BACKEND_API_SECRET;

        const stringToSign = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

        const formData = new URLSearchParams();
        formData.append('public_id', public_id);
        formData.append('resource_type', 'image')
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey!);
        formData.append('signature', signature);

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        const result = await cloudinaryRes.json();

        return NextResponse.json(result, { status: cloudinaryRes.status });
    } catch (error) {
        return handleError(error)
    }
}*/