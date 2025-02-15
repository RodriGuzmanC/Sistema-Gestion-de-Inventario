"use client"

import useSWR from "swr"
import { Plus, Pencil, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useModal } from "@/utils/others/use-modal-store"
import { apiRequest } from "@/utils/utils"
import { swrSettings } from "@/utils/swr/settings"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const SocialNetworksSection = () => {
  // Peticion
  const { data: Response, error: ApiError, isLoading } = useSWR<PaginatedResponse<SocialNetwork>>
    ("networks",
      () => {
        return apiRequest({ url: 'networks', method: 'GET' })
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
        <CardTitle>Redes sociales</CardTitle>
        <Button onClick={() => onOpen("create", "socialNetwork")} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data?.map((network) => (
            <div
              key={network.id}
              className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
            >
              <div>
                <div className="font-medium">{network.nombre}</div>
                <div className="text-sm text-muted-foreground">{network.url_base}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpen("edit", "socialNetwork", network)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpen("delete", "socialNetwork", network)}
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

