"use client"

import { Package, Users, Share2, ShoppingCart } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SharedFilter } from '../components/SharedFilter'
import { ProductCard } from '../components/product/ProductCard'
import Link from 'next/link'
import { Toaster } from '@/components/ui/sonner'

interface LayoutProps {
  children: React.ReactNode
}

interface Product {
  id: number
  name: string
  price: number
  category: string
}


const products: Product[] = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Headphones", price: 99, category: "Electronics" },
  { id: 3, name: "Mouse", price: 29, category: "Electronics" },
]



export default function Layout({ children }: LayoutProps) {
  const handleFilterChange = (filteredProducts: Product[]) => {
    console.log("Filtered products:", filteredProducts)
  }
  return (
    <div className='flex '>
      <SidebarProvider className='flex-1'>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/productos">
                    <Package className="mr-2 size-4" />
                    Productos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/pedidos">
                    <ShoppingCart className="mr-2 size-4" />
                    Pedidos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/usuarios">
                    <Users className="mr-2 size-4" />
                    Usuarios
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <main className="p-6 w-full">
        {children}
        <Toaster />
      </main>
    </div>
  )
}