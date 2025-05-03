'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarIcon } from 'lucide-react'
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

import { toast } from 'sonner'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR, { useSWRConfig } from 'swr'
import { swrSettings } from '@/utils/swr/settings'
import { apiRequest } from '@/utils/utils'
import ErrorPage from '@/app/components/global/skeletons/ErrorPage'
import OrderCardSkeleton from '@/app/components/skeletons/OrderSkeleton'


export interface OrderFormData {
    orderStatusId: number;
    deliveryMethodId: number;
    orderType: number;
    orderDate: Date;
    deliveryDate: Date;
}

const validationSchema = z.object({
    orderStatusId: z
        .string()
        .refine((val) => val.trim().length > 0, { message: "El estado de la orden es requerido" })
        .transform((val) => (val ? parseInt(val, 10) : undefined)),

    deliveryMethodId: z
        .string()
        .refine((val) => val.trim().length > 0, { message: "El metodo de delivery es requerido" })
        .transform((val) => (val ? parseInt(val, 10) : undefined)),

    orderType: z
        .string(),

    orderDate: z
        .date()
        .refine((date) => !isNaN(date.getTime()), { message: "Selecciona una fecha de pedido" })
        .transform((date) => date.toDateString()),

    deliveryDate: z
        .date()
        .refine((date) => !isNaN(date.getTime()), { message: "Selecciona una fecha de entrega" })
        .transform((date) => date.toDateString()),

    clientId: z
        .string()
        .refine((val) => val.trim().length > 0, { message: "El cliente es requerido" })
        .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

type Inputs = {
    orderStatusId: string;
    deliveryMethodId: string;
    orderType: string;
    orderDate: Date;
    deliveryDate: Date;
    clientId: string;
}

type Param = {
    id: string
  }

export default function CreateOrder({ params }: { params: Param }) {
    const router = useRouter()

    const handleSubmitForm: SubmitHandler<Inputs> = async (data) => {
        try {
            // Aqui se crea un objeto "Order" para poder pasarse a el servicio engargado de la creacion de pedidos
            const formData: Partial<Order> = {
                estado_pedido_id: parseInt(data.orderStatusId, 10),
                metodo_entrega_id: parseInt(data.deliveryMethodId, 10),
                tipo_pedido: data.orderType == "mayorista" || data.orderType == "minorista"
                ? data.orderType
                : "mayorista",
                categoria_pedido: "entrada",
                fecha_pedido: data.orderDate.toString(),
                fecha_entrega: data.deliveryDate.toString(),
                cliente_id: parseInt(data.clientId, 10)
            }

            console.log('Form Data:', formData)
            // Crea el pedido
            const nuevoPedido: DataResponse<Order> = await apiRequest({ url: `orders/${params.id}`, method: 'PUT', body: formData })
            console.log("Pedido editado")
            console.log(nuevoPedido)
            toast("Se ha editado con exito")
            // Navigate to next page
            router.push(`/dashboard/pedidos`)
        } catch (error) {
            if (error instanceof z.ZodError) {
                alert(error.message)
            } else {
                toast("Ha ocurrido un error, intentalo mas tarde")
                console.error("Error inesperado:", error);
            }
        }
    }

    const [nombreClienteNuevo, setNombreClienteNuevo] = useState<string>()
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    const { mutate } = useSWRConfig()

    async function crearCliente() {
        try {
            const cuerpoCliente: Partial<Client> = {
                nombre: nombreClienteNuevo
            }
            const { error } : DataResponse<Client> = await apiRequest({ url: 'clients', method: 'POST', body: cuerpoCliente })
            if (error) {
                toast("Error al crear el cliente")
                throw new Error("Error al crear el cliente")
            }
            toast("Se ha creado el cliente con exito")
            mutate('clients')
            setIsDialogOpen(false)
        } catch (error) {
            toast("Ha ocurrido un error, intentalo mas tarde")
            console.error(error)
        }
    }

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<Inputs>({
        resolver: zodResolver(validationSchema)
    })

    // Hook SWR para obtener el pedido
    const { data: orderToEdit, error: orderError, isLoading: isOrderLoading } = useSWR<DataResponse<Order>>('order-edit',
        () => apiRequest({ url: `orders/${params.id}` }),
        swrSettings
    );

    useEffect(() => {
        if (orderToEdit) {
            reset({
                orderStatusId: orderToEdit.data.estado_pedido_id.toString(),
                deliveryMethodId: orderToEdit.data.metodo_entrega_id.toString(),
                orderType: orderToEdit.data.tipo_pedido,
                orderDate: new Date(orderToEdit.data.fecha_pedido),
                deliveryDate: new Date(orderToEdit.data.fecha_entrega),
                clientId: orderToEdit.data.cliente_id.toString()
            });
        }
    }, [orderToEdit, reset]);

    // Hook SWR para obtener los estados de las órdenes
    const { data: clients, error: clientsError, isLoading: clientsLoading } = useSWR<PaginatedResponse<Client>>('clients', () => apiRequest({ url: 'clients' }), swrSettings)

    // Hook SWR para obtener los estados de las órdenes
    const { data: orderStatuses, error: orderStatusesError, isLoading: isLoadingOrderStatuses } = useSWR<PaginatedResponse<OrderStatus>>('order-statuses', () => apiRequest({ url: 'orders/order-statuses/' }), swrSettings)

    // Hook SWR para obtener los métodos de entrega
    const { data: deliveryMethods, error: deliveryMethodsError, isLoading: isLoadingDeliveryMethods } = useSWR<PaginatedResponse<DeliveryMethod>>('delivery-methods', () => apiRequest({ url: 'orders/delivery-methods/' }), swrSettings)

    // Manejo de errores
    if (orderStatusesError || deliveryMethodsError || clientsError || orderError) {
        return <ErrorPage />;
    }

    // Manejo de carga
    if (isLoadingOrderStatuses || isLoadingDeliveryMethods || clientsLoading || isOrderLoading || !orderStatuses || !deliveryMethods || !clients || !orderToEdit) {
        return <OrderCardSkeleton key={1} />
    }


    return (
        <div className="max-w-md space-y-6">
            <h1 className="text-2xl font-bold">Editar pedido</h1>

            <form onSubmit={handleSubmit(handleSubmitForm)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Elige el cliente</label>
                        <div className='flex items-center space-x-2'>
                            <Controller
                                name="clientId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el cliente aqui" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.data.map((client) => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />


                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="default" className="w-fit justify-start text-left font-normal">
                                        Crear nuevo cliente
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Crea un nuevo cliente</DialogTitle>
                                        <DialogDescription>
                                            A continuacion ingresa el nombre del nuevo cliente, ya sea una marca o una persona, por ejemplo: 'Juan Perez' o 'Pepsi'
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Nombre
                                            </Label>
                                            <Input
                                                id="name"
                                                className="col-span-3"
                                                placeholder="Nombre del cliente"
                                                value={nombreClienteNuevo}
                                                onChange={(e) => setNombreClienteNuevo(e.target.value)}
                                            />
                                        </div>

                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={() => crearCliente()}>Crear cliente</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        {errors.clientId?.message && <p className="text-red-500 text-sm">{errors.clientId?.message}</p>}
                    </div>


                    <div className="space-y-2">
                        <label className="text-sm font-medium">Selecciona el estado del pedido</label>
                        <Controller
                            name='orderStatusId'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el estado aqui" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orderStatuses.data.map((status) => (
                                            <SelectItem key={status.id} value={status.id.toString()}>
                                                {status.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.orderStatusId?.message && <p className="text-red-500 text-sm">{errors.orderStatusId?.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Selecciona el método de entrega</label>
                        <Controller
                            name='deliveryMethodId'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el metodo aqui" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {deliveryMethods.data.map((method) => (
                                            <SelectItem key={method.id} value={method.id.toString()}>
                                                {method.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.deliveryMethodId?.message && <p className="text-red-500 text-sm">{errors.deliveryMethodId?.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Selecciona el tipo de pedido</label>
                        <Controller
                            name='orderType'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el tipo aqui" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mayorista">Mayorista</SelectItem>
                                        <SelectItem value="minorista">Minorista</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.orderType?.message && <p className="text-red-500 text-sm">{errors.orderType?.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Fecha de pedido</label>
                            <Controller
                                name="orderDate"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, 'PP') : 'Seleccionar fecha'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">

                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => field.onChange(date)}
                                                initialFocus
                                            />

                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.orderDate?.message && <p className="text-red-500 text-sm">{errors.orderDate?.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Fecha de entrega</label>
                            <Controller
                                name="deliveryDate"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, 'PP') : 'Seleccionar fecha'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">

                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => field.onChange(date)}
                                                initialFocus
                                            />

                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.deliveryDate?.message && <p className="text-red-500 text-sm">{errors.deliveryDate?.message}</p>}
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        type='submit'
                    >
                        Guardar cambios
                    </Button>
                </div>
            </form >
        </div >
    )
}

