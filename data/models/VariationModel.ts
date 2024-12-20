interface Variation {
  id: number;
  producto_id: number;
  precio_unitario: number;
  precio_mayorista: number;
  stock: number;
}

interface VariationWithFullRelations extends Variation {
  productos: Product
  variaciones_atributos: VariationAttributeWithRelations[]
}

interface VariationWithRelations extends Variation {
  variaciones_atributos: VariationAttributeWithRelations[]
}