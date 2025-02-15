"use client"

import useSWR from "swr"
import { Plus, Pencil, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useModal } from "@/utils/others/use-modal-store"
import { apiRequest } from "@/utils/utils"
import { swrSettings } from "@/utils/swr/settings"

export const AttributeTypesSection = () => {
  // Peticion
  const { data: Response, error: ApiError, isLoading } = useSWR<PaginatedResponse<AttributeTypesWithAttributes>>
  ("products-attributes-types", 
    () => { 
      return apiRequest({url: 'products/attributes-types', method: 'GET'})
    }, swrSettings);

  const { onOpen } = useModal()

  // Estado de la consulta
  if (ApiError) return <div>Error al cargar los datos</div>
  if (isLoading) return <div>Cargando...</div>
  // Verificamos si Response existe antes de desestructurarlo
  if (!Response) {
    return <div>No se han cargado los datos.</div>;
  }

  // Obtenemos los datos
  const { data, paginacion, error } = Response;
  console.log(Response)
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tipos de atributos</CardTitle>
        <Button onClick={() => onOpen("create", "attributeType")} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((type) => (
            <div key={type.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{type.nombre}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onOpen("create", "attribute", type)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpen("edit", "attributeType", type)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpen("delete", "attributeType", type)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {type.atributos.map((attr) => (
                  <div key={attr.id} className="flex items-center justify-between pl-4">
                    <span>{attr.valor}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpen("edit", "attribute", attr)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpen("delete", "attribute", attr)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

