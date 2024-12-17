interface Variation {
    id: number;
    producto_id: number;
    precio_unitario: number;
    precio_mayorista: number;
    stock: number;
  }

  interface VariationWithRelations extends Variation{
    variaciones_atributos: VariationAttributeWithRelations[]
  }