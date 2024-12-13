import AttributeTypesRepository from "@/data/respositories/AttributeTypesRepository";

export default new class AttibuteTypesService {
    async getAllAttributes(): Promise<AttributeType[]> {
        try {
            return await AttributeTypesRepository.getAttributes();
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('Unable to fetch products from service');
        }
    }

    // Otros métodos...
}

