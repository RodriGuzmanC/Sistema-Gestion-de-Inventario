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
import { apiRequest, executeAsyncFunction } from '@/utils/utils'
import CategoryService from '@/features/categories/CategoryService'
import CategoryProductService from '@/features/products/CategoryProductService'
import useSWR from 'swr'
import { swrSettings } from '@/utils/swr/settings'
import ErrorPage from '../global/skeletons/ErrorPage'
import { Skeleton } from '@/components/ui/skeleton'
import { CldUploadButton, CldUploadWidget } from 'next-cloudinary'


export function EditProductForm({ productId }: { productId: number }) {
    const router = useRouter()
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [galleryImages, setGalleryImages] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    //const [categories, setCategories] = useState<Category[]>([])
    const [categoriesOfProduct, setCategoriesOfProduct] = useState<CategoryProductWithRelations[]>([])
    //const [productEdit, setProductEdit] = useState<ProductWithFullRelations>()
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [urlUploadedImage, setUrlUploadedImage] = useState<string | null>(null)
    const [oldImagePublicId, setOldImagePublicId] = useState<string | null>(null);

    const handleEditImage = async (result: any) => {
        // Si ya existe una imagen anterior, la eliminamos de Cloudinary
        if (oldImagePublicId) {
            try {
                // Llamamos a la API de Cloudinary para eliminar la imagen anterior
                const response = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/destroy`, {
                    method: 'POST',
                    body: JSON.stringify({
                        public_id: oldImagePublicId, // El ID público de la imagen anterior
                        api_key: 'YOUR_API_KEY', // Tu API Key de Cloudinary
                        timestamp: Math.floor(Date.now() / 1000), // Timestamp necesario para la firma
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Error al eliminar la imagen anterior de Cloudinary');
                }
            } catch (error) {
                console.error('Error al eliminar la imagen anterior de Cloudinary:', error);
            }
        }
    
        // Obtener el public_id de la nueva imagen subida desde el resultado de Cloudinary
        const newImagePublicId = result?.public_id;
    
        // Actualizamos el estado con la nueva URL de la imagen
        const newImageUrl = result?.secure_url; // La URL segura de la imagen subida
        setUrlUploadedImage(newImageUrl); // Actualiza el estado con la nueva imagen
    
        // Guardar el ID público de la nueva imagen para usarlo en futuras eliminaciones
        setOldImagePublicId(newImagePublicId);
    
        // Puedes agregar más lógica aquí si es necesario
    };

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
            .map((c) => ({ id: c.id, categoria_id: c.categoria_id, producto_id: c.producto_id }));
        const idsToRemove = categoriesToRemove.map((c) => c.id);


        console.log("To Add:", categoriesToAdd);
        console.log("To Remove:", idsToRemove);

        // Agregar
        const newCategoriesProduct = categoriesToAdd.map((categoryAdd) => {
            const cat: Partial<CategoryProduct> = {
                producto_id: productId,
                categoria_id: categoryAdd
            }
            return cat
        })
        if (newCategoriesProduct.length > 0) {
            CategoryProductService.createMultiple(newCategoriesProduct)
        }
        // Eliminar

        if (idsToRemove.length > 0) {
            CategoryProductService.deleteMultiple(idsToRemove)
        }

    };

    /**
     * 
     *  CARGA DE DATOS
     * 
     */

    // Cargar CATEGORIAS
    const { data: categories, error: errorCat, isLoading: loadCat } = useSWR<DataResponse<Category[]>>('categories', () => apiRequest({ url: 'categories/' }), swrSettings);

    // Cargar PRODUCTO a editar
    const { data: product, error: errorPro, isLoading: loadPro } = useSWR<DataResponse<ProductWithFullRelations>>('product-edit', () => apiRequest({ url: `products/${productId}` }), swrSettings);

    // Inicializar el estado con las categorías del producto
    useEffect(() => {
        if (product != undefined) {
            setCategoriesOfProduct(product.data.categorias_productos)
            setUrlUploadedImage(product.data.url_imagen ?? null)
        }
        if (categories != undefined) {
            const initialSelected = categoriesOfProduct.map(
                (category) => category.categoria_id
            );
            setSelectedCategories(initialSelected);
        }
    }, [product, categories]);

    if (errorCat || errorPro) return (<ErrorPage></ErrorPage>)
    if (loadCat || loadPro) return (<Skeleton></Skeleton>)
    if (categories == undefined || product == undefined) return (<Skeleton></Skeleton>)

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Editar producto {productId}</h1>

            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nombre del producto</Label>
                        <Input id="name" name="name" defaultValue={product.data.nombre_producto} required />
                    </div>

                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" name="description" defaultValue={product.data.descripcion} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="unitPrice">Precio unitario</Label>
                            <Input
                                id="unitPrice"
                                name="unitPrice"
                                type="number"
                                step="0.01"
                                defaultValue={product.data.precio_unitario}
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
                                defaultValue={product.data.precio_mayorista}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Sube una imagen</Label>
                        <div className="mt-2">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                {urlUploadedImage ? (
                                    <div>
                                    <img
                                        alt="asd"
                                        src={urlUploadedImage}
                                        width="100"
                                        height="100"
                                        style={{ objectFit: 'cover' }} // Puedes usar estilos para el tamaño y el ajuste de la imagen
                                    />
                                    {/*<CldUploadButton uploadPreset="preset_alondra_md" onSuccess={handleEditImage} />*/}


                                    </div>
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
                                                    Sube una imagen
                                                </Button>
                                            );
                                        }}
                                    </CldUploadWidget>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label>Categorías</Label>
                        <div className="mt-2 space-y-2">
                            {categories.data.map((category) => {
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

