import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import AttributeTypesService from "@/features/attributes/AttributeTypesService"
import VariationAttributeService from "@/features/variations/VariationAttributeService"
import VariationService from "@/features/variations/VariationService"
import { swrSettings } from "@/utils/swr/settings"
import { apiRequest } from "@/utils/utils"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import useSWR from "swr"
import ErrorPage from "../global/skeletons/ErrorPage"

export function EditVariationModal({
    variationObj,
    attributeTypes
}: {
    variationObj: VariationWithRelations,
    attributeTypes: AttributeTypesWithAttributes[]
}) {
    const [precioUnitario, setPrecioUnitario] = useState<number>(variationObj.precio_unitario)
    const [precioMayorista, setPrecioMayorista] = useState<number>(variationObj.precio_mayorista)
    const [stock, setStock] = useState<number>(variationObj.stock)

    //const [tiposConAtributos, setTiposConAtributos] = useState<AttributeTypesWithAttributes[]>([])

    // Estado local para manejar las filas de atributos seleccionados
    const [rows, setRows] = useState<
        { id: number; tipoId: number | null; atributoId: number | null }[]
    >([]);

    async function guardarCambios() {
        const variacionCuerpo: Partial<Variation> = {
            producto_id: variationObj.producto_id,
            precio_mayorista: precioMayorista,
            precio_unitario: precioUnitario,
            stock: stock
        }
        //const variacionEditada = await VariationService.update(variationObj.id, variacionCuerpo)
        const variacionEditada = await apiRequest({url: `products/${variationObj.producto_id}/variations/${variationObj.id}`, body: variacionCuerpo, method: 'PUT'})
        // Datos editados mostrados en consola
        console.log("Datos de la variacion editada: ", variacionEditada)
        /*rows.map(async (row) => {
            const variacionAtributoTemp: Partial<VariationAttribute> = {
                variacion_id: variationObj.id,
                atributo_id: row.atributoId ?? 0
            }
            const atributosDeVariacion = await VariationAttributeService.update(row.id, variacionAtributoTemp)
            console.log("Datos del atributo de la variacion editada: ")
            console.log(variacionAtributoTemp)

        })*/
        toast("Se ha editado correctamente")
    }

        // Actualizar el valor de la fila cuando cambia el desplegable
    const handleRowChange = (index: number, tipoId: number | null, atributoId: number | null) => {
        setRows((prevRows) =>
            prevRows.map((row, i) =>
                i === index ? { id: row.id, tipoId: tipoId ?? row.tipoId, atributoId } : row
            )
        );
    };

    function findTipoIdFromAtributoId (atributoId: number): number | null {
        if(attributeTypes){
            for (const type of attributeTypes) {
                if (type.atributos.some((attr) => attr.id === atributoId)) {
                    return type.id;
                }
            }
        }
        return null;
    };

    useEffect(() => {
        if (variationObj.variaciones_atributos.length > 0 && attributeTypes) {
            const initialRows = variationObj.variaciones_atributos.map((attr) => ({
                id: attr.id,
                tipoId: findTipoIdFromAtributoId(attr.atributo_id), // Obtener el tipo_id del atributo actual
                atributoId: attr.atributo_id,
            }));
            setRows(initialRows);
        }
    }, [attributeTypes]);

    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button variant="outline" >Editar variacion</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar variacion</DialogTitle>
                    <DialogDescription>
                        Haz los cambios aqui. Haz clic en guardar una vez hayas terminado.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {rows.map((row, index) => (
                        <div key={index} className="flex items-center gap-4">
                            {/* Desplegable Tipo */}
                            <Select
                                value={row.tipoId?.toString()}
                                onValueChange={(value) =>
                                    handleRowChange(index, Number(value), null)
                                }
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Selecciona Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {attributeTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id.toString()}>
                                            {type.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Desplegable Atributo */}
                            <Select
                                value={row.atributoId?.toString()}
                                onValueChange={(value) =>
                                    handleRowChange(index, row.tipoId, Number(value))
                                }
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Selecciona Atributo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {attributeTypes
                                        .find((type) => type.id === row.tipoId)
                                        ?.atributos.map((attr) => (
                                            <SelectItem key={attr.id} value={attr.id.toString()}>
                                                {attr.valor}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="precioUnitario" className="text-right">
                            Precio unitario
                        </Label>
                        <Input
                            id="precioUnitario"
                            defaultValue={precioUnitario}
                            onChange={(e) => setPrecioUnitario(parseFloat(e.currentTarget.value))}
                            className="col-span-3"
                            type="number"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="precioMayorista" className="text-right">
                            Precio mayorista
                        </Label>
                        <Input
                            id="precioMayorista"
                            defaultValue={precioMayorista}
                            onChange={(e) => setPrecioMayorista(parseFloat(e.currentTarget.value))}

                            className="col-span-3"
                            type="number"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right">
                            Stock
                        </Label>
                        <Input
                            id="stock"
                            defaultValue={stock}
                            onChange={(e) => setStock(parseFloat(e.currentTarget.value))}

                            className="col-span-3"
                            type="number"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={guardarCambios}>Guardar cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
