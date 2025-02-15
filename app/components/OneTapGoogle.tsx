'use client'

import Script from 'next/script'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const GoogleSignInButton = () => {
  const supabase = createClient()
  const router = useRouter()
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false)

  useEffect(() => {
    const loadGoogleScript = () => {
      // Asegurarse de que el script de Google esté cargado
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.onload = () => {
        setIsGoogleScriptLoaded(true) // Marcar como cargado
      }
      document.body.appendChild(script)
    }

    loadGoogleScript()
  }, [])

  useEffect(() => {
    // Solo inicializar el botón de Google si el script se ha cargado
    if (isGoogleScriptLoaded) {
      const initializeGoogleSignIn = () => {
        if (typeof google !== 'undefined' && google.accounts) {
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
            callback: async (response: any) => {
              try {
                // Recuperar el id_token del response
                const { credential } = response
                console.log('ID Token:', credential)

                // Aquí puedes usar el token para autenticar con Supabase
                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: 'google',
                  token: credential,
                })

                if (error) throw error
                console.log('User data:', data)
                // Redirigir después de iniciar sesión
                router.push('/dashboard') // O cualquier ruta protegida
              } catch (error) {
                console.error('Error during Google sign-in:', error)
              }
            },
          })

          // Renderizar el botón de Google Sign-In
          google.accounts.id.renderButton(
            document.getElementById('google-sign-in-button')!, // El contenedor donde se colocará el botón
            {
              theme: 'outline', // Estilo del botón (outline, filled_blue, etc.)
              size: 'large', // Tamaño del botón
              text: 'signin_with', // Texto que aparece en el botón
              shape: 'rectangular', // Forma del botón
            }
          )
        }
      }

      initializeGoogleSignIn()
    }
  }, [isGoogleScriptLoaded])

  return (
    <>
      <div id="google-sign-in-button" className="w-full h-full" />
    </>
  )
}

export default GoogleSignInButton
