import { FormEvent, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HandleSubmitServer } from '../server/handle-submit'




export default function AddProductForm() {


    return (
            <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Crear producto</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={HandleSubmitServer} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Nombre</Label>
                        <Input
                            id="title"
                            name="title"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripcion</Label>
                        <Input
                            id="description"
                            name="description"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price_min">Precio minorista</Label>
                        <Input
                            id="price_min"
                            name="price_min"
                            type="number"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price_max">Precio mayorista</Label>
                        <Input
                            id="price_max"
                            name="price_max"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select name='estado'>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">En proceso</SelectItem>
                                <SelectItem value="2">Acabado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full">Crear producto</Button>
                </form>
            </CardContent>
        </Card>
    )
}