"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import CreateAttributeTypeForm from "@/app/components/attribute-types/createForm"
import EditAttributeTypeForm from "@/app/components/attribute-types/editForm"
import DeleteAttributeTypeForm from "@/app/components/attribute-types/deleteForm"
import CreateAttributeForm from "@/app/components/attribute/createForm"
import EditAttributeForm from "@/app/components/attribute/editForm"
import DeleteAttributeForm from "@/app/components/attribute/deleteForm"
import { apiRequest } from "@/utils/utils"
import { swrSettings } from "@/utils/swr/settings"


export default function AttributesPage() {
  // State for modals
  const [createTypeModalOpen, setCreateTypeModalOpen] = useState(false)
  const [editTypeModalOpen, setEditTypeModalOpen] = useState(false)
  const [deleteTypeModalOpen, setDeleteTypeModalOpen] = useState(false)
  const [createAttributeModalOpen, setCreateAttributeModalOpen] = useState(false)
  const [editAttributeModalOpen, setEditAttributeModalOpen] = useState(false)
  const [deleteAttributeModalOpen, setDeleteAttributeModalOpen] = useState(false)
  
  // State for selected items
  const [selectedType, setSelectedType] = useState<AttributeTypesWithAttributes | null>(null)
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null)

  // Fetch attribute types using SWR
  const {
    data: attributeTypesResponse,
    error,
    isLoading,
    mutate,
  } = useSWR<PaginatedResponse<AttributeTypesWithAttributes>>(
    "products/attributes-types",
    async () => {
      const res: PaginatedResponse<AttributeTypesWithAttributes> = await apiRequest({ 
        url: "products/attributes-types", 
        method: "GET" 
      })
      if (res.error) {
        throw new Error("API request failed")
      }
      return res
    },
    swrSettings,
  )

  // Handle edit attribute type
  const handleEditType = (type: AttributeTypesWithAttributes) => {
    setSelectedType(type)
    setEditTypeModalOpen(true)
  }

  // Handle delete attribute type
  const handleDeleteType = (type: AttributeTypesWithAttributes) => {
    setSelectedType(type)
    setDeleteTypeModalOpen(true)
  }

  // Handle create attribute
  const handleCreateAttribute = (typeId: number) => {
    const type = attributeTypesResponse?.data.find(t => t.id === typeId) || null
    setSelectedType(type)
    setCreateAttributeModalOpen(true)
  }

  // Handle edit attribute
  const handleEditAttribute = (attribute: Attribute, typeId: number) => {
    const type = attributeTypesResponse?.data.find(t => t.id === typeId) || null
    setSelectedType(type)
    setSelectedAttribute(attribute)
    setEditAttributeModalOpen(true)
  }

  // Handle delete attribute
  const handleDeleteAttribute = (attribute: Attribute, typeId: number) => {
    const type = attributeTypesResponse?.data.find(t => t.id === typeId) || null
    setSelectedType(type)
    setSelectedAttribute(attribute)
    setDeleteAttributeModalOpen(true)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Cargando...</div>
  }

  if (error) {
    return <div className="text-red-500">Error al cargar los datos: {error.message}</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tipos de Atributos y Atributos</h1>
        <Button onClick={() => setCreateTypeModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Tipo de Atributo
        </Button>
      </div>

      {attributeTypesResponse?.data.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            No hay tipos de atributos disponibles
          </CardContent>
        </Card>
      ) : (
        attributeTypesResponse?.data.map((type) => (
          <Card key={type.id} className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">{type.nombre}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditType(type)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteType(type)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Atributos</h3>
                <Button size="sm" onClick={() => handleCreateAttribute(type.id)}>
                  <Plus className="mr-2 h-4 w-4" /> Crear Atributo
                </Button>
              </div>
              <Separator className="my-2" />
              {type.atributos.length === 0 ? (
                <div className="text-sm text-gray-500 py-2">No hay atributos para este tipo</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {type.atributos.map((attribute) => (
                    <div key={attribute.id} className="flex items-center justify-between p-3 border rounded-md">
                      <Badge>{attribute.valor}</Badge>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditAttribute(attribute, type.id)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500" 
                          onClick={() => handleDeleteAttribute(attribute, type.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Modals for Attribute Types */}
      <CreateAttributeTypeForm 
        open={createTypeModalOpen} 
        onOpenChange={setCreateTypeModalOpen} 
        onSuccess={() => mutate()}
      />
      
      {selectedType && (
        <>
          <EditAttributeTypeForm 
            open={editTypeModalOpen} 
            onOpenChange={setEditTypeModalOpen} 
            attributeType={selectedType}
            onSuccess={() => mutate()}
          />
          
          <DeleteAttributeTypeForm 
            open={deleteTypeModalOpen} 
            onOpenChange={setDeleteTypeModalOpen} 
            attributeType={selectedType}
            onSuccess={() => mutate()}
          />
        </>
      )}

      {/* Modals for Attributes */}
      {selectedType && (
        <CreateAttributeForm 
          open={createAttributeModalOpen} 
          onOpenChange={setCreateAttributeModalOpen} 
          attributeTypeId={selectedType.id}
          attributeTypeName={selectedType.nombre}
          onSuccess={() => mutate()}
        />
      )}
      
      {selectedType && selectedAttribute && (
        <>
          <EditAttributeForm 
            open={editAttributeModalOpen} 
            onOpenChange={setEditAttributeModalOpen} 
            attribute={selectedAttribute}
            attributeTypeName={selectedType.nombre}
            onSuccess={() => mutate()}
          />
          
          <DeleteAttributeForm 
            open={deleteAttributeModalOpen} 
            onOpenChange={setDeleteAttributeModalOpen} 
            attribute={selectedAttribute}
            attributeTypeName={selectedType.nombre}
            onSuccess={() => mutate()}
          />
        </>
      )}
    </div>
  )
}
