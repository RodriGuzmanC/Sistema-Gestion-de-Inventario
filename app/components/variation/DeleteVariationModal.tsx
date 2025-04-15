import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { apiRequest } from '@/utils/utils';
import { Trash, Trash2 } from 'lucide-react';
import React from 'react';
import { useSWRConfig } from 'swr';

export default function DeleteVariationModal(
  {variationId, productId} : 
  {variationId: number, productId: number}
) {
  const { mutate } = useSWRConfig()

  const handleDelete = async () => {
    // Llamado a la api
    try {
        const { error } : DataResponse<Variation> = await apiRequest({ url: `products/${productId}/variations/${variationId}`, method: 'DELETE' })
        if (error) {
          throw new Error("Error al eliminar la variación")
        }
        mutate('product')
        console.log("Se elimino bien")
    } catch (error) {
        console.log("No se elimino")
        if (error instanceof Error) {
          alert(error.message)
        }
    }
}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            ¿Estás seguro de eliminar esta variación?
          </DialogTitle>
          
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => { }} className="mr-2">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            <Trash size={16} />
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

