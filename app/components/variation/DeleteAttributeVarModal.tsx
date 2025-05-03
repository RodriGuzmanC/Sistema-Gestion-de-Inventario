import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { apiRequest } from '@/utils/utils';
import { Trash, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DeleteAttributeVarModal(
  {variationId, productId, varAttributeId, mutate, setParentModalOpen, handleDeleteRow} : 
  {
    variationId: number, 
    productId: number, 
    varAttributeId: number, 
    mutate: () => void, 
    setParentModalOpen: (open: boolean) => void,
    handleDeleteRow: (id: number) => void
  }
) {

  const [open, setOpen] = useState(false)

  async function handleDelete() {
    setOpen(false);
    handleDeleteRow(varAttributeId)

}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

