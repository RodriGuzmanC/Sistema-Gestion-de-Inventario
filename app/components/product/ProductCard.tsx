import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MoreVertical, Edit, Trash, Layers } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ProductService from "@/features/products/ProductService"
import { toast } from "sonner"
import { apiRequest } from "@/utils/utils"

interface Props {
  product: ProductWithBasicRelations,
}

export function ProductCard({ product }: Props) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  async function eliminarProducto(id: number) {
    try {
      //const productoEliminado = await ProductService.delete(id)
      const res: DataResponse<Product> = await apiRequest({
        url: `/api/products/${id}`, 
        method: 'DELETE'
      });

      if (res.error) {
        console.error("Ha ocurrido un error al eliminar el producto", res.error)
        toast("Ha ocurrido un error")
        return
      }
      
      console.log("Producto eliminado: ")
      console.log(res.data)

      toast("El producto ha sido eliminado correctamente")
      setOpenDeleteModal(false);
    } catch (error) {
      toast("Ha ocurrido un error")
      console.error("Ha ocurrido un error al eliminar el producto", error)
    }
  }

  let stockVariant: "success" | "warning" | "error";

  if (product.stock > 20) {
    stockVariant = "success"; // Alto stock
  } else if (product.stock > 5) {
    stockVariant = "warning"; // Stock medio
  } else {
    stockVariant = "error"; // Bajo stock
  }

  return (
    <Card className="md:w-[240px] overflow-hidden group relative">
      <div className="relative">

        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.url_imagen}
            alt={product.nombre_producto}
            className="object-cover transition-transform group-hover:scale-105"
          />

        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="font-semibold text-white">{product.nombre_producto}</h3>
        </div>
        
      </div>
      <CardContent className="grid gap-2.5 p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{product.descripcion}</p>
        <div>
        <Badge variant={stockVariant} className="w-fit">
          Stock: {product.stock}
        </Badge> 
        </div>    
        <div className="absolute top-2 left-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <Link href={`productos/${product.id}/editar`}>
                <DropdownMenuItem>

                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>

              </Link>
              <DropdownMenuItem onClick={() => setOpenDeleteModal(true)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Eliminar</span>
              </DropdownMenuItem>
              <Link href={`productos/${product.id}/variaciones/listar`}>
                <DropdownMenuItem>
                  <Layers className="mr-2 h-4 w-4" />
                  <span>Ver variaciones</span>
                </DropdownMenuItem>
              </Link>

            </DropdownMenuContent>
          </DropdownMenu>
          {/* Modal Eliminar */}
          <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
            <DialogContent >
              <DialogHeader className="space-y-4" >
                <DialogTitle >¿Estás seguro de eliminar este producto?</DialogTitle>
                <DialogDescription>
                  El producto sera inhabilitado y no aparecera en tu listado de productos, pero podras restablecerlo en la seccion "Productos eliminados"
                </DialogDescription>
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setOpenDeleteModal(false)} variant="outline">
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      eliminarProducto(product.id)
                    }}
                    variant="destructive"
                  >
                    Eliminar
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

