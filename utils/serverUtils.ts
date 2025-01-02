// Manejar errores personalizados
export function handleError(error: any): Response {

    // Si es un error normal (Error nativo de JS)
    if (error instanceof Error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
    // Si el error no es un tipo conocido, puedes manejarlo como un error desconocido
    return new Response(
        JSON.stringify({ error: "Unknown error occurred" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
    );
}

