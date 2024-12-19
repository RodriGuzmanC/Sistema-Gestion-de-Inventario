interface Product {
  id: number;
  nombre_producto: string;
  descripcion?: string;
  url_imagen: string;
  precio_unitario: number;
  precio_mayorista: number;
  estado_producto_id: number;
  stock: number;
}

interface ProductWithFullRelations extends Product {
  estados_productos: ProductStatus[];
  galerias: Gallery[]
  variaciones: VariationWithRelations[]
  categorias_productos: CategoryProductWithRelations[]
  publicaciones: PublicationWithRelations[]
}




interface ProductWithBasicRelations extends Product {
  estados_productos: ProductStatus[];
  galerias: Gallery[]
  variaciones: Variation[]
  categorias_productos: CategoryProductWithRelations[]
}