'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from 'lucide-react'
import { ProductDetailCard } from "@/app/components/product/ProductDetailCard"
import FilterVariations from "@/app/components/variation/FilterVariations"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiRequest } from "@/utils/utils"
import { swrSettings } from "@/utils/swr/settings"
import useSWR from "swr"
import ErrorPage from "@/app/components/global/skeletons/ErrorPage"
import { Skeleton } from "@/components/ui/skeleton"
import { EditVariationModal } from "@/app/components/variation/EditVariationModal"

type Params = {
    id: string
}

export default function VariationsList({ params }: { params: Params }) {

    const [filteredVariations, setFilteredVariations] = useState<VariationWithRelations[]>([])

    const handleEdit = (id: string) => {
        console.log("Edit variation:", id)
        // Implement edit logic
    }

    const handleDelete = (id: string) => {
        console.log("Delete variation:", id)
        // Llamado a la api
        try {
            apiRequest({url: `products/1/variations/${id}`, method: 'DELETE'})
            console.log("Se elimino bien")
        } catch (error) {
            console.log("No se elimino")
        }        
    }

    // Cargar producto
    const { data: product, error, isLoading } = useSWR<DataResponse<ProductWithFullRelations>>('product', () => apiRequest({url: 'products/' + params.id}), swrSettings)

       // Actualizar filteredVariations cuando product cambie
useEffect(() => {
    if (product) {
      setFilteredVariations(product.data.variaciones);  // Establecer las variaciones
    }
  }, [product]);  // Dependencia en "product"
  
    // Cargar tipos de atributos
    const { data: attributeTypes, error: attributeTypesError, isLoading: attributeTypesLoading } = useSWR<PaginatedResponse<AttributeTypesWithAttributes>>('attribute-types', () => apiRequest({url: 'products/attributes-types/'}), swrSettings)

    // Si hay error, mostrar página de error    
    if (error || attributeTypesError) return (<ErrorPage />)

    // Si hay loading, mostrar skeleton
    if (isLoading || attributeTypesLoading) return (<Skeleton />)

    // Si no hay producto o tipos de atributos, mostrar skeleton
    if (!product || !attributeTypes) return (<Skeleton />)


 

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(price)
    }

    const getFullProductName = (variation: VariationWithRelations) => {
        if (!product) return ""

        const attributes = variation.variaciones_atributos
            .map(va => `${va.atributos.tipos_atributos.nombre} ${va.atributos.valor}`)
            .join(" ")

        return `${product.data.nombre_producto} ${attributes}`
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-2xl font-bold">Listado de variaciones</h1>

            <ProductDetailCard product={product.data} />

            <div className="mb-6 flex items-center justify-between gap-4">
                <FilterVariations
                    variations={product.data.variaciones}
                    setVariations={setFilteredVariations}
                    attributeTypes={attributeTypes?.data}
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[400px]">Nombre</TableHead>
                            <TableHead>Precio unitario</TableHead>
                            <TableHead>Precio mayorista</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredVariations.map((variation) => (
                            <TableRow key={variation.id}>
                                <TableCell className="font-medium">
                                    {getFullProductName(variation)}
                                </TableCell>
                                <TableCell>{formatPrice(variation.precio_unitario)}</TableCell>
                                <TableCell>{formatPrice(variation.precio_mayorista)}</TableCell>
                                <TableCell>{variation.stock}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-col justify-center gap-2">
                                        <EditVariationModal variationObj={variation} attributeTypes={attributeTypes.data} key={variation.id} ></EditVariationModal>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => handleDelete(variation.id.toString())}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


        </div>
    )
}

