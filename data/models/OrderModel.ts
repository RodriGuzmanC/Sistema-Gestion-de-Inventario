interface Order {
  id: number;
  codigo: string;
  fecha_pedido: Date;
  fecha_entrega: Date;
  usuario_id: number;
  estado_pedido_id: number;
  metodo_entrega_id: number;
  tipo_pedido: boolean;
}


interface OrderWithRelations extends Order {
  estados_pedidos: OrderStatus[]
  metodos_entregas: DeliveryMethod[]
}