'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MinusCircle, PlusCircle } from 'lucide-react'
import ProductService from '@/features/products/ProductService'
import CategoryService from '@/features/categories/CategoryService'
import AttributeTypesService from '@/features/attributes/AttributeTypesService'
import VariationAttributeService from '@/features/variations/VariationAttributeService'
import OrderService from '@/features/orders/OrderService'
import OrderDetailService from '@/features/orders/OrderDetailService.'
import { calcularStockTotal, calcularSubTotal } from '@/utils/utils'

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


interface PrepareOrderDetail extends OrderDetail {
    id: number,
    nombre_producto: string,
    variacion: VariationWithRelations,
}

type Param = {
    id: string
}

export default function OrderDetail({params} : {params: Param}) {
    const [selectedProduct, setSelectedProduct] = useState<string>('')
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [selectedColor, setSelectedColor] = useState<string>('')
    const [filteredVariations, setFilteredVariations] = useState<VariationWithRelations[]>([])
    const [orderItems, setOrderItems] = useState<Partial<PrepareOrderDetail>[]>([])

    const handleFilter = () => {

        console.log("Los filtros elegidos:")
        console.log(selectedValues)

        const valores = Object.values(selectedValues).map((valor) => parseInt(valor));
        console.log(valores)

        // Buscamos las variaciones que coincidan con los atributos seleccionados
        const variacionesFiltradas = producto?.variaciones.filter((variacion) =>
            variacion.variaciones_atributos.some((variacionAtributo) =>
                valores.includes(variacionAtributo.atributo_id)
            )
        );

        console.log("Variaciones filtradas:");
        console.log(variacionesFiltradas);

        // Opcional: Guarda las variaciones en el estado
        setFilteredVariations(variacionesFiltradas ?? []);

    }

    const addToOrder = (variation: VariationWithRelations) => {
        setOrderItems([
            ...orderItems,
            {
                id: orderItems.length + 1,
                pedido_id: parseInt(params.id),
                cantidad: 1,
                precio: variation.precio_unitario,
                precio_rebajado: 0,
                nombre_producto: producto?.nombre_producto ?? '',
                variacion: variation
            },
        ])
    }

    const updateQuantity = (id: number, increment: boolean) => {
        setOrderItems(
            orderItems.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        cantidad: increment
                            ? (item.cantidad ?? 0) + 1
                            : Math.max(1, (item.cantidad ?? 0) - 1),
                    }
                    : item
            )
        )
    }

    const updatePrice = (id: number, price: number, isDiscounted: boolean) => {
        setOrderItems(
            orderItems.map((item) =>
                item.id === id
                    ? isDiscounted
                        ? { ...item, precio_rebajado: price }
                        : { ...item, precio: price }
                    : item
            )
        )
    }

    const [productos, setProductos] = useState<ProductWithBasicRelations[]>([])
    const [producto, setProducto] = useState<ProductWithFullRelations | null>(null)
    const [atributos, setAtributos] = useState<AttributeTypesWithAttributes[]>([])
    const [ordenActual, setOrdenActual] = useState<Order>()
    // Estado para los valores seleccionados de cada filtro
    const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

    // Maneja el cambio de valor de cada filtro
    const handleValueChange = (tipoAtributoId: string, value: string) => {
        setSelectedValues((prevState) => ({
            ...prevState,
            [tipoAtributoId]: value, // Actualiza el valor del filtro correspondiente
        }));
    };

    const handleSubmit = async () => {
        console.log("Orden")
        console.log(orderItems)
        orderItems.map(async (order)=>{
            const ordenPreparada: Partial<OrderDetail> = {
                pedido_id: order.pedido_id,
                cantidad: order.cantidad,
                precio: order.precio,
                precio_rebajado: order.precio_rebajado,
                variacion_id: order.variacion?.id
            }
            const detallePedido = await OrderDetailService.create(ordenPreparada)
            console.log("Ordenes agregadas")
            console.log(detallePedido)
        })
    }

    

    useEffect(() => {
        if (!selectedProduct) return;

        async function obtenerProductoSeleccionado() {
            const producto = await ProductService.getOne(parseInt(selectedProduct))
            setProducto(producto)
        }
        obtenerProductoSeleccionado()
    }, [selectedProduct])


    useEffect(() => {
        async function cargarPedidoPerteneciente(){
            const pedidoActual = await OrderService.getOne(parseInt(params.id))
            if (!pedidoActual) return (<div>Error</div>)
            setOrdenActual(pedidoActual)
        }
        async function cargarProductos() {
            const productos = await ProductService.getAll()
            setProductos(productos)
        }
        async function cargarCategorias() {
            const atributos = await AttributeTypesService.getAllWithAttributes()
            setAtributos(atributos)
        }
        cargarCategorias()
        cargarProductos()
        cargarPedidoPerteneciente()
    }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Detalle del Pedido</h1>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column - Product Selection and Filtering */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Elige el producto</h2>
                        <p className="text-sm text-muted-foreground">
                            Aqui elige el producto a buscar
                        </p>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar producto" />
                            </SelectTrigger>
                            <SelectContent>
                                {productos.map((product) => (
                                    <SelectItem
                                        key={product.id} value={product.id.toString()}>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.url_imagen}
                                                alt={product.nombre_producto}
                                                className="w-8 h-8 object-cover"
                                            />
                                            <p>{product.nombre_producto}</p>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Elige el color o talla del producto</h2>
                        <p className="text-sm text-muted-foreground">Elige el color o talla que estas buscando</p>
                        <form className="grid sm:grid-cols-2 gap-4">
                            {atributos.map((tipoAtributo) => (
                                <Select
                                    value={selectedValues[tipoAtributo.id.toString()] || ''}
                                    onValueChange={(value) => handleValueChange(tipoAtributo.id.toString(), value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={tipoAtributo.nombre.toLowerCase()} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tipoAtributo.atributos.map((atributo) => (
                                            <SelectItem key={atributo.id} value={atributo.id.toString()}>
                                                {atributo.valor}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ))}
                            
                        </form>
                        <Button onClick={handleFilter} className="w-full sm:w-auto">
                            Filtrar
                        </Button>
                    </div>

                    {filteredVariations.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">Resultados de búsqueda</h2>
                            <p className="text-sm text-muted-foreground">Aqui apareceran las variaciones que existen</p>
                            <div className="grid gap-4">
                                {filteredVariations.map((variation) => (
                                    <Card key={variation.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {variation.variaciones_atributos.map((variacionAtributo) => (
                                                            <div className="rounded-full p-2 text-white bg-primary">

                                                                <span className="font-medium">{variacionAtributo.atributos.valor}</span>
                                                            </div>

                                                        ))}
                                                    </div>
                                                    <div className="space-y-1 text-sm">
                                                        <p>Stock: {variation.stock}</p>
                                                        <p>Precio unitario: S/ {variation.precio_unitario}</p>
                                                        <p>Precio mayorista: S/ {variation.precio_mayorista}</p>
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
                    <div className='flex flex-col space-y-2 max-h-[900px] min-h-[500px] p-3 rounded-md border-2 border-opacity-80'>
                        <h2 className="text-lg font-semibold mb-4">Detalles del pedido</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Puedes cambiar el precio en el detalle del pedido, esto no afectará el precio del producto.
                        </p>
                        <div className="overflow-auto flex-1 grid gap-4">
                            {orderItems.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            <h1>{item.nombre_producto}</h1>

                                            <div className="flex items-center gap-2">
                                                {item.variacion?.variaciones_atributos.map((variacionAtributo, index) => (
                                                    <div className="w-auto px-4 py-2 rounded-full bg-primary text-white text-center">
                                                        <span key={index} className="font-medium">
                                                            {variacionAtributo.atributos.valor}
                                                        </span>
                                                    </div>

                                                ))}
                                            </div>

                                            <div className="grid sm:grid-cols-4 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Cantidad</label>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => updateQuantity(item.id ?? 0, false)}
                                                        >
                                                            <MinusCircle className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-8 text-center">{item.cantidad}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => updateQuantity(item.id ?? 0, true)}
                                                        >
                                                            <PlusCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Precio</label>
                                                    <div className="flex items-center gap-2">
                                                        <span>S/{item.precio}</span>
                                                        {/*<Input
                                                            type="number"
                                                            value={item.precio}
                                                            onChange={(e) =>
                                                                updatePrice(item.id ?? 0, Number(e.target.value), false)
                                                            }
                                                            className="w-20"
                                                        />*/}
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
                                                            value={item.precio_rebajado || ''}
                                                            onChange={(e) =>
                                                                updatePrice(item.id ?? 0, Number(e.target.value), true)
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
                            <div>
                                <div>
                                    Cantidad total: {calcularStockTotal(orderItems)}
                                </div>
                                <div>
                                    Subtotal total: S/{calcularSubTotal(orderItems)}
                                </div>
                            <Button onClick={handleSubmit}>
                                Crear pedido
                            </Button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

