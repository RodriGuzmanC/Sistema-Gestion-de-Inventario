'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'

interface ProductFilterProps {
  products: ProductWithBasicRelations[]
  setProducts: (products: ProductWithBasicRelations[]) => void
}

export default function ProductFilter({ products, setProducts }: ProductFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'high'>('all')

  // Function to handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = [...products].filter(product =>
      product.nombre_producto.toLowerCase().includes(value.toLowerCase())
    )
    setProducts(filtered)
  }

  // Function to handle price sorting
  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    setSortDirection(newDirection)
    
    const sorted = [...products].sort((a, b) => {
      if (newDirection === 'asc') {
        return a.precio_unitario - b.precio_unitario
      }
      return b.precio_unitario - a.precio_unitario
    })
    
    setProducts(sorted)
  }

  // Function to handle stock filtering
  const handleStockFilter = (filter: 'all' | 'low' | 'high') => {
    setStockFilter(filter)
    
    const sorted = [...products].sort((a, b) => {
      if (filter === 'low') {
        return a.stock - b.stock
      }
      if (filter === 'high') {
        return b.stock - a.stock
      }
      return 0
    })
    
    setProducts(sorted)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full mx-auto py-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
          
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleSort}
          className="min-w-[100px]"
        >
          Ordenar {sortDirection === 'asc' ? '↑' : '↓'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[100px]"
            >
              Stock {stockFilter !== 'all' ? (stockFilter === 'low' ? '↓' : '↑') : ''}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStockFilter('all')}>
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStockFilter('low')}>
              Stock Bajo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStockFilter('high')}>
              Stock Alto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="bg-primary">
          <Link href={'productos/crear'}>
          Crear +
          </Link>
        </Button>
      </div>
    </div>
  )
}

