interface Attribute{
    id: number,
    tipo_atributo_id: number,
    valor: string
}

interface AttributeWithRelations extends Attribute {
    tipos_atributos: AttributeType
}