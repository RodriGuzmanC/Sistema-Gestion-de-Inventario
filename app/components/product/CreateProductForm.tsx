'use client'
import { CldImage } from 'next-cloudinary';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ImagePlus, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import ProductService from '@/features/products/ProductService'
import { executeAsyncFunction } from '@/utils/utils'
import CategoryService from '@/features/categories/CategoryService'
import CategoryProductService from '@/features/products/CategoryProductService'
import { toast } from 'sonner';


export function CreateProductForm() {
  const router = useRouter()
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setMainImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Subir archivo a Cloudinary
    /*const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? ''); // Reemplaza con tu upload_preset
    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ''); // Reemplaza con tu cloud_name

    try {

      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('URL de la imagen subida:', data.secure_url); // URL de la imagen en Cloudinary
      alert('Imagen subida con éxito: ' + data.secure_url);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }*/
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setGalleryImages(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

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
      const productoNuevo = await ProductService.create(producto)
      console.log(`producto nuevo: ${productoNuevo}`)
      // Prepara los datos para crear las categorías del producto
      const categoriasProducto: Partial<CategoryProduct>[] = selectedCategories.map((selectedCategory) => ({
        producto_id: productoNuevo.id,
        categoria_id: parseInt(selectedCategory, 10),
      }));

      const categoriasNuevas = await CategoryProductService.createMultiple(categoriasProducto);
      console.log(`categorias nuevas: ${categoriasNuevas}`)

      /*const sampleAsyncFunction = async () => {
        console.log('Funcion asincrona ejecutada');
        return new Promise((resolve) => setTimeout(() => resolve('Listo'), 3000)); // Simulando un retardo
      };

      executeAsyncFunction(sampleAsyncFunction);*/
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

  useEffect(() => {
    async function cargarCategorias() {
      const data = await CategoryService.getAll()
      setCategories(data)
    }

    cargarCategorias()
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      
      <h1 className="text-2xl font-bold mb-6">Crear producto</h1>
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del producto</Label>
            <Input id="name" name="name" required />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unitPrice">Precio unitario</Label>
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="wholesalePrice">Precio mayorista</Label>
              <Input
                id="wholesalePrice"
                name="wholesalePrice"
                type="number"
                step="0.01"
                required
              />
            </div>
          </div>

          {/*<div>
            <Label>Sube una imagen</Label>
            <div className="mt-2">
              <CldImage
                alt='asd'
                src="cld-sample-5"
                width="500" 
                height="500"
                crop={{
                  type: 'auto',
                  source: true
                }}
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  className="hidden"
                  id="mainImage"
                  name="mainImage"
                />
                <label
                  htmlFor="mainImage"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Click para subir imagen
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>*/}

          {/*<div>
            <Label>Subir galería de imágenes</Label>
            <div className="mt-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="hidden"
                  id="gallery"
                  name="gallery"
                />
                <label
                  htmlFor="gallery"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {galleryImages.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          width={100}
                          height={100}
                          className="object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Click para subir imágenes
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>*/}

          <div>
            <Label>Categorías</Label>
            <div className="mt-2 space-y-2">
              {categories.map((category: Category) => (
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

