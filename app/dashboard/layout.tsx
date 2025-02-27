"use client"

import { Package, Users, Share2, ShoppingCart, ChevronDown, DownloadCloud, LogOut } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SharedFilter } from '../components/SharedFilter'
import { ProductCard } from '../components/product/ProductCard'
import Link from 'next/link'
import { Toaster } from '@/components/ui/sonner'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { signOut } from '@/features/auth/SignWithPassword'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar variant="floating">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/dashboard">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                      <Package className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">Mi Aplicación</span>
                      <span className="text-xs text-muted-foreground">Dashboard</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full">
                      <Package className="mr-2 size-4" />
                      <span>Productos</span>
                      <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/dashboard/productos">Todos los productos</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/dashboard/productos/inhabilitados">
                            Productos inhabilitados
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/pedidos" className="group">
                    <ShoppingCart className="mr-2 size-4 transition-colors group-hover:text-primary" />
                    <div>Cortes</div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/ventas" className="group">
                    <ShoppingCart className="mr-2 size-4 transition-colors group-hover:text-primary" />
                    <span>Ventas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/boletas" className="group">
                    <DownloadCloud className="mr-2 size-4 transition-colors group-hover:text-primary" />
                    <span>Emitir boleta</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Sección separada para el botón de cerrar sesión */}
              <div className="mt-auto">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <form>
                      <Button
                        formAction={signOut}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 rounded-lg py-2"
                      >
                        <LogOut className="mr-2 size-4" />
                        <span>Cerrar sesión</span>
                      </Button>
                    </form>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex md:hidden h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
            <Toaster />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

