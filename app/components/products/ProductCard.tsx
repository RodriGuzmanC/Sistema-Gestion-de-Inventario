"use client";
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Eye, Package } from 'lucide-react'

interface ProductCardProps {
  id: number
  title: string
  description: string
  price_min: number
  price_max: number
  createdAt: Date
  onDelete: () => void
  onEdit: () => void
  onView: () => void
}

export default function ProductCard({
  id,
  title,
  description,
  price_min,
  price_max,
  createdAt
}: ProductCardProps) {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 truncate">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Creado {formatDistanceToNow(createdAt, { addSuffix: true, locale: es })}
                </p>
                <p className="text-gray-600 line-clamp-2 mt-2 max-w-2xl">{description}</p>
              </div>
              <div className='flex flex-col items-end text-end'>
                <div className='flex gap-4'>
                  <p className="text-2xl font-bold text-blue-600">S/ {price_min}</p>
                  <span>-</span>
                  <p className="text-2xl font-bold text-blue-600">S/ {price_max}</p>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-500 transition-colors">
                    <Eye className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-green-500 transition-colors">
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}