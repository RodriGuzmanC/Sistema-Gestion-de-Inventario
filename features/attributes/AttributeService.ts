import AttributeRepository from "@/data/respositories/AttributeRepository";

export default new class AttibuteTypesService {
    async getAllAttributes(): Promise<Attribute[]> {
        try {
            return await AttributeRepository.getAttributes();
        } catch (error: any) {
            console.error('Error in AttributeService:', error.message);
            throw new Error('Unable to fetch products from service');
        }
    }

    // Otros métodos...
}
