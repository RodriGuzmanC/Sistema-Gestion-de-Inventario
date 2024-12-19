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

interface Props{
  product: ProductWithBasicRelations,
}

export function ProductCard({product}: Props) {

  return (
    <Card className="w-[300px] overflow-hidden group relative">
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
        {5 <= 10 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Stock: {product.stock}
          </Badge>
        )}
      </div>
      <CardContent className="grid gap-2.5 p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{product.descripcion}</p>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Unitario</span>
            <div className="font-semibold">S/{product.precio_unitario}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Mayorista</span>
            <div className="font-semibold">S/{product.precio_mayorista}</div>
          </div>
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
              <DropdownMenuItem>
                <Link href={`productos/${product.id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className="mr-2 h-4 w-4" />
                <span>Eliminar</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`productos/${product.id}/variaciones/listar`}>
                <Layers className="mr-2 h-4 w-4" />
                <span>Ver variaciones</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

