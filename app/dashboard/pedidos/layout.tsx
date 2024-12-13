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
    <div className="flex flex-col h-full justify-between py-4">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary-foreground">
            Menú
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:text-primary hover:bg-primary/10">
              <Package className="mr-2 h-4 w-4" />
              Productos
            </Button>
            <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:text-primary hover:bg-primary/10">
              <ClipboardList className="mr-2 h-4 w-4" />
              Pedidos
            </Button>
            <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:text-primary hover:bg-primary/10">
              <Share2 className="mr-2 h-4 w-4" />
              Redes
            </Button>
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center mb-4 px-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt={userName} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none text-primary-foreground">{userName}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:text-primary hover:bg-primary/10">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 bg-background text-primary-foreground">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-background border-r border-primary/10">
            <NavContent />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-64 flex-shrink-0 bg-background border-r border-primary/10">
          <NavContent />
        </div>
      )}
      <main className="flex-grow overflow-auto p-4 lg:p-8">
        {children}
      </main>
    </div>
  )
}