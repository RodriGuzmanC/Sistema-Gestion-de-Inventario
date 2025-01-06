interface PaginatedResponse<T> {
    data: T[];
    paginacion: {
        pagina_actual: number;
        total_items: number;
        items_por_pagina: number;
        total_paginas: number;
    };
    error?: string | null;  // De nuevo, para manejar posibles errores
};

interface DataResponse<T> {
    data: T;  // Puede ser un solo objeto o un array de objetos
    error?: string | null;  // De nuevo, para manejar posibles errores
};