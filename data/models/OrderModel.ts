interface Order {
  id: number;
  codigo: string;
  fecha_pedido: string;
  fecha_entrega: string;
  usuario_id: number;
  estado_pedido_id: number;
  metodo_entrega_id: number;
  tipo_pedido: boolean;
  fecha_creacion?: string;
  cliente_id: number;
}


interface OrderWithBasicRelations extends Order {
  estados_pedidos: OrderStatus
  metodos_entregas: DeliveryMethod
}

interface OrderWithFullRelations extends Order {
  estados_pedidos: OrderStatus
  metodos_entregas: DeliveryMethod
  detalles_pedidos: OrderDetailWithFullRelations[]
}


interface PrepareOrderDetail extends OrderDetail {
  id: number,
  nombre_producto: string,
  variacion: VariationWithRelations,
}