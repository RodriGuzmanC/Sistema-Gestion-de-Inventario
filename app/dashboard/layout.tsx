"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
    <div></div>

  )

  return (
    <div></div>
  )
}