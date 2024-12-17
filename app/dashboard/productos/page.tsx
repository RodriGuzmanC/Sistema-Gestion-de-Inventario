"use client"
import { ProductCard } from '@/app/components/product/ProductCard'
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

    useEffect(() => {
        // Función async dentro del useEffect
        const handler = async () => {
          try {
            const data = await ProductService.getAll();
            console.log(data); // Verifica los productos obtenidos
            setProducts(data); // Llamamos a la función async
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
        handler()
      }, []);
    return (
        <div className='grid grid-cols-3'>
            {products.map((producto: ProductWithBasicRelations)=>(
                <ProductCard product={producto} />
            ))}

        </div>
    )
}
