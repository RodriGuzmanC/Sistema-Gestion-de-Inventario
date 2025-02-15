'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun } from 'lucide-react'
import { login } from '@/features/auth/SignWithPassword'
import GoogleSignInButton from '../components/OneTapGoogle'


export default function ModernLogin() {

  const [isDark, setIsDark] = useState(false)

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

      <form action={login}>
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
              <GoogleSignInButton />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              placeholder="m@ejemplo.com"
              type="email"
              name='email'
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
              name='password'
              autoComplete="current-password"
              required
              className="transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full transition-all duration-200 hover:scale-[1.01]" type='submit' formAction={login}>
            Iniciar sesión
          </Button>
          
        </CardFooter>
      </Card>
      </form>
    </div>
  )
  
}

