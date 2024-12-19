"use client"
import { ProductCard } from '@/app/components/product/ProductCard'
import ProductFilter from '@/app/components/product/ProductFilter';
import ProductService from '@/features/products/ProductService';
import React, { useEffect, useState } from 'react'

const productData = {
  title: "Producto de ejemplo",
  description: "Una descripción breve del producto que se muestra en la tarjeta.",
  unitPrice: 10,
  wholesalePrice: 12,
  remaining: 6,
  imageUrl: "/placeholder.svg"
}

export default function page() {
  const [products, setProducts] = useState<ProductWithBasicRelations[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithBasicRelations[]>([])

  useEffect(() => {
    // Función async dentro del useEffect
    const cargar = async () => {
      try {
        const data = await ProductService.getAll();
        console.log(data); // Verifica los productos obtenidos
        setProducts(data); // Llamamos a la función async
        setFilteredProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    cargar()
  }, []);
  return (
    <div>
      <h1 className='text-2xl font-bold'>Productos</h1>
      <ProductFilter products={products} setProducts={setFilteredProducts}></ProductFilter>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>

        {filteredProducts.map((producto: ProductWithBasicRelations) => (
          <ProductCard product={producto} />
        ))}

      </div>
    </div>
  )
}
