'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner';
import useSWR from 'swr'
import SharedFormSkeleton from '../global/skeletons/SharedFormSkeleton';
import ErrorPage from '../global/skeletons/ErrorPage';
import { apiRequest } from '@/utils/utils';
import { swrSettings } from '@/utils/swr/settings';
import ImageUploadModal from './ImageUploadWidget';

export function CreateProductForm() {
  const router = useRouter();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [urlUploadedImage, setUrlUploadedImage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener categorías
  const { data: categories, error, isLoading } = useSWR('categories', () =>
    apiRequest({ url: 'categories' }), swrSettings
  );

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const producto: Partial<Product> = {
        nombre_producto: name,
        descripcion: description,
        estado_producto_id: 1,
        precio_unitario: parseFloat(unitPrice) || 0,
        precio_mayorista: parseFloat(wholesalePrice) || 0,
        url_imagen: urlUploadedImage ?? '',
      };

      const { data: productoNuevo, error } = await apiRequest({
        url: 'products',
        method: 'POST',
        body: producto,
      });

      if (error) throw new Error(error);

      const categoriasProducto = selectedCategories.map((id) => ({
        producto_id: productoNuevo.id,
        categoria_id: parseInt(id, 10),
      }));

      await Promise.all(
        categoriasProducto.map((categoria) =>
          apiRequest({
            url: `products/${productoNuevo.id}/categories`,
            method: 'POST',
            body: categoria,
          })
        )
      );

      toast('Se ha creado exitosamente');
      router.push(`${productoNuevo.id}/variaciones/crear`);
    } catch (err) {
      console.error('Error creating product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <ErrorPage />;
  if (isLoading || !categories) return <SharedFormSkeleton />;

  return (
    <div className="max-w-2xl mx-auto overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Crea una nueva prenda</h1>

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="unitPrice">Precio unitario</Label>
            <Input
              type="number"
              id="unitPrice"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="wholesalePrice">Precio mayorista</Label>
            <Input
              type="number"
              id="wholesalePrice"
              value={wholesalePrice}
              onChange={(e) => setWholesalePrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button type="button" onClick={() => setIsModalOpen(true)}>
              Subir Imagen
            </Button>
            {urlUploadedImage && (
              <img
                src={urlUploadedImage}
                alt="Imagen subida"
                width="100"
                height="100"
                style={{ objectFit: 'cover' }}
              />
            )}
            <ImageUploadModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onImageUploaded={(url) => {
                setUrlUploadedImage(url);
                setIsModalOpen(false);
              }}
            />
          </div>

          <div>
            <Label>Categorías</Label>
            <div className="mt-2 space-y-2">
              {categories.data.map((category: Category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id.toString())}
                    onCheckedChange={() => handleCategoryToggle(category.id.toString())}
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.nombre}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            'Crear'
          )}
        </Button>
      </div>
    </div>
  );
}
