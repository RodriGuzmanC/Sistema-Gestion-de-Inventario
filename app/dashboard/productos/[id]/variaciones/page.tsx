import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"

// Datos de ejemplo para las variaciones de productos
const productVariations = [
  { id: 1, unitPrice: 19.99, wholesalePrice: 15.99, color: "Rojo", size: "M", stock: 50 },
  { id: 2, unitPrice: 19.99, wholesalePrice: 15.99, color: "Azul", size: "L", stock: 30 },
  { id: 3, unitPrice: 21.99, wholesalePrice: 17.99, color: "Verde", size: "S", stock: 25 },
  { id: 4, unitPrice: 21.99, wholesalePrice: 17.99, color: "Negro", size: "XL", stock: 40 },
]

export default function ListProductsVariations() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8 items-center  mb-6">
      <h1 className="text-2xl font-bold">Variaciones de Productos</h1>
      <Button>Crear Variacion</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Precio Unitario</TableHead>
              <TableHead>Precio Mayorista</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Talla</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productVariations.map((variation) => (
              <TableRow key={variation.id}>
                <TableCell>${variation.unitPrice.toFixed(2)}</TableCell>
                <TableCell>${variation.wholesalePrice.toFixed(2)}</TableCell>
                <TableCell>{variation.color}</TableCell>
                <TableCell>{variation.size}</TableCell>
                <TableCell>{variation.stock}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}