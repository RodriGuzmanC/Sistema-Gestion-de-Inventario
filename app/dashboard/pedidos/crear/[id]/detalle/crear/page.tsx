'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MinusCircle, PlusCircle } from 'lucide-react'

interface ProductVariation {
    id: string
    color: string
    size: string
    stock: number
    retailPrice: number
    wholesalePrice: number
}

interface OrderItem extends ProductVariation {
    quantity: number
    price: number
    discountedPrice?: number
}

export default function OrderDetail() {
    const [selectedProduct, setSelectedProduct] = useState<string>('')
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [selectedColor, setSelectedColor] = useState<string>('')
    const [variations, setVariations] = useState<ProductVariation[]>([])
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])

    // Mock data - replace with actual API calls
    const products = [
        { id: '1', name: 'Vestido Halfon' },
        { id: '2', name: 'Vestido Elegante' },
    ]

    const sizes = ['S', 'M', 'L', 'XL']
    const colors = ['Rojo', 'Azul marino', 'Negro']

    const handleFilter = () => {
        // Mock filtered results - replace with actual API call
        setVariations([
            {
                id: '1',
                color: 'Azul marino',
                size: 'S',
                stock: 12,
                retailPrice: 70,
                wholesalePrice: 35,
            },
            {
                id: '2',
                color: 'Negro',
                size: 'M',
                stock: 12,
                retailPrice: 70,
                wholesalePrice: 35,
            },
        ])
    }

    const addToOrder = (variation: ProductVariation) => {
        setOrderItems([
            ...orderItems,
            {
                ...variation,
                quantity: 1,
                price: variation.retailPrice,
            },
        ])
    }

    const updateQuantity = (id: string, increment: boolean) => {
        setOrderItems(
            orderItems.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: increment
                            ? item.quantity + 1
                            : Math.max(1, item.quantity - 1),
                    }
                    : item
            )
        )
    }

    const updatePrice = (id: string, price: number, isDiscounted: boolean) => {
        setOrderItems(
            orderItems.map((item) =>
                item.id === id
                    ? isDiscounted
                        ? { ...item, discountedPrice: price }
                        : { ...item, price }
                    : item
            )
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Detalle del Pedido</h1>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column - Product Selection and Filtering */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Producto</h2>
                        <p className="text-sm text-muted-foreground">
                            Elige el producto que deseas añadir al pedido
                        </p>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar producto" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Filtrar por atributos</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Select value={selectedSize} onValueChange={setSelectedSize}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Talla" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sizes.map((size) => (
                                        <SelectItem key={size} value={size}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedColor} onValueChange={setSelectedColor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Color" />
                                </SelectTrigger>
                                <SelectContent>
                                    {colors.map((color) => (
                                        <SelectItem key={color} value={color}>
                                            {color}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleFilter} className="w-full sm:w-auto">
                            Filtrar
                        </Button>
                    </div>

                    {variations.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Resultados de búsqueda</h2>
                            <div className="grid gap-4">
                                {variations.map((variation) => (
                                    <Card key={variation.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-4 h-4 rounded-full bg-primary" />
                                                        <span className="font-medium">{variation.color}</span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {variation.size}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 text-sm">
                                                        <p>Stock: {variation.stock}</p>
                                                        <p>Precio unitario: S/ {variation.retailPrice}</p>
                                                        <p>Precio mayorista: S/ {variation.wholesalePrice}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => addToOrder(variation)}
                                                >
                                                    Seleccionar
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Order Details */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Detalles del pedido</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Puedes cambiar el precio en el detalle del pedido, esto no afectará el precio del producto.
                        </p>
                        <div className="grid gap-4">
                            {orderItems.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-primary" />
                                                <span className="font-medium">{item.color}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {item.size}
                                                </span>
                                            </div>

                                            <div className="grid sm:grid-cols-4 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Cantidad</label>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => updateQuantity(item.id, false)}
                                                        >
                                                            <MinusCircle className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-8 text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => updateQuantity(item.id, true)}
                                                        >
                                                            <PlusCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Precio</label>
                                                    <div className="flex items-center gap-2">
                                                        <span>S/</span>
                                                        <Input
                                                            type="number"
                                                            value={item.price}
                                                            onChange={(e) =>
                                                                updatePrice(item.id, Number(e.target.value), false)
                                                            }
                                                            className="w-20"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">
                                                        Precio rebajado
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <span>S/</span>
                                                        <Input
                                                            type="number"
                                                            value={item.discountedPrice || ''}
                                                            onChange={(e) =>
                                                                updatePrice(item.id, Number(e.target.value), true)
                                                            }
                                                            className="w-20"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

