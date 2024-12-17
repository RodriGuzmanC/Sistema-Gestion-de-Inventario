interface CategoryProduct {
    id: number;
    producto_id: number;
    categoria_id: number;
  }

  interface CategoryProductWithRelations extends CategoryProduct{
    categorias: Category[]
  }