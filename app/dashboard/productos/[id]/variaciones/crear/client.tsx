'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from 'lucide-react'
import { getValoresAtributos, handleSubmitVariation } from './server'
import { getValueAttributes } from '@/utils/supabase/server'


// Server

async function handleSubmit(event: React.FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault(); // Prevenir la recarga de la página por defecto

    const formData = new FormData(event.currentTarget);
    await handleSubmitVariation(id, formData)
}


// CLIENT

// Ejemplo de producto
const product = {
    name: "Camiseta Básica",
    image: "/placeholder.svg"
}

// Tipos de atributos disponibles
const attributeTypes = ["Color", "Talla", "Tela"]

interface AttributeTypes {
    Color: string[];
    Talla: string[];
    Tela: string[];
}

// Valores de ejemplo para los atributos
const attributeValues: AttributeTypes = {
    Color: ["Rojo", "Verde", "Azul"],
    Talla: ["S", "M", "L", "XL"],
    Tela: ["Algodón", "Poliéster", "Mezcla"]
}

interface attributesProps {
    type: string,
    value: string,
}

interface updateAttProps {
    index: number,
    field: string,
    value: string,
}

interface CreateProductVariationProps {
    params: {
        id: string;
    };
}



export default function CreateProductVariation({ params, valoresAtributos }: { params: { id: string }, valoresAtributos: any[] }) {
    const [attributes, setAttributes] = useState<attributesProps[]>([])

    const addAttribute = () => {
        setAttributes([...attributes, { type: '', value: '' }])
    }

    const removeAttribute = (index: number) => {
        const newAttributes = attributes.filter((_, i) => i !== index)
        setAttributes(newAttributes)
    }

    const updateAttribute = (index: number, field: keyof attributesProps, value: string) => {
        const newAttributes = [...attributes]
        newAttributes[index][field] = value
        setAttributes(newAttributes)
    }

    const { id } = params;
    return (
        <div className="container mx-auto px-4 py-8">
            {valoresAtributos?.map((value) => (
                <div>{value.valor}</div>
            ))}
            <h1 className="text-2xl font-bold mb-6">Crear Variación de Producto</h1>
            <form onSubmit={(e) => handleSubmit(e, id)} className="space-y-6 max-w-2xl">
                <Card>
                    <CardContent className="flex items-center space-x-4 p-4">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="rounded-md"
                        />
                        <div>
                            <h2 className="text-lg font-semibold">{product.name}</h2>
                            <p className="text-sm text-gray-500">Producto seleccionado</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="min_price">Precio Unitario</Label>
                        <Input id="min_price" name="min_price" type="number" step="0.01" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="max_price">Precio Mayorista</Label>
                        <Input id="max_price" name="max_price" type="number" step="0.01" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" name="stock" type="number" required />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Atributos</Label>
                        <Button type="button" onClick={addAttribute} variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar atributo
                        </Button>
                    </div>
                    {attributes.map((attr, index) => (
                        <div key={index} className="flex space-x-2 items-end">
                            <div className="flex-1">
                                <Label htmlFor={`attrType-${index}`}>Tipo</Label>
                                <Select
                                    value={attr.type}
                                    onValueChange={(value) => updateAttribute(index, 'type', value)}
                                >
                                    <SelectTrigger id={`attrType-${index}`}>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {attributeTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <Label htmlFor={`attrValue-${index}`}>Valor</Label>
                                <Select
                                    value={attr.value}
                                    onValueChange={(value) => updateAttribute(index, 'value', value)}
                                >
                                    <SelectTrigger id={`attrValue-${index}`}>
                                        <SelectValue placeholder="Seleccionar valor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {attr.type && attributeValues[attr.type as keyof AttributeTypes].map((value) => (
                                            <SelectItem key={value} value={value}>{value}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="button" onClick={() => removeAttribute(index)} variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button type="submit" className="w-full">Crear variación</Button>
            </form>
        </div>
    )
}