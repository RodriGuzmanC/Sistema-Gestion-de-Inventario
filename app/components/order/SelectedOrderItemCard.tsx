import { MinusCircle, PlusCircle, Tag, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SelectedOrderItemCardProps {
    item: any
    quitarItemFun: (id: number) => void
    updateQuantity: (id: number, increment: boolean) => void
    updatePrice: (id: number, price: number, isDiscounted: boolean) => void
}

export default function SelectedOrderItemCard({
    item,
    quitarItemFun,
    updateQuantity,
    updatePrice
}: SelectedOrderItemCardProps) {


    return (
        <Card className="relative h-fit overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Información del Producto */}
                    <div className="flex-1 space-y-2">
                        <h3 className="font-medium">
                            {item.nombre_producto}
                        </h3>

                        {/* Atributos */}
                        {item.variacion?.variaciones_atributos.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                {item.variacion?.variaciones_atributos.map((variacionAtributo: any, index: number) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="flex items-center gap-1.5 px-2 py-0.5"
                                    >
                                        <span className="text-xs text-muted-foreground">
                                            {variacionAtributo.atributos.tipos_atributos.nombre}:
                                        </span>
                                        <span className="text-xs font-medium">
                                            {variacionAtributo.atributos.valor}
                                        </span>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <Separator className="sm:hidden" />

                    {/* Controles y Precios */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        {/* Cantidad */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id ?? 0, false)}
                                className="h-8 w-8"
                            >
                                <MinusCircle className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[2rem] text-center font-medium">
                                {item.cantidad}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id ?? 0, true)}
                                className="h-8 w-8"
                            >
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Precios */}
                        <div className="flex items-center gap-4">
                            {/* Precio Regular */}
                            <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">S/</span>
                                <span className="font-medium">{item.precio}</span>
                            </div>

                            {/* Precio Rebajado */}
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">S/</span>
                                <Input
                                    type="number"
                                    value={item.precio_rebajado || ''}
                                    onChange={(e) => updatePrice(item.id ?? 0, Number(e.target.value), true)}
                                    className="h-8 w-20"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive"
                        onClick={()=> {
                            quitarItemFun(item.id)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

