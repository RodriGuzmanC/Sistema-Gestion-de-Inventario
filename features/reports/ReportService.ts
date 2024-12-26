import OrderRepository from "@/data/respositories/OrderRepository";
import ReportsRepository from "@/data/respositories/ReportsRepository";


export default new class ReportService {
    // Obtener todos los usuarios
    async getLastOrdersByMonth(): Promise<ReportLastOrdersByMonth[]> {
        try {
            const data = await ReportsRepository.getLastOrdersByMonthRepository();
            // Hace un contenido de la cantidad de productos en cada pedido
            const ordersWithQuantity = data.map((order: ReportLastOrdersByMonth) => {
                const cantidad = order.detalles_pedidos.reduce((acc, detalle) => acc + detalle.cantidad, 0);
                return { ...order, cantidad };
            });

            return ordersWithQuantity
        } catch (error: any) {
            console.error('Error in ReportService:', error.message);
            throw new Error('No se obtuvo el reporte, intenta más tarde.');
        }
    }
}
