"use client"

import useSWR from "swr"
import { Plus, Pencil, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useModal } from "@/utils/others/use-modal-store"
import { apiRequest } from "@/utils/utils"
import { swrSettings } from "@/utils/swr/settings"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const ProductStatusSection = () => {
  // Peticion
  const { data: Response, error: ApiError, isLoading } = useSWR<PaginatedResponse<ProductStatus>>
    ("products-statuses",
      () => {
        return apiRequest({ url: 'products/statuses', method: 'GET' })
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Estados de productos</CardTitle>
        <Button onClick={() => onOpen("create", "productStatus")} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data?.map((status) => (
            <div
              key={status.id}
              className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
            >
              <span>{status.nombre}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpen("edit", "productStatus", status)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpen("delete", "productStatus", status)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

