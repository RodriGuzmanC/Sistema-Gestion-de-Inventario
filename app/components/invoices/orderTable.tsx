import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { enlazarNombreDeProductoConAtributos } from "@/utils/utils";
  
  interface OrdersTableProps {
    items: OrderDetailWithFullRelations[]
  }
  
  interface OrderItemTable {
    cantidad: number;
    descripcion: string;
    precio: number;
    importe: number;
  }
  

  export function OrdersTable({ items }: OrdersTableProps) {
    const total = items.reduce((sum, item) => sum + (item.cantidad * (item.precio_rebajado ?? item.precio)) , 0)
    

    return (
      <div className="rounded-md border">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Cantidad</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Importe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>
                    {enlazarNombreDeProductoConAtributos(item)}</TableCell>
                <TableCell className="text-right">
                  S/ {item.precio_rebajado?.toFixed(2) ?? item.precio.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  S/ {(item.precio_rebajado ? item.precio_rebajado : item.precio) * item.cantidad}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">
                Total
              </TableCell>
              <TableCell className="text-right font-bold">
                S/ {total.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
  
  