'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { ProductDetailCard } from "@/app/components/product/ProductDetailCard"
import { VariationCard } from "@/app/components/variation/VariationCard"
import ProductRepository from "@/data/respositories/ProductRepository"

type Params = {
    id: string 
}

export default function VariationsList({params} : {params: Params}) {
    const [product, serProduct] = useState<ProductWithFullRelations>()
    const handleEdit = (id: string) => {
        console.log("Edit variation:", id)
        // Implement edit logic
    }

    const handleDelete = (id: string) => {
        console.log("Delete variation:", id)
        // Implement delete logic
    }

    useEffect(() => {
        async function cargar() {
            const res = await ProductRepository.getProductWithRelations(parseInt(params.id))
            console.log(res)
            serProduct(res)
        }
        cargar()
    })

    if (product == undefined) return (<div>Producto no definido</div>)
    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-2xl font-bold">Listado de variaciones</h1>

            <ProductDetailCard product={product} />

            <div className="mb-6 flex items-center justify-between gap-4">
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {product?.variaciones.map((variation) => (
                    <VariationCard
                        key={variation.id}
                        variation={variation}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    )
}

