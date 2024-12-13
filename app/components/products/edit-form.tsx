import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EditFormProps {
    id: number
    title: string
    description: string
    price_min: number
    price_max: number
    estado_producto_id: number
}

export default function EditProductForm({
    id,
    title,
    description,
    price_min,
    price_max,
    estado_producto_id
} : EditFormProps) {

    const [formData, setFormData] = useState({
        id: id,
        title: title,
        description: description,
        price_min: price_min,
        price_max: price_max,
        estado_producto_id: estado_producto_id
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleEstadoId = (value: string) => {
        setFormData(prevData => ({
            ...prevData,
            estado_producto_id: parseInt(value)
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // Here you would typically send the data to your backend
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Editar producto</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Nombre</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripcion</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price_min">Precio minorista</Label>
                        <Input
                            id="price_min"
                            name="price_min"
                            type="number"
                            value={formData.price_min}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price_max">Precio mayorista</Label>
                        <Input
                            id="price_max"
                            name="price_max"
                            value={formData.price_max}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select onValueChange={handleEstadoId} value={formData.estado_producto_id.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">En proceso</SelectItem>
                                <SelectItem value="2">Acabado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full">Editar producto</Button>
                </form>
            </CardContent>
        </Card>
    )
}