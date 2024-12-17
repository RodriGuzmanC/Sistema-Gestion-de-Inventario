'use client'

import * as React from "react"
import { Search, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SharedFilterProps<T> {
  data: T[]
  searchFields?: (keyof T)[]
  orderFields?: { field: keyof T; label: string }[]
  createLink?: string
}

export function SharedFilter<T extends Record<string, any>>({
  data,
  searchFields = [],
  orderFields = [],
  createLink,
}: SharedFilterProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortField, setSortField] = React.useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')
  const [filteredData, setFilteredData] = React.useState<T[]>(data)

  // Función para filtrar y ordenar datos
  const filterAndSortData = React.useCallback(() => {
    let result = [...data]

    // Aplicar búsqueda
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase()
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field]
          return value?.toString().toLowerCase().includes(lowercaseQuery)
        })
      )
    }

    // Aplicar ordenamiento
    if (sortField) {
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    setFilteredData(result)
  }, [data, searchQuery, searchFields, sortField, sortDirection])

  // Efecto para actualizar los datos filtrados cuando cambian los criterios
  React.useEffect(() => {
    filterAndSortData()
  }, [filterAndSortData])

  // Manejar cambios en la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Manejar cambios en el ordenamiento
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Limpiar filtros
  const handleClear = () => {
    setSearchQuery("")
    setSortField(null)
    setSortDirection('asc')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Ordenar
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {orderFields.map(({ field, label }) => (
              <DropdownMenuItem
                key={field.toString()}
                onClick={() => handleSort(field)}
              >
                {label} {sortField === field && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" onClick={handleClear}>
          Limpiar
        </Button>
        
        {createLink && (
          <Button asChild>
            <Link href={createLink}>
              Crear +
            </Link>
          </Button>
        )}
      </div>

      {/* Aquí puedes renderizar los datos filtrados */}
      <div>
        {/* Ejemplo de cómo podrías mostrar los datos filtrados */}
        <p>Resultados: {filteredData.length}</p>
        {/* Aquí irían los componentes que muestran los datos filtrados */}
      </div>
    </div>
  )
}

