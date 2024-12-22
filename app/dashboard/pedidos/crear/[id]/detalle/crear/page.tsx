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
import FilteredVariationCard from '@/app/components/order/FilteredVariationCard'
import SelectedOrderItemCard from '@/app/components/order/SelectedOrderItemCard'
import OrderDetailsColumn from '@/app/components/order/OrderDetailColumn'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import VariationService from '@/features/variations/VariationService'

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




type Param = {
    id: string
}

export default function OrderDetail({ params }: { params: Param }) {
    const [selectedProduct, setSelectedProduct] = useState<string>('')
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [selectedColor, setSelectedColor] = useState<string>('')
    const [filteredVariations, setFilteredVariations] = useState<VariationWithRelations[]>([])
    const [orderItems, setOrderItems] = useState<Partial<PrepareOrderDetail>[]>([])

    const [esMayorista, setEsMayorista] = useState<boolean>(true)

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
                precio: esMayorista ? variation.precio_mayorista : variation.precio_unitario,
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
    const router = useRouter()
    // Maneja el cambio de valor de cada filtro
    const handleValueChange = (tipoAtributoId: string, value: string) => {
        setSelectedValues((prevState) => ({
            ...prevState,
            [tipoAtributoId]: value, // Actualiza el valor del filtro correspondiente
        }));
    };

    const handleSubmit = async () => {
        try {
            console.log("Orden")
            console.log(orderItems)
            orderItems.map(async (order) => {
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
                // Restamos lo pedido a la variacion
                if (order.variacion == undefined) throw Error("La variacion no tiene stock")
                if (order.cantidad == undefined) throw Error("Una de las variaciones en la orden tiene una cantidad invalida")

                const cantidadActualizar: Partial<Variation> = {
                    stock: order.variacion?.stock - order.cantidad
                }
                const variacionActualizada = VariationService.update(detallePedido.variacion_id, cantidadActualizar)
                console.log("Nuevo stock de la variacion: ", variacionActualizada)
            })
            toast("Tu pedido ha sido creado correctamente")
            router.push("/dashboard/pedidos")
        } catch (error) {
            console.error("No se puedo crear el detalle del pedido: ", error)
            toast("Ha ocurrido un error, intentalo mas tarde.")
        }
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
        async function cargarPedidoPerteneciente() {
            const pedidoActual = await OrderService.getOne(parseInt(params.id))
            if (!pedidoActual) return (<div>Error</div>)
            setOrdenActual(pedidoActual)
            // Si el pedido es mayorista devolvera true, si no False
            setEsMayorista(pedidoActual.tipo_pedido)
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
            <h1 className="text-2xl font-bold mb-6">Detalla tu nuevo pedido</h1>

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

                                    <FilteredVariationCard variation={variation} addToOrder={addToOrder} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Order Details */}
                <OrderDetailsColumn orderItems={orderItems} setOrderItems={setOrderItems} handleSubmit={handleSubmit} updatePrice={updatePrice} updateQuantity={updateQuantity} ></OrderDetailsColumn>

            </div>
        </div>
    )
}

