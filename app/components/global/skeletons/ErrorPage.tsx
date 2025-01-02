'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function ErrorPage(){

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="bg-destructive/10 p-4 rounded-full">
                        <AlertCircle className="w-12 h-12 text-destructive" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">
                        Algo salió mal al cargar el contenido
                    </h1>
                    <p className="text-muted-foreground">
                        Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center">

                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Volver al inicio
                    </Button>
                </div>
            </div>
        </div>
    )
}

