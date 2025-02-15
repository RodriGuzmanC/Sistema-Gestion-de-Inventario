import AttributeRepository from "@/data/respositories/AttributeRepository";

// Servicio
export default new class AttributeService {
    // Obtener todos los atributos
    async getAll(page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<Attribute>> {
        try {
            // Validar los parámetros de paginación
            if (page <= 0 || itemsPerPage <= 0) {
                throw new Error("Parámetros de paginación inválidos");
            }

            return await AttributeRepository.getAttributes(page, itemsPerPage); // Llamamos al repositorio para obtener los atributos
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('No se obtuvieron los atributos, intentalo más tarde.');
        }
    }

    // Obtener un atributo específico por su ID
    async getOne(id: number): Promise<DataResponse<Attribute>> {
        try {

            // Llamamos al repositorio para obtener el atributo por su ID
            return await AttributeRepository.getAttribute(id);
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('Error al obtener el atributo, intenta más tarde.');
        }
    }

    // Crear un nuevo atributo
    async create(attribute: Partial<Attribute>): Promise<DataResponse<Attribute>> {
        try {
            // Llamamos al repositorio para crear el nuevo atributo
            const res = await AttributeRepository.createAttribute(attribute);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear el atributo, intenta más tarde.');
        }
    }

    // Actualizar un atributo existente
    async update(id: number, updates: Partial<Attribute>): Promise<DataResponse<Attribute>> {
        try {

            // Llamamos al repositorio para actualizar el atributo
            const res = await AttributeRepository.updateAttribute(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar el atributo, intenta más tarde.');
        }
    }

    // Eliminar un atributo
    async delete(id: number): Promise<DataResponse<Attribute>> {
        try {

            // Llamamos al repositorio para eliminar el atributo
            return await AttributeRepository.deleteAttribute(id);
        } catch (error: any) {
            console.error('Error in delete:', error);
            throw new Error('Error al eliminar el atributo, intenta más tarde.');
        }
    }
}
