"use client"
import { CustomLoader } from '@/app/components/Loader';
import { ProductCard } from '@/app/components/product/ProductCard'
import ProductFilter from '@/app/components/product/ProductFilter';
import { ProductCardSkeleton } from '@/app/components/skeletons/ProductSkeleton';
import ProductService from '@/features/products/ProductService';
import { apiRequest } from '@/utils/utils';
import React, { Suspense, useEffect, useState } from 'react'
import useSWR from 'swr';

const productData = {
  title: "Producto de ejemplo",
  description: "Una descripción breve del producto que se muestra en la tarjeta.",
  unitPrice: 10,
  wholesalePrice: 12,
  remaining: 6,
  imageUrl: "/placeholder.svg"
}

export default function page() {
  const [filteredProducts, setFilteredProducts] = useState<ProductWithBasicRelations[]>([])
  
  const { data: products, error, isLoading } = useSWR<PaginatedResponse<ProductWithFullRelations>>
  ('dashboard/productos', () => {
    return apiRequest({ url: 'products', method: 'GET' });
  }, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  useEffect(() => {
    if (products) {
      setFilteredProducts(products.data)
    }
  }, [products])

  if (isLoading || products === undefined) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }
  return (
    <div>
      <h1 className='text-2xl font-bold'>Prendas</h1>
      <ProductFilter products={products.data} setProducts={setFilteredProducts}></ProductFilter>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
          {filteredProducts.map((producto: ProductWithBasicRelations) => (
            <ProductCard product={producto} />
          ))}

      </div>
    </div>
  )
}
