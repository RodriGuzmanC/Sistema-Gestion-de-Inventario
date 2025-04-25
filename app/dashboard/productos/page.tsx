"use client"
import NotFound from '@/app/components/global/skeletons/NotFound';
import { ProductCard } from '@/app/components/product/ProductCard'
import ProductFilter from '@/app/components/product/ProductFilter';
import { swrSettings } from '@/utils/swr/settings';
import { apiRequest } from '@/utils/utils';
import { useEffect, useState } from 'react';
import useSWR from 'swr';


export default function page() {
  const [filteredProducts, setFilteredProducts] = useState<ProductWithBasicRelations[]>([])

  const { data: products, error, isLoading, mutate } = useSWR<PaginatedResponse<ProductWithBasicRelations>>
    ('products', () => {
      return apiRequest({ url: 'products', method: 'GET' });
    }, swrSettings);

  // Carga los datos para el filtro
  useEffect(() => {
    if (products?.data) {
      setFilteredProducts(products.data);
    }
  }, [products]);

  if (isLoading || !products) {
    return (<div className=''>Cargando..</div>
    )
  }
  if (error || products.error) {
    return <div>Error: {error ?? products.error}</div>
  }

  if (products.data === undefined || products.data.length === 0) {
    return <NotFound itemName='Productos' description='Parece que aun no haz creado ningun producto' createLink='/dashboard/productos/crear'></NotFound>

  }


  return (
    <div>
      <h1 className='text-2xl font-bold'>Prendas</h1>
      <ProductFilter products={products.data} setProducts={setFilteredProducts}></ProductFilter>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No se encontraron productos que coincidan con tu búsqueda.
          </div>
        ) : (
          filteredProducts.map((producto: ProductWithBasicRelations) => (
            <ProductCard key={producto.id} product={producto} mutate={mutate}/>
          ))
        )}

      </div>
    </div>
  )
}
