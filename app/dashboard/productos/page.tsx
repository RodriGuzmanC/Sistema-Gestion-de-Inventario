import AddProductForm, { EditProductForm } from '@/app/components/server/add-form-sv';
import ProductCard from '@/app/components/products/ProductCard';
import { createClient, getProducts } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers'


export default async function Page() {

  const cookieStore = cookies();
  const client: SupabaseClient = createClient(cookieStore);

  // Obtener los colores
  const productos = await getProducts(client);
  return (
    <div className='flex flex-col gap-5'>
      {productos?.map((producto) => (
        <ProductCard id={producto.id} title={producto.nombre_producto} createdAt={producto.fecha_creacion} description={producto.descripcion} price_min={producto.precio_unitario} price_max={producto.precio_mayorista}></ProductCard>
      ))}
      
    </div>
  )
}
