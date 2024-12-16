
interface AttributeType{
    id: number,
    nombre: string
}

interface AttributeTypesWithAttributes{
    id: number,
    nombre: string,
    atributos: Attribute[]
}