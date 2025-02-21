import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { apiRequest } from '@/utils/utils';
import { Trash, Trash2 } from 'lucide-react';
import React from 'react';
import { useSWRConfig } from 'swr';

export default function DeleteAttributeVarModal(
  {variationId, productId, varAttributeId} : 
  {variationId: number, productId: number, varAttributeId: number}
) {
  const { mutate } = useSWRConfig()

  async function handleDelete() {
    const itemEliminado = await apiRequest(
        { url: `products/${productId}/variations/${variationId}/attributes/${varAttributeId}`, method: 'DELETE' }
    )
    console.log("Item eliminado")
    console.log(itemEliminado)
    mutate('product')
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

