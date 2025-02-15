'use client'
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import ProductService from '@/features/products/ProductService'
import CategoryService from '@/features/categories/CategoryService'
import CategoryProductService from '@/features/products/CategoryProductService'
import { toast } from 'sonner';
import useSWR from 'swr'
import SharedFormSkeleton from '../global/skeletons/SharedFormSkeleton';
import ErrorPage from '../global/skeletons/ErrorPage';
import { apiRequest } from '@/utils/utils';
import { swrSettings } from '@/utils/swr/settings';

export function CreateProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)


  async function handleSubmit(formData: FormData) {
    try {

      const name = formData.get('name') as string | null || ''
      const description = formData.get('description') as string | null || ''
      const unitPrice = parseFloat(formData.get('unitPrice') as string | null || '0')
      const wholesalePrice = parseFloat(formData.get('wholesalePrice') as string | null || '0')
      const selectedCategories = formData.getAll('categories') as string[];

      // Prepara los datos para crear el producto
      const producto: Partial<Product> = {
        nombre_producto: name,
        descripcion: description,
        estado_producto_id: 1,
        precio_mayorista: wholesalePrice,
        precio_unitario: unitPrice,
      }

      // Peticion para crear un nuevo registro
      const {data: productoNuevo, error}: DataResponse<Product> = await apiRequest({ url: 'products', method: 'POST', body: producto })
      if (error){
        throw new Error(error)
      }
      
      console.log('producto nuevo: ', productoNuevo.id)
      // Prepara los datos para crear las categorías del producto
      const categoriasProducto: Partial<CategoryProduct>[] = selectedCategories.map((selectedCategory) => ({
        producto_id: productoNuevo.id,
        categoria_id: parseInt(selectedCategory, 10),
      }));

      const categoriasNuevas = await CategoryProductService.createMultiple(categoriasProducto);
      console.log('categorias nuevas: ', categoriasNuevas)

      toast("Se ha creado exitosamente")
      router.push(`${productoNuevo.id}/variaciones/crear`)
      setIsSubmitting(true)

      //router.push(`/dashboard/productos/${result.id}/crear/variaciones`)
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const [urlUploadedImage, setUrlUploadedImage] = useState<string | null>(null);

  /*useEffect(() => {
    async function cargarCategorias() {
      const data = await CategoryService.getAll()
      setCategories(data)
    }

    cargarCategorias()
  }, [])*/

  const { data: categories, error, isLoading } = useSWR<PaginatedResponse<Category>>('categories', () => apiRequest({url: 'categories'}), swrSettings)

  if (error) return <ErrorPage></ErrorPage>
  if (isLoading || categories == undefined) return <SharedFormSkeleton></SharedFormSkeleton>

  return (
    <div className="max-w-2xl mx-auto overflow-auto">

      <h1 className="text-2xl font-bold mb-6">Crea una nueva prenda</h1>
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Ingresa el nombre de la nueva prenda</Label>
            <Input id="name" name="name" required />
          </div>

          <div>
            <Label htmlFor="description">Ingresa una descripcion para esa prenda (opcional)</Label>
            <Textarea id="description" name="description" required />
          </div>

          <div className='flex flex-col space-y-2'>
            <Label>Sube una imagen</Label>
            {/*<div className="mt-2">*/}
            {urlUploadedImage ? (
              <img
                alt="asd"
                src={urlUploadedImage}
                width="100"
                height="100"
                style={{ objectFit: 'cover' }} // Puedes usar estilos para el tamaño y el ajuste de la imagen
              />
            ) : (
              <CldUploadWidget
                uploadPreset="preset_alondra_md"
                options={{
                  cloudName: 'daxgq3gzj',
                  apiKey: 'sZsXwdczsIDmTCzt_moZIzrE1bA',

                }}
                onSuccess={(result) => {
                  let imageUrl = null;
                  if (typeof result.info !== 'string') {
                    imageUrl = result?.info?.secure_url ?? null;
                    console.log('Imagen cargada correctamente:', imageUrl);
                  }
                  setUrlUploadedImage(imageUrl)

                }}>
                {({ open }) => {
                  return (
                    <Button variant={'default'} onClick={() => open()}>
                      Upload an Image
                    </Button>
                  );
                }}
              </CldUploadWidget>
            )}
          </div>

          <div>
            <Label>Elige la categoria a la que pertenece esta prenda</Label>
            <div className="mt-2 space-y-2">
              {categories.data.map((category: Category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={category.id.toString()} name="categories" value={category.id} />
                  <Label htmlFor={category.id.toString()}>{category.nombre}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
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
      </form>
    </div>
  )
}

