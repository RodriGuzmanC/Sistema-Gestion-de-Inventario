interface Invoice {
    id: number,
    cliente_id: number,
    fecha_emision: string,
    total: number,
}

interface InvoiceOrder {
    id: number,
    boleta_id: number,
    pedido_id: number,
}

interface InvoiceOrderWithFullRelations extends InvoiceOrder {
    pedidos: OrderWithFullRelations,
}



interface InvoiceWithFullRelations extends Invoice {
    clientes: Client
    boletas_pedidos: InvoiceOrderWithFullRelations[],
}