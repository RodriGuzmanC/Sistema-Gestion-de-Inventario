'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Moon, Sun } from 'lucide-react'
import createSupabaseClient from '@/utils/dbClient'
import { signInWithGoogle } from '@/utils/auth/actions'
import { OneTapGoogle } from './components/OneTapGoogle'




export default function ModernLogin() {

  const [isDark, setIsDark] = useState(false)

  async function logIn(){
    const supabase = createSupabaseClient()
  
    const res = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    
  }

  const handleLogin = async () => {
    const response = await signInWithGoogle();
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="rounded-full"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full" onClick={logIn}>
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              {/*<OneTapGoogle></OneTapGoogle>*/}
              
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              placeholder="m@ejemplo.com"
              type="email"
              autoComplete="email"
              required
              className="transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full transition-all duration-200 hover:scale-[1.01]">
            Iniciar sesión
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <a 
              href="#" 
              className="underline underline-offset-4 hover:text-primary"
            >
              Regístrate
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

