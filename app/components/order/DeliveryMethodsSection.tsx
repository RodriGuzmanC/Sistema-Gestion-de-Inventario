"use client"

import useSWR from "swr"
import { Plus, Pencil, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useModal } from "@/utils/others/use-modal-store"
import { apiRequest } from "@/utils/utils"
import { swrSettings } from "@/utils/swr/settings"


export const DeliveryMethodsSection = () => {
  // Peticion
  const { data: Response, error: ApiError, isLoading } = useSWR<PaginatedResponse<DeliveryMethod>>
    ("orders-delivery-methods",
      () => {
        return apiRequest({ url: 'orders/delivery-methods', method: 'GET' })
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
        <CardTitle>Métodos de entrega</CardTitle>
        <Button onClick={() => onOpen("create", "deliveryMethod")} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data?.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
            >
              <span>{method.nombre}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpen("edit", "deliveryMethod", method)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpen("delete", "deliveryMethod", method)}
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

