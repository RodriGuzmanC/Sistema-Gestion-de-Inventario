'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarIcon, ChevronDown, User } from 'lucide-react'
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
import SharedFormSkeleton from '@/app/components/global/skeletons/SharedFormSkeleton'
import ClientService from '@/features/client/ClientService'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { z, ZodReadonly } from 'zod'
import { error } from 'console'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';


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
        .string()
        .refine((val) => val === "1" || val === "0", { message: "Selecciona un tipo" }),

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

export default function CreateOrder() {
    const router = useRouter()
    const [orderDate, setOrderDate] = useState<Date>()
    const [deliveryDate, setDeliveryDate] = useState<Date>()
    const [orderStatusId, setOrderStatusId] = useState<string>("")
    const [deliveryMethodId, setDeliveryMethodId] = useState<string>("")
    const [clientId, setClientId] = useState<string>("")
    const [orderType, setOrderType] = useState<string>("")

    const [formErrors, setFormErrors] = useState<any>({});

    const handleSubmitForm: SubmitHandler<Inputs> = async (data) => {
        try {
            // Aqui se crea un objeto "Order" para poder pasarse a el servicio engargado de la creacion de pedidos
            const formData: Partial<Order> = {
                estado_pedido_id: parseInt(data.orderStatusId, 10),
                metodo_entrega_id: parseInt(data.deliveryMethodId, 10),
                tipo_pedido: data.orderType == '1' ? true : false,
                fecha_pedido: data.orderDate.toString(),
                fecha_entrega: data.deliveryDate.toString(),
                cliente_id: parseInt(data.clientId, 10)
            }

            console.log('Form Data:', formData)
            // Crea el pedido
            const nuevoPedido = await OrderService.create(formData)
            console.log("Nuevo pedido")
            console.log(nuevoPedido)
            toast("Se ha creado con exito")
            // Navigate to next page
            router.push(`crear/${nuevoPedido.id}/detalle/crear`)
        } catch (error) {
            if (error instanceof z.ZodError) {
                setFormErrors(error.format());
            } else {
                toast("Ha ocurrido un error, intentalo mas tarde")
                console.error("Error inesperado:", error);
            }
        }
    }

    const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([])
    const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const [nombreClienteNuevo, setNombreClienteNuevo] = useState<string>()
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    useEffect(() => {
        async function cargar() {
            const deliveryMethods = await DeliveryService.getAll()
            setDeliveryMethods(deliveryMethods)
            const orderStatuses = await OrderStatusService.getAll()
            setOrderStatuses(orderStatuses)
            const clientes = await ClientService.getAll()
            setClients(clientes)
            setLoading(false)
        }
        cargar()
    }, [])

    async function crearCliente() {
        try {
            const cuerpoCliente: Partial<Client> = {
                nombre: nombreClienteNuevo
            }
            const nuevoCliente = await ClientService.create(cuerpoCliente)
            toast("Se ha creado el cliente con exito")
            setClients([...clients, nuevoCliente])
            setIsDialogOpen(false)
        } catch (error) {
            toast("Ha ocurrido un error, intentalo mas tarde")
            console.error(error)
        }
    }

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control,
    } = useForm<Inputs>({
        resolver: zodResolver(validationSchema)
    })
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)


    if (loading) {
        return (<SharedFormSkeleton />);
    }
    return (
        <div className="max-w-md space-y-6">
            <h1 className="text-2xl font-bold">Crear Pedido</h1>

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
                                            {clients.map((client) => (
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
                                            A continuacion ingresa el nombre del nuevo cliente, ya sea una marca o una persona, por ejemplo: "Juan Perez" o "Pepsi"
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
                                        {orderStatuses.map((status) => (
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
                                        {deliveryMethods.map((method) => (
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
                                        <SelectItem value="1">Mayorista</SelectItem>
                                        <SelectItem value="0">Minorista</SelectItem>
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
                        Siguiente
                    </Button>
                </div>
            </form >
            {JSON.stringify(watch(), null, 2)}
        </div >
    )
}

