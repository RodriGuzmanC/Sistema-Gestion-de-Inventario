interface Product {
  id: number;
  nombre_producto: string;
  descripcion?: string;
  url_imagen: string;
  precio_unitario: number;
  precio_mayorista: number;
  estado_producto_id: number;
}

interface ProductWithRelations extends Product {
  estados_productos: ProductStatus[];
  galerias: Gallery[]
  variaciones: Variation[]
  categorias_productos: CategoryProduct[]
  publicaciones: Publication[]
}