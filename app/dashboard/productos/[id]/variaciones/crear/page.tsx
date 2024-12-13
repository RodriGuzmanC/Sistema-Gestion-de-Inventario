import { cookies } from 'next/headers'
import { createClient, getValueAttributes } from '@/utils/supabase/server'
import { variationSchema } from '@/utils/validation/schemas'
import CreateProductVariation from './client'


// Server


export async function handleSubmitVariation (id: string, formData: FormData) {

    const cookieStore = cookies();
    const client = createClient(cookieStore);
    const formEntries = Object.fromEntries(formData.entries());

    const variationDataFormater = {
        producto_id: id,
        precio_unitario: formEntries.min_price,
        precio_mayorista: formEntries.max_price,
        stock: formEntries.stock,
    };

    const variationData = variationSchema.parse(variationDataFormater)

    console.log(variationData)

}

export async function getTodoValAtributos (atributoId: number) {
    const cookieStore = cookies();
    const client = createClient(cookieStore);
    const product = await getValueAttributes(client, atributoId);
    return product
}



export default async function page({ params }: { params: { id: string } }) {

    const valoresAtributos = await getTodoValAtributos(1)
    const { id } = params;
    
    return (
        <CreateProductVariation params={params} valoresAtributos={valoresAtributos} />
    );
}