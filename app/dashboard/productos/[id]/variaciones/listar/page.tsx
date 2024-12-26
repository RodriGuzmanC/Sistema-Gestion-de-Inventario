'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { ProductDetailCard } from "@/app/components/product/ProductDetailCard"
import { VariationCard } from "@/app/components/variation/VariationCard"
import ProductRepository from "@/data/respositories/ProductRepository"
import FilterVariations from "@/app/components/variation/FilterVariations"
import AttributeTypesService from "@/features/attributes/AttributeTypesService"
import ProductService from "@/features/products/ProductService"

type Params = {
    id: string 
}

export default function VariationsList({params} : {params: Params}) {
    const [product, serProduct] = useState<ProductWithFullRelations>()
    const [attributeTypes, setAttributeTypes] = useState<AttributeTypesWithAttributes[]>([])
    const [variations, setVariations] = useState<VariationWithRelations[]>([])
    const [filteredVariations, setFilteredVariations] = useState<VariationWithRelations[]>([])

    const handleEdit = (id: string) => {
        console.log("Edit variation:", id)
        // Implement edit logic
    }

    const handleDelete = (id: string) => {
        console.log("Delete variation:", id)
        // Implement delete logic
    }

    useEffect(() => {
        async function cargarProductoYVariaciones() {
            const res = await ProductService.getOne(parseInt(params.id))
            if (!res) return (<div>Producto no definido</div>)
            serProduct(res)
            setVariations(res.variaciones)
            setFilteredVariations(res.variaciones)
        }
        async function cargarTiposDeAtributos(){
            const res = await AttributeTypesService.getAllWithAttributes()
            setAttributeTypes(res)
        }
        cargarProductoYVariaciones()
        cargarTiposDeAtributos()
    }, [])

    if (product == undefined) return (<div>Producto no definido</div>)

    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-2xl font-bold">Listado de variaciones</h1>

            <ProductDetailCard product={product} />

            <div className="mb-6 flex items-center justify-between gap-4">
                <FilterVariations variations={variations} setVariations={setFilteredVariations} attributeTypes={attributeTypes}  ></FilterVariations>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVariations.map((variation) => (
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
