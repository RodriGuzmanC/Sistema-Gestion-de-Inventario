import AttributeTypesRepository from "@/data/respositories/AttributeTypesRepository";

export default new class AttibuteTypesService {
    async getAll(): Promise<AttributeType[]> {
        try {
            return await AttributeTypesRepository.getAttributeTypes();
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('No se obtuvieron los registros, intentalo mas tarde.');
        }
    }

    async getAllWithAttributes(page: number = 1, itemsPerPage: number = 10): Promise<PaginatedResponse<AttributeTypesWithAttributes>> {
        try {
            // Validar los parámetros de paginación
            if (page <= 0 || itemsPerPage <= 0) {
                throw new Error("Parámetros de paginación inválidos");
            }
            return await AttributeTypesRepository.getAttributeTypesWithAttributes(page, itemsPerPage);
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('No se obtuvieron los registros, intentalo mas tarde.');
        }
    }

    async getOne(id: number): Promise<AttributeType | null> {
        try {

            return await AttributeTypesRepository.getAttributeType(id);
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('El tipo de atributo no existe.');
        }
    }

    async delete(id: number): Promise<DataResponse<AttributeType>> {
        try {
            // Llamada al repositorio y logica de negocio
            return await AttributeTypesRepository.deleteAttributeType(id);
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('Error al eliminar, intentalo mas tarde.');
        }
    }

    async update(id: number, updates: Partial<AttributeType>): Promise<DataResponse<AttributeType>> {
        try {

            // Llamada al repositorio y logica de negocio
            const res = await AttributeTypesRepository.updateAttributeType(id, updates);
            return res;
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error al actualizar, intentalo mas tarde.');
        }
    }

    async create(attributeType: Partial<AttributeType>): Promise<DataResponse<AttributeType>> {
        try {
            // Llamada al repositorio y logica de negocio
            const res = await AttributeTypesRepository.createAttributeType(attributeType);
            return res;
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error al crear, intentalo mas tarde.');
        }
    }

    // Otros métodos...
}

