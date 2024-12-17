interface VariationAttribute {
    id: number;
    variacion_id: number;
    atributo_id: number;
  }

  interface VariationAttributeWithRelations extends VariationAttribute{
    atributos: AttributeWithRelations
  }