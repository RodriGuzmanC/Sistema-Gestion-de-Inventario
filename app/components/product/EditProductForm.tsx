'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import ProductService from '@/features/products/ProductService'
import { apiRequest } from '@/utils/utils'
import useSWR from 'swr'
import { swrSettings } from '@/utils/swr/settings'
import ErrorPage from '../global/skeletons/ErrorPage'
import { Skeleton } from '@/components/ui/skeleton'
import ImageUploadModal from './ImageUploadWidget'
import { useRouter } from 'next/navigation'


export function EditProductForm({ productId }: { productId: number }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    //const [categories, setCategories] = useState<Category[]>([])
    const [categoriesOfProduct, setCategoriesOfProduct] = useState<CategoryProductWithRelations[]>([])
    //const [productEdit, setProductEdit] = useState<ProductWithFullRelations>()
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [urlUploadedImage, setUrlUploadedImage] = useState<string | null>(null)
    const [showUploadModal, setShowUploadModal] = useState(false);

    const router = useRouter()

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
                url_imagen: urlUploadedImage ?? '',
            }
            const productoNuevo = await ProductService.update(productId, producto)
            console.log(`producto editado: ${productoNuevo}`)
            // Prepara los datos para editar las categorías del producto
            handleSave()

            setIsSubmitting(true)

            router.push(`/dashboard/productos`)
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
    const handleSave = async () => {
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
            for (const category of newCategoriesProduct) {
                const { error }: PaginatedResponse<Category> = await apiRequest({
                    url: `products/${productId}/categories`,
                    method: 'POST',
                    body: category
                });
                if (error) {
                    throw new Error(error);
                }
            }
        }
        // Eliminar

        if (idsToRemove.length > 0) {
            for (const id of idsToRemove) {
                const { error }: PaginatedResponse<Category> = await apiRequest({
                    url: `products/${productId}/categories/${id}`,
                    method: 'DELETE'
                });

                if (error) {
                    throw new Error(error);
                }
            }
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

    useEffect(() => {
        if (product && categories) {
            const productCategories = product.data.categorias_productos;
            setCategoriesOfProduct(productCategories);
            setUrlUploadedImage(product.data.url_imagen ?? null);

            const initialSelected = productCategories.map((category) => category.categoria_id);
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
                        <Label>Imagen del producto</Label>
                        <div className="mt-2">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                {/*urlUploadedImage ? (
                                    <div>
                                    <img
                                        alt="asd"
                                        src={urlUploadedImage}
                                        width="100"
                                        height="100"
                                        style={{ objectFit: 'cover' }}
                                    />
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
                                )*/}
                                {urlUploadedImage && (
                                    <img src={urlUploadedImage} alt="Producto" className="w-32 h-32 object-cover mb-4" />
                                )}

                                <Button type="button" variant="default" onClick={() => setShowUploadModal(true)}>
                                    {urlUploadedImage ? 'Reemplazar imagen' : 'Subir imagen'}
                                </Button>

                                <ImageUploadModal
                                    isOpen={showUploadModal}
                                    onClose={() => setShowUploadModal(false)}
                                    onImageUploaded={(url) => setUrlUploadedImage(url)}
                                    mode={urlUploadedImage ? 'reemplazar' : 'subir'}
                                    currentImageUrl={urlUploadedImage || undefined}
                                />
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

