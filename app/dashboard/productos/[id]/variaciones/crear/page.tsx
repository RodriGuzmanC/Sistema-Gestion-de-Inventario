'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AttributeTypesService from '@/features/attributes/AttributeTypesService'
import AttributeService from '@/features/attributes/AttributeService'
import VariationService from '@/features/variations/VariationService'
import VariationAttributeService from '@/features/variations/VariationAttributeService'
import ProductService from '@/features/products/ProductService'




interface VariacionesAtributo {
  tipo_id: number
  valor_id: number
}

interface ProductVariation {
  id: number
  precio_unitario: string
  precio_mayorista: string
  stock: string
  atributos: VariacionesAtributo[]
}

type Params = {
  id: string; // Nombre del parámetro dinámico en el archivo
};

export default function CreateVariation({ 
  params 
}: { 
  params: Params
}) {
  const [typesWithVariations, setTypesWithVariations] = useState<AttributeTypesWithAttributes[]>([])
  const [product, setProduct] = useState<Product | null>()
  //  Variaciones
  const [variations, setVariations] = useState<ProductVariation[]>([
    {
      id: 1,
      precio_unitario: '',
      precio_mayorista: '',
      stock: '',
      atributos: []
    }
  ])
  
  // Tipos de atributo
  /*const attributeTypes: AttributeTypesWithAttributes[] = [
    {
      id: 1,
      nombre: "color",
      atributos: [
        {
          id: 101,
          tipo_atributo_id: 1, // Relacionado con el ID de "color"
          valor: "verde",
        },
        {
          id: 102,
          tipo_atributo_id: 1, // Relacionado con el ID de "color"
          valor: "rojo",
        },
      ],
    },
    {
      id: 2,
      nombre: "talla",
      atributos: [
        {
          id: 201,
          tipo_atributo_id: 2, // Relacionado con el ID de "talla"
          valor: "L",
        },
        {
          id: 202,
          tipo_atributo_id: 2, // Relacionado con el ID de "talla"
          valor: "S",
        },
      ],
    },
  ];*/
  

  const handleAddAttribute = (variationId: number) => {
    setVariations(variations.map(variation => {
      if (variation.id === variationId) {
        return {
          ...variation,
          atributos: [...variation.atributos, { tipo_id: 0, valor_id: 0 }]
        }
      }
      return variation
    }))
  }

  const handleAttributeChange = (
    variationId: number,
    attributeIndex: number,
    field: 'tipo_id' | 'valor_id',
    value: number
  ) => {
    setVariations(variations.map(variation => {
      if (variation.id === variationId) {
        const newAttributes = [...variation.atributos]
        newAttributes[attributeIndex] = {
          ...newAttributes[attributeIndex],
          [field]: value
        }
        return {
          ...variation,
          atributos: newAttributes
        }
      }
      return variation
    }))
  }

  const handleRemoveAttribute = (variationId: number, attributeIndex: number) => {
    setVariations(variations.map(variation => {
      if (variation.id === variationId) {
        const newAttributes = variation.atributos.filter((_, index) => index !== attributeIndex)
        return {
          ...variation,
          atributos: newAttributes
        }
      }
      return variation
    }))
  }

  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        id: variations.length + 1,
        precio_unitario: '',
        precio_mayorista: '',
        stock: '',
        atributos: []
      }
    ])
  }

  const handleInputChange = (
    variationId: number,
    field: keyof Pick<ProductVariation, 'precio_unitario' | 'precio_mayorista' | 'stock'>,
    value: string
  ) => {
    setVariations(variations.map(variation => {
      if (variation.id === variationId) {
        return {
          ...variation,
          [field]: value
        }
      }
      return variation
    }))
  }

  const handleSubmit = async () => {
    console.log(variations)
    variations.map(async (variation)=>{
      // Insertamos cada variacion en bd
      const variacion: Partial<Variation> = {
        producto_id: parseInt(params.id),
        precio_unitario: parseInt(variation.precio_unitario),
        precio_mayorista: parseInt(variation.precio_mayorista),
        stock: parseInt(variation.stock)
      }
      const nuevaVariacion = await VariationService.create(variacion)
      console.log("Nueva variacion")
      console.log(nuevaVariacion)
      // Asociamos sus atributos
      variation.atributos.map(async (atributo)=>{
        const atributoDeVariacion: Partial<VariationAttribute> = {
          variacion_id: nuevaVariacion.id,
          atributo_id: atributo.valor_id
        }
        const nuevoAtributoDeVariacion = await VariationAttributeService.create(atributoDeVariacion)
        console.log("Nuevo atributo de variacion")
        console.log(nuevoAtributoDeVariacion)
      })
    })
  }

  useEffect(()=>{
    async function cargarTiposDeAtributosConAtributos(){
      const tiposConAtributos = await AttributeTypesService.getAllWithAttributes()
      setTypesWithVariations(tiposConAtributos)
    }
    async function cargarProducto(){
      const producto = await ProductService.getOne(parseInt(params.id))
      setProduct(producto)
    }
    cargarProducto()
    cargarTiposDeAtributosConAtributos()
  }, [])
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Crear variacion de producto</h1>
      <p className="text-muted-foreground">
        Estas creando las variaciones para el producto:
      </p>

      {/* Product Card */}
      <Card className="w-[350px] h-[200px]">
        <CardHeader className="space-y-2 flex flex-row">
          <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
            <img
              src={product?.url_imagen ?? ''}
              className="object-cover"
            />
          </div>
          <div className="font-medium">{product?.nombre_producto}</div>
          <p>{product?.descripcion}</p>
        </CardHeader>
      </Card>

      {/* Variations */}
      <div className="space-y-4">
        {variations.map((variation) => (
          <Card key={variation.id}>
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <h3 className="font-semibold">Variación {variation.id}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => {
                  setVariations(variations.filter(v => v.id !== variation.id))
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prices and Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Precio unitario</label>
                  <Input
                    type="number"
                    value={variation.precio_unitario}
                    onChange={(e) => handleInputChange(variation.id, 'precio_unitario', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Precio mayorista</label>
                  <Input
                    type="number"
                    value={variation.precio_mayorista}
                    onChange={(e) => handleInputChange(variation.id, 'precio_mayorista', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input
                    type="number"
                    value={variation.stock}
                    onChange={(e) => handleInputChange(variation.id, 'stock', e.target.value)}
                  />
                </div>
              </div>

              {/* Attributes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Atributos</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddAttribute(variation.id)}
                  >
                    Añadir +
                  </Button>
                </div>

                {variation.atributos.map((atributo, index) => (
                  <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-4 items-start">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo</label>
                      <Select
                        value={atributo.tipo_id.toString()}
                        onValueChange={(value) => 
                          handleAttributeChange(variation.id, index, 'tipo_id', parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {typesWithVariations.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Valor</label>
                      <Select
                        value={atributo.valor_id.toString()}
                        onValueChange={(value) => 
                          handleAttributeChange(variation.id, index, 'valor_id', parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {typesWithVariations
                            .find(type => type.id === atributo.tipo_id)
                            ?.atributos.map((attr) => (
                              <SelectItem key={attr.id} value={attr.id.toString()}>
                                {attr.valor}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-8 text-destructive"
                      onClick={() => handleRemoveAttribute(variation.id, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Variation Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleAddVariation}
      >
        Añadir nueva variación +
      </Button>

      {/* Save Button */}
      <Button className="w-full" onClick={handleSubmit}>
        Guardar todas las variaciones
      </Button>
    </div>
  )
}

