
interface AttributeType{
    id: number,
    nombre: string
}

/* La interface mas usada, lista los tipos de atributos y en su interior los atributos */
interface AttributeTypesWithAttributes{
    id: number,
    nombre: string,
    atributos: Attribute[]
}