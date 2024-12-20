'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import DeliveryService from '@/features/delivery/DeliveryService'
import OrderStatusService from '@/features/orders/OrderStatusService'
import OrderService from '@/features/orders/OrderService'
import { toast } from 'sonner'

export interface OrderFormData {
    orderStatusId: number;
    deliveryMethodId: number;
    orderType: number;
    orderDate: Date;
    deliveryDate: Date;
}


export default function CreateOrder() {
    const router = useRouter()
    const [orderDate, setOrderDate] = useState<Date>()
    const [deliveryDate, setDeliveryDate] = useState<Date>()
    const [orderStatusId, setOrderStatusId] = useState<string>()
    const [deliveryMethodId, setDeliveryMethodId] = useState<string>()
    const [orderType, setOrderType] = useState<string>()

    const handleSubmit = async () => {
        try {
            if (!orderDate || !deliveryDate || !orderStatusId || !deliveryMethodId || !orderType) {
                return
            }

            const formData: Partial<Order> = {
                estado_pedido_id: parseInt(orderStatusId),
                metodo_entrega_id: parseInt(deliveryMethodId),
                tipo_pedido: orderType === "1",
                fecha_pedido: orderDate.toDateString(),
                fecha_entrega: deliveryDate.toDateString(),
            }

            // Here you can call your controller with formData
            console.log('Form Data:', formData)
            const nuevoPedido = await OrderService.create(formData)
            console.log("Nuevo pedido")
            console.log(nuevoPedido)
            toast("Se ha creado con exito")
            // Navigate to next page
            router.push(`crear/${nuevoPedido.id}/detalle/crear`)
        } catch (error) {
            console.error(error)
        }
    }

    const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([])
    const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])
    useEffect(() => {
        async function cargar() {
            const deliveryMethods = await DeliveryService.getAll()
            setDeliveryMethods(deliveryMethods)
            const orderStatuses = await OrderStatusService.getAll()
            setOrderStatuses(orderStatuses)
        }
        cargar()
    }, [])
    return (
        <div className="max-w-md space-y-6 p-6">
            <h1 className="text-2xl font-bold">Crear Pedido</h1>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Estado del pedido</label>
                    <Select onValueChange={setOrderStatusId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {orderStatuses.map((status) => (
                                <SelectItem key={status.id} value={status.id.toString()}>
                                    {status.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Método de entrega</label>
                    <Select onValueChange={setDeliveryMethodId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar método" />
                        </SelectTrigger>
                        <SelectContent>
                            {deliveryMethods.map((method) => (
                                <SelectItem key={method.id} value={method.id.toString()}>
                                    {method.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de pedido</label>
                    <Select onValueChange={setOrderType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Mayorista</SelectItem>
                            <SelectItem value="0">Minorista</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha de pedido</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !orderDate && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {orderDate ? format(orderDate, 'PP') : 'Seleccionar fecha'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={orderDate}
                                    onSelect={setOrderDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha de entrega</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !deliveryDate && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {deliveryDate ? format(deliveryDate, 'PP') : 'Seleccionar fecha'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={deliveryDate}
                                    onSelect={setDeliveryDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={handleSubmit}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    )
}

