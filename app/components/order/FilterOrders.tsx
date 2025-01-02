'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'


interface OrderFilterProps {
  orders: OrderWithBasicRelations[]
  setOrders: (orders: OrderWithBasicRelations[]) => void
  orderStatuses: OrderStatus[]
  deliveryMethods: DeliveryMethod[]
}

export default function OrderFilter({ 
  orders, 
  setOrders,
  orderStatuses,
  deliveryMethods 
}: OrderFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedDelivery, setSelectedDelivery] = useState<string>('all')

  // Effect to apply all filters
  useEffect(() => {
    applyFilters()
  }, [searchTerm, sortDirection, selectedStatus, selectedDelivery])

  // Function to apply all filters
  const applyFilters = () => {
    let filtered = [...orders]

    // Verifica que 'orders' no esté vacío
    if (!filtered || filtered.length === 0) {
      return; // Si está vacío o no es válido, no hacer nada
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order =>
        order.estado_pedido_id === parseInt(selectedStatus)
      )
    }

    // Apply delivery method filter
    if (selectedDelivery !== 'all') {
      filtered = filtered.filter(order =>
        order.metodo_entrega_id === parseInt(selectedDelivery)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a.codigo || !b.codigo) {
        return 0; // Evita errores si 'codigo' no está presente
      }
      if (sortDirection === 'asc') {
        return a.codigo.localeCompare(b.codigo)
      }
      return b.codigo.localeCompare(a.codigo)
    })

    setOrders(filtered)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full mx-auto py-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[100px]">
              Ordenar {sortDirection === 'asc' ? '↑' : '↓'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={sortDirection} onValueChange={(value) => setSortDirection(value as 'asc' | 'desc')}>
              <DropdownMenuRadioItem value="asc">Ascendente</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">Descendente</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Order Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px]">
              Estado pedido
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
              <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
              {orderStatuses.map((status) => (
                <DropdownMenuRadioItem key={status.id} value={status.id.toString()}>
                  {status.nombre}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delivery Method Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px]">
              Método entrega
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
              <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
              {deliveryMethods.map((method) => (
                <DropdownMenuRadioItem key={method.id} value={method.id.toString()}>
                  {method.nombre}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href={'pedidos/crear'}>
        <Button className="bg-primary">
          Crear +
        </Button>
        </Link>
      </div>
    </div>
  )
}

