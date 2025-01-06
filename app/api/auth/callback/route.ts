import { createClient } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    console.log('URL de la solicitud:', request.url)  // Esto imprimirá la URL completa con todos los parámetros
    const code = searchParams.get('code')
    console.log('Código de autorización recibido:', code)
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'
    console.log('Redirigiendo a:', next)

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            console.error('Error al intercambiar el código:', error.message)
        } else {
            console.log('Código intercambiado con éxito')
        }

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
        else {
            console.log('No se recibió el código de autorización')
        }

    }

    // return the user to an error page with instructions
    await new Promise(resolve => setTimeout(resolve, 6000))
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    
}