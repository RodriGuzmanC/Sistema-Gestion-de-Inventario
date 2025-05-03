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
import { apiRequest } from "@/utils/utils"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import DeleteAttributeVarModal from "./DeleteAttributeVarModal"

export function EditVariationModal({
    variationObj,
    attributeTypes,
    mutate
}: {
    variationObj: VariationWithRelations,
    attributeTypes: AttributeTypesWithAttributes[],
    mutate: () => void
}) {
    const [precioUnitario, setPrecioUnitario] = useState<number>(variationObj.precio_unitario)
    const [precioMayorista, setPrecioMayorista] = useState<number>(variationObj.precio_mayorista)
    const [stock, setStock] = useState<number>(variationObj.stock)
    const [open, setOpen] = useState(false); // <-- nuevo estado

    // Estado local para manejar las filas de atributos seleccionados
    const [rows, setRows] = useState<
        { id: number; tipoId: number | null; atributoId: number | null }[]
    >([]);

    // Estado para almacenar el estado inicial de las filas
    const [initialRows, setInitialRows] = useState<
        { id: number; tipoId: number | null; atributoId: number | null }[]
    >([])

    async function guardarCambios() {
        // Edita los campos de precios y stock de la variacion
        const variacionCuerpo: Partial<Variation> = {
            producto_id: variationObj.producto_id,
            precio_mayorista: precioMayorista,
            precio_unitario: precioUnitario,
            stock: stock
        }
        // Compara solo los campos relevantes
        const cambiosDetectados =
            variacionCuerpo.precio_mayorista !== variationObj.precio_mayorista ||
            variacionCuerpo.precio_unitario !== variationObj.precio_unitario ||
            variacionCuerpo.stock !== variationObj.stock;

        if (cambiosDetectados) {
            const variacionEditada = await apiRequest({ url: `products/${variationObj.producto_id}/variations/${variationObj.id}`, body: variacionCuerpo, method: 'PUT' })
            // Datos editados mostrados en consola
            console.log("Datos de la variacion editada: ", variacionEditada)
        }

        // 2. Eliminar atributos que ya no están
        const rowsIds = rows.map(row => row.id).filter(id => id !== 0); // ignorar los nuevos
        const eliminados = initialRows.filter(initialRow => !rowsIds.includes(initialRow.id));

        for (const eliminado of eliminados) {
            await apiRequest({
                url: `products/${variationObj.producto_id}/variations/${variationObj.id}/attributes/${eliminado.id}`,
                method: 'DELETE'
            });
            console.log("Atributo eliminado:", eliminado);
        }

        // 3. Agregar nuevos y editar existentes
        for (const row of rows) {
            if (row.id === 0) {
                // Nuevo atributo
                const nuevoAtributo: Partial<VariationAttribute> = {
                    variacion_id: variationObj.id,
                    atributo_id: row.atributoId ?? 0
                };
                const creado: DataResponse<VariationAttribute> = await apiRequest({
                    url: `products/${variationObj.producto_id}/variations/${variationObj.id}/attributes`,
                    body: nuevoAtributo,
                    method: 'POST'
                });
                // Actualiza el estado de rows con el ID creado
                setRows(prev =>
                    prev.map(r =>
                        r === row ? { ...r, id: creado.data.id } : r
                    )
                );
                console.log("Nuevo atributo de variación añadido:", creado);
            } else {
                const initialRow = initialRows.find((r) => r.id === row.id);
                if (initialRow) {
                    if (row.tipoId !== initialRow.tipoId || row.atributoId !== initialRow.atributoId) {
                        const variacionAtributoEditada: Partial<VariationAttribute> = {
                            variacion_id: variationObj.id,
                            atributo_id: row.atributoId ?? 0
                        }
                        const atributosDeVariacion = await apiRequest({
                            url: `products/${variationObj.producto_id}/variations/${variationObj.id}/attributes/${row.id}`,
                            body: variacionAtributoEditada,
                            method: 'PUT'
                        })
                        console.log("Datos del atributo de la variacion editada: ", atributosDeVariacion)
                    }
                }
            }
        }

        mutate()
        toast("Se ha editado correctamente")
        setOpen(false); // <-- cierra el modal

    }

    // Actualizar el valor de la fila cuando cambia el desplegable
    const handleRowChange = (index: number, tipoId: number | null, atributoId: number | null) => {
        setRows((prevRows) =>
            prevRows.map((row, i) =>
                i === index ? { id: row.id, tipoId: tipoId ?? row.tipoId, atributoId } : row
            )
        );
    };

    function findTipoIdFromAtributoId(atributoId: number): number | null {
        if (attributeTypes) {
            for (const type of attributeTypes) {
                if (type.atributos.some((attr) => attr.id === atributoId)) {
                    return type.id;
                }
            }
        }
        return null;
    };


    function handleAddNewItem() {
        const nuevasFilas = [...rows,
        {
            id: 0,
            atributoId: 0,
            tipoId: 0
        }]
        setRows(nuevasFilas)
        console.log(rows)
    }

    function handleDeleteRow(varAttributeId: number) {
        const nuevasFilas = rows.filter((row) => row.id !== varAttributeId)
        setRows(nuevasFilas)
    }

    useEffect(() => {
        if (variationObj.variaciones_atributos.length > 0 && attributeTypes) {
            const initial = variationObj.variaciones_atributos.map((attr) => ({
                id: attr.id,
                tipoId: findTipoIdFromAtributoId(attr.atributo_id), // Obtener el tipo_id del atributo actual
                atributoId: attr.atributo_id,
            }));
            setRows(initial);
            setInitialRows(initial)
        }
    }, [attributeTypes]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" >Editar variacion</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
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

                            {/* Boton de eliminar */}

                            <DeleteAttributeVarModal
                                productId={variationObj.producto_id}
                                variationId={variationObj.id}
                                varAttributeId={row.id}
                                mutate={mutate}
                                setParentModalOpen={setOpen}
                                handleDeleteRow={handleDeleteRow}
                            ></DeleteAttributeVarModal>
                        </div>
                    ))}
                    <Button
                        variant={'outline'}
                        size="icon"
                        className="w-full"
                        onClick={handleAddNewItem}
                    >
                        Agregar uno mas
                        <Plus></Plus>
                    </Button>
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
