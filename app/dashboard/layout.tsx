"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Package, ClipboardList, Share2, LogOut, User, Menu } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('Productos')
  const userName = "John Doe" // Replace with actual user name

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between py-6">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <h2 className="mb-4 px-4 text-2xl font-bold tracking-tight text-white">
            Alondra Moda
          </h2>
          <div className="space-y-1">
            {['Productos', 'Pedidos', 'Redes'].map((item) => (
              <Button
                key={item}
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white hover:bg-blue-600 transition-all duration-200 ${
                  activeMenu === item ? 'bg-blue-600 font-medium' : ''
                }`}
                onClick={() => setActiveMenu(item)}
              >
                {item === 'Productos' && <Package className="mr-3 h-5 w-5" />}
                {item === 'Pedidos' && <ClipboardList className="mr-3 h-5 w-5" />}
                {item === 'Redes' && <Share2 className="mr-3 h-5 w-5" />}
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center mb-6 px-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatars/01.png" alt={userName} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="text-sm font-medium leading-none text-white">{userName}</p>
            <p className="text-xs text-blue-200 mt-1">Administrador</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-blue-600">
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-white">
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 bg-blue-700 text-white border-blue-600">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-blue-700 border-r border-blue-600">
            <NavContent />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-64 flex-shrink-0 bg-blue-700 border-r border-blue-600">
          <NavContent />
        </div>
      )}
      <main className="flex-grow overflow-auto p-6 lg:p-10">
        {children}
      </main>
    </div>
  )
}