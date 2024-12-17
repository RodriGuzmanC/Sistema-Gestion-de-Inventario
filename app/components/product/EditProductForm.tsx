'use client'

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


export function EditProductForm({ productId }: { productId: number }) {
    const router = useRouter()
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [galleryImages, setGalleryImages] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [categoriesOfProduct, setCategoriesOfProduct] = useState<CategoryProductWithRelations[]>([])
    const [productEdit, setProductEdit] = useState<ProductWithFullRelations>()
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setMainImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
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
            
            // Prepara los datos para crear el producto
            const producto: Partial<Product> = {
                nombre_producto: name,
                descripcion: description,
                estado_producto_id: 1,
                precio_mayorista: wholesalePrice,
                precio_unitario: unitPrice,
            }
            const productoNuevo = await ProductService.update(productId, producto)
            console.log(`producto editado: ${productoNuevo}`)
            // Prepara los datos para editar las categorías del producto
            handleSave()

            /*const sampleAsyncFunction = async () => {
              console.log('Funcion asincrona ejecutada');
              return new Promise((resolve) => setTimeout(() => resolve('Listo'), 3000)); // Simulando un retardo
            };
      
            executeAsyncFunction(sampleAsyncFunction);*/

            setIsSubmitting(true)

            //router.push(`/dashboard/productos/${result.id}/crear/variaciones`)
        } catch (error) {
            console.error('Error creating product:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Manejar el cambio de los checkboxes
    const handleCheckboxChange = (categoryId: number, checked: boolean) => {
        setSelectedCategories((prevSelected) =>
            checked
                ? [...prevSelected, categoryId] // Añadir al estado
                : prevSelected.filter((id) => id !== categoryId) // Eliminar del estado
        );
    };

    // Comparar cambios al enviar
    const handleSave = () => {
        const originalIds = categoriesOfProduct.map((c) => c.categoria_id);

        const categoriesToAdd = selectedCategories.filter(
            (id) => !originalIds.includes(id)
        );
        // Categorías a eliminar con "producto_id" incluido
        const categoriesToRemove = categoriesOfProduct
        .filter((c) => !selectedCategories.includes(c.categoria_id))
        .map((c) => ({ id:c.id ,categoria_id: c.categoria_id, producto_id: c.producto_id }));
        const idsToRemove = categoriesToRemove.map((c) => c.id);

       
        console.log("To Add:", categoriesToAdd);
        console.log("To Remove:", idsToRemove);
        
        // Agregar
        const newCategoriesProduct = categoriesToAdd.map((categoryAdd)=>{
            const cat: Partial<CategoryProduct> = {
                producto_id: productId,
                categoria_id: categoryAdd
            }
            return cat
        })
        if(newCategoriesProduct.length > 0) {
            CategoryProductService.createMultiple(newCategoriesProduct)
        }
        // Eliminar
        
        if(idsToRemove.length > 0){
            CategoryProductService.deleteMultiple(idsToRemove)
        }

    };

    // Inicializar el estado con las categorías del producto
    useEffect(() => {
        const initialSelected = categoriesOfProduct.map(
            (category) => category.categoria_id
        );
        setSelectedCategories(initialSelected);
    }, [categoriesOfProduct]);

    useEffect(() => {
        async function cargarCategorias() {
            const data = await CategoryService.getAll()
            setCategories(data)
        }
        async function cargarProductoAEditar() {
            const data = await ProductService.getOne(productId)
            if (data == null) return null
            setProductEdit(data)
            setCategoriesOfProduct(data.categorias_productos)
        }
        cargarProductoAEditar()
        cargarCategorias()
    }, [])


    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Editar producto {productId}</h1>
            
            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nombre del producto</Label>
                        <Input id="name" name="name" defaultValue={productEdit?.nombre_producto} required />
                    </div>

                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" name="description" defaultValue={productEdit?.descripcion} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="unitPrice">Precio unitario</Label>
                            <Input
                                id="unitPrice"
                                name="unitPrice"
                                type="number"
                                step="0.01"
                                defaultValue={productEdit?.precio_unitario}
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
                                defaultValue={productEdit?.precio_mayorista}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Sube una imagen</Label>
                        <div className="mt-2">
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
                    </div>

                    <div>
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
                    </div>

                    <div>
                        <Label>Categorías</Label>
                        <div className="mt-2 space-y-2">
                            {categories.map((category) => {
                                const isChecked = selectedCategories.includes(category.id);
                                return (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={category.id.toString()}
                                            checked={isChecked}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(category.id, Boolean(checked)) // Forzar a boolean
                                            }
                                        />
                                        <Label htmlFor={category.id.toString()}>{category.nombre}</Label>
                                    </div>
                                );
                            })}
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
                            Editando...
                        </>
                    ) : (
                        'Editar'
                    )}
                </Button>
            </form>
        </div>
    )
}

