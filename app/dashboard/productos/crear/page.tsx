import { createProduct } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { productSchema } from '@/utils/validation/schemas';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label';
import { ArrowLeft, Package, FileText, DollarSign, BarChart2 } from 'lucide-react'


async function handleSubmit(formData: FormData) {
    "use server";  // Indica a Next.js que esta es una función del servidor

    const cookieStore = cookies();
    const client = createClient(cookieStore);
    const formEntries = Object.fromEntries(formData.entries()); // Convertir el formData a un objeto


    const productDataFormater = {
        nombre_producto: formEntries.title,
        descripcion: formEntries.description,
        precio_unitario: formEntries.price_min,
        precio_mayorista: formEntries.price_max,
        estado_producto_id: formEntries.estado,
    };

    const productData = productSchema.parse(productDataFormater)

    console.log(productData)
    // Llamada a la función del servidor
    const product = await createProduct(client, productData);

}

export default async function AddProductForm() {
    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col items-start mb-6">
                <Button variant="link" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
                <h1 className="text-2xl font-bold">Crear nuevo producto</h1>
            </div>
            <form action={handleSubmit} className="space-y-6 max-w-md">
                <div className="space-y-2">
                    <Label htmlFor="title">Nombre</Label>
                    <div className="relative">
                        <Package className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input id="title" name="title" required className="pl-8" placeholder="Nombre del producto" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <div className="relative">
                        <FileText className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input id="description" name="description" required className="pl-8" placeholder="Descripción del producto" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price_min">Precio minorista</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input id="price_min" name="price_min" type="number" required className="pl-8" placeholder="0.00" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price_max">Precio mayorista</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input id="price_max" name="price_max" type="number" required className="pl-8" placeholder="0.00" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <div className="relative">
                        <BarChart2 className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                        <Select name="estado" defaultValue="1">
                            <SelectTrigger id="estado" className="pl-8">
                                <SelectValue placeholder="Seleccione un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">En proceso</SelectItem>
                                <SelectItem value="2">Acabado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button type="submit" className="w-full">Crear producto</Button>
            </form>
        </div>
    );
}