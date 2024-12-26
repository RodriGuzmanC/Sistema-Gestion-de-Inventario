"use client"

import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DateRangePicker } from "@/app/components/DateRangePicker"
import { OrdersTable } from "@/app/components/invoices/orderTable"
import ClientService from "@/features/client/ClientService"
import OrderService from "@/features/orders/OrderService"
import { enlazarNombreDeProductoConAtributos, formatearFechaLarga } from "@/utils/utils"
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function generarBoleta(cliente: Client, pedidos: OrderDetailWithFullRelations[]) {
  const pdf = new jsPDF();

  // Logo (asegúrate de tener la imagen en base64 o usa un archivo .jpg/.png)
  const logo = '/images/h-y-m-reducido.png'; // Reemplaza con tu logo en base64
  pdf.addImage(logo, 'PNG', 10, 10, 50, 30); // Coloca el logo en las coordenadas (10, 10) con un tamaño de 30x30 mm

  // Encabezado: Nombre del taller y cliente
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('M y H | Taller de Confección', 70, 18); // Ajusta la posición según tu logo
  pdf.setFontSize(10);
  pdf.text(`Cliente: ${cliente.nombre}`, 70, 28);
  pdf.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 70, 38);

  // Línea divisoria
  pdf.setLineWidth(0.5);
  pdf.line(10, 45, pdf.internal.pageSize.width - 10, 45); // Dibuja una línea horizontal

  // Cuerpo de la tabla
  const data = pedidos.map(pedido => [
    enlazarNombreDeProductoConAtributos(pedido),
    pedido.cantidad,
    `S/${pedido.precio_rebajado?.toFixed(2) ?? pedido.precio.toFixed(2)}`,
    `S/${(pedido.cantidad * (pedido.precio_rebajado ?? pedido.precio)).toFixed(2)}`,
  ]);

  // Establecer opciones de la tabla
  autoTable(pdf, {
    head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
    body: data,
    startY: 50,
    theme: 'grid', // Estilo de tabla con cuadrícula
    headStyles: { fillColor: [20, 30, 50], textColor: [255, 255, 255], fontSize: 10 }, // Estilo de cabecera
    bodyStyles: { fontSize: 9 }, // Estilo de contenido
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
    },
    margin: { top: 10 },
  });

  // Total
  const total = pedidos.reduce((sum, item) => sum + (item.cantidad * (item.precio_rebajado ?? item.precio)), 0);
  const yPosition = (pdf as any).autoTable.previous.finalY + 10;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(`Total: S/${total.toFixed(2)}`, 10, yPosition);

  // Guardar PDF
  pdf.save('boleta.pdf');
}




export default function EmisionBoleta() {
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderWithBasicRelations[]>([])

  const [clients, setClients] = useState<Client[]>([])
  const [items, setItems] = useState<OrderDetailWithFullRelations[]>([])

  const handleSearch = async () => {
    let dateFrom = dateRange?.from
    let dateTo = dateRange?.to 
    if (!dateFrom || !dateTo) return (alert("Seleccione un rango de fechas"))
    let newDateFrom = dateFrom.toISOString().split("T")[0]
    let newDateTo = dateTo.toISOString().split("T")[0]
    const data = await OrderService.getAllByDateAndClient(newDateFrom, newDateTo, parseInt(selectedClient))
    setFilteredOrders(data)
  }

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  useEffect(() => {
    async function cargarClientes() {
      const data = await ClientService.getAll()
      setClients(data)
    }
    cargarClientes()
  }, [])

  useEffect(() => {
    async function cargarPedido() {
      let lastSelectedOrder = selectedOrders[selectedOrders.length - 1]
      const data = await OrderService.getOne(lastSelectedOrder)
      if (!data) return alert("No se encontró el pedido")

      setItems([...items, ...data.detalles_pedidos])
    }
    if (selectedOrders.length > 0) {
      cargarPedido()
    }
  }, [selectedOrders])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Emisión de Boleta</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker onChange={setDateRange} />
      </div>

      <Button onClick={handleSearch} className="w-full md:w-auto">
        Buscar pedidos
      </Button>

      <div className="grid gap-4">
        {filteredOrders.map(order => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p>Cliente: {order.clientes.nombre}</p>
                  <p className="font-medium">Fecha de anotacion del pedido: {formatearFechaLarga(order.fecha_pedido)}</p>
                  <p>Fecha de entrega: {formatearFechaLarga(order.fecha_entrega)}</p>
                  <p>Estado: {order.estados_pedidos.nombre}</p>
                </div>
                <Button
                  onClick={() => toggleOrderSelection(order.id)}
                  disabled={selectedOrders.includes(order.id)}
                  variant={selectedOrders.includes(order.id) ? "secondary" : "default"}
                >
                  {selectedOrders.includes(order.id) ? "Seleccionado" : "Seleccionar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedOrders.length > 0 && (
        <>
          <OrdersTable items={items} />
          <Button className="w-full md:w-auto" size="lg" onClick={() => generarBoleta(filteredOrders[0].clientes, items)}>
            Emitir Boleta
          </Button>
        </>
      )}
    </div>
  )
}

