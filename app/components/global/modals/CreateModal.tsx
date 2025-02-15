"use client"

import { useState } from "react"
import { useModal } from "@/utils/others/use-modal-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiRequest } from "@/utils/utils"
import { useSWRConfig } from "swr"


export const CreateModal = () => {
  const { mutate } = useSWRConfig()

  const { isOpen, data, type, onClose, entityType } = useModal()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    valor: "",
    url_base: ""
  })

  if (!entityType) {
    return null
  }

  const isModalOpen = isOpen && type === "create"

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      // Verificar y manejar según el tipo de entityType
      switch (entityType) {
        case 'attribute':
          // Lógica para crear 'attributeType'
          const createAttribute: Partial<Attribute> = {
            valor: formData.valor,
            tipo_atributo_id: data?.id
          }
          console.log("Aqui esta el nuevo atributo estructurado")
          console.log(createAttribute)
          // Almacena el nuevo registro
          const newAttribute: DataResponse<Attribute> = await apiRequest({
            url: 'products/attributes-types/attributes',
            method: 'POST',
            body: createAttribute
          })
          console.log("Atributo creado en bd")
          // Inserta el nuevo registro en la caché para evitar hacer una consulta extra y mejorar la UX
          mutate('products-attributes-types', async (currentData: any | undefined) => {
            if (!currentData) return { data: [], meta: {} }; // Si no hay datos, devolver un objeto vacío
            console.log("Antes de actualizar cache")
            // Buscar el tipo de atributo correspondiente en el array 'currentData'
            const updatedData = currentData.data.map((type: AttributeTypesWithAttributes) => {
              // Si encontramos el tipo de atributo con el id correspondiente
              if (type.id === newAttribute.data.tipo_atributo_id) {
                console.log("Se encontro el tipo de atributo")
                // Añadir el nuevo atributo al array 'atributos'
                return {
                  ...type,
                  atributos: [...type.atributos, newAttribute.data] // Agregar el nuevo atributo
                };
              }
              return type;
            });

            return {
              ...currentData,
              data: updatedData // Devolver los datos actualizados con el nuevo atributo
            };
          }, { revalidate: false });
          break;

        case 'attributeType':
          // Lógica para crear 'attributeType'
          const NewAttributeType: Partial<AttributeType> = {
            nombre: formData.nombre
          }
          // Almacena el nuevo registro
          const newAttributeType: DataResponse<AttributeType> = await apiRequest({ url: 'products/attributes-types', method: 'POST', body: NewAttributeType })
          // Inserta el nuevo registro en cache para evitar hacer una consulta extra y mejorar la UX
          mutate('products-attributes-types', async (currentData: any | undefined) => {
            if (!currentData) return { data: [newAttributeType], meta: {} }; // Si no hay datos, devolver solo el nuevo registro
            const newAdd: AttributeTypesWithAttributes = {
              id: newAttributeType.data.id,
              nombre: newAttributeType.data.nombre,
              atributos: [] // Sin elementos
            }
            return {
              ...currentData,
              data: [...currentData?.data, newAdd], // Agregar el registro a los datos existentes
            };
          }, { revalidate: false });
          break;

        case 'deliveryMethod':
          // Lógica para crear 'deliveryMethod'
          console.log("Creando 'deliveryMethod'");
          break;

        case 'productStatus':
          // Lógica para crear 'productStatus'
          console.log("Creando 'productStatus'");
          break;

        case 'socialNetwork':
          // Lógica para crear 'socialNetwork'
          console.log("Creando 'socialNetwork'");
          break;

        default:
          console.error('Tipo de entidad no reconocido:', entityType);
          break;
      }

      onClose();

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


  const title = {
    attribute: "Crear Atributo",
    attributeType: "Crear Tipo de Atributo",
    deliveryMethod: "Crear Método de Entrega",
    productStatus: "Crear Estado de Producto",
    socialNetwork: "Crear Red Social"
  }[entityType]

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Redes sociales */}
          {entityType === "socialNetwork" && (
            <>
              <div>
                <Label>Nombre</Label>
                <Input
                  disabled={loading}
                  placeholder="Nombre de la red social"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div>
                <Label>URL Base</Label>
                <Input
                  disabled={loading}
                  placeholder="URL base"
                  value={formData.url_base}
                  onChange={(e) => setFormData({ ...formData, url_base: e.target.value })}
                />
              </div>
            </>
          )}
          {(entityType === "deliveryMethod" || entityType === "productStatus" || entityType === "attributeType") && (
            <div>
              <Label>Nombre</Label>
              <Input
                disabled={loading}
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
          )}
          {entityType === "attribute" && (
            <div>
              <Label>Valor</Label>
              <Input
                disabled={loading}
                placeholder="Valor del atributo"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Crear
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

