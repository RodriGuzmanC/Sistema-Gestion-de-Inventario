import { EditProductForm } from "@/app/components/product/EditProductForm";

type Param = {
    id: string
}

export default function CreateProductPage({ params }: { params: Param }) {

  return <EditProductForm productId={parseInt(params.id)} />
}

