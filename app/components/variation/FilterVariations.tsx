'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, ArrowDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'

interface FilterVariationsProps {
  variations: VariationWithRelations[]
  setVariations: (variations: VariationWithRelations[]) => void
  attributeTypes: AttributeTypesWithAttributes[]
}

export default function FilterVariations({ 
  variations, 
  setVariations,
  attributeTypes 
}: FilterVariationsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [stockSort, setStockSort] = useState<'none' | 'asc' | 'desc'>('none')
  const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number[]>>({})
    const [countOfResults, setCountOfResults] = useState<number>(variations.length)
  // Handle search by attribute value
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterVariations(value, selectedAttributes)
  }

  // Handle variation sorting by ID
  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    setSortDirection(newDirection)
    
    const sorted = [...variations].sort((a, b) => {
      return newDirection === 'asc' ? a.id - b.id : b.id - a.id
    })
    
    setVariations(sorted)
    setCountOfResults(sorted.length)
  }

  // Handle stock sorting
  const handleStockSort = () => {
    const nextSort = stockSort === 'none' ? 'desc' : stockSort === 'desc' ? 'asc' : 'none'
    setStockSort(nextSort)
    
    if (nextSort === 'none') {
      filterVariations(searchTerm, selectedAttributes)
      return
    }
    
    const sorted = [...variations].sort((a, b) => {
      return nextSort === 'desc' ? b.stock - a.stock : a.stock - b.stock
    })
    
    setVariations(sorted)
    setCountOfResults(sorted.length)

  }

  // Handle attribute selection
  const handleAttributeSelect = (typeId: number, attributeId: number) => {
    const currentSelected = selectedAttributes[typeId] || []
    const newSelected = currentSelected.includes(attributeId)
      ? currentSelected.filter(id => id !== attributeId)
      : [...currentSelected, attributeId]
    
    const newSelectedAttributes = {
      ...selectedAttributes,
      [typeId]: newSelected
    }
    
    setSelectedAttributes(newSelectedAttributes)
    filterVariations(searchTerm, newSelectedAttributes)
  }

  // Filter variations based on search and selected attributes
  const filterVariations = (search: string, attributes: Record<number, number[]>) => {
    let filtered = [...variations]

    // Apply search filter
    if (search) {
      filtered = filtered.filter(variation =>
        variation.variaciones_atributos.some(va =>
          va.atributos.valor.toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    // Apply attribute filters
    Object.entries(attributes).forEach(([typeId, attributeIds]) => {
      if (attributeIds.length > 0) {
        filtered = filtered.filter(variation =>
          variation.variaciones_atributos.some(va =>
            va.atributos.tipo_atributo_id === Number(typeId) &&
            attributeIds.includes(va.atributos.id)
          )
        )
      }
    })

    setVariations(filtered)
    setCountOfResults(filtered.length)

  }

  return (
    <div className="space-y-4 w-full mx-auto py-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por valor de atributo..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSort}
            className="min-w-[100px]"
          >
            Ordenar {sortDirection === 'asc' ? '↑' : '↓'}
          </Button>

          <Button
            variant="outline"
            onClick={handleStockSort}
            className="min-w-[100px]"
          >
            Stock {stockSort !== 'none' ? (stockSort === 'desc' ? '↑' : '↓') : ''}
          </Button>

            <Link href={'crear'}>
            <Button className="bg-primary">
            Crear
            </Button>

            </Link>
        </div>
      </div>

      {/* Attribute Filters */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="font-medium mb-5">Filtrar por atributos</h3>
        <div className="w-full flex flex-wrap gap-3 mb-5">
          {attributeTypes.map((type) => (
            <DropdownMenu key={type.id}  >
              <DropdownMenuTrigger className="text-sm">
                <Button variant={'default'}>
                    {type.nombre}<ChevronDown></ChevronDown>
                    </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                    {type.atributos.map((attribute) => (
                      <DropdownMenuItem key={attribute.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`attribute-${attribute.id}`}
                          checked={selectedAttributes[type.id]?.includes(attribute.id)}
                          onCheckedChange={() => handleAttributeSelect(type.id, attribute.id)}
                        />
                        <Label
                          htmlFor={`attribute-${attribute.id}`}
                          className="text-sm font-normal"
                        >
                          {attribute.valor}
                        </Label>
                      </DropdownMenuItem>
                    ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
        <div className="inline-block w-fit bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
  Se encontraron: {countOfResults}
</div>
      </div>
    </div>
  )
}

