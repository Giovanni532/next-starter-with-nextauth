"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { LayoutDashboard, Users, Key, CreditCard, Settings, Database } from "lucide-react"

// Type pour les éléments de navigation
export interface NavItem {
  title: string
  href: string
  icon: string
  variant: "default" | "outline"
  count?: number
}

interface NavMainAdminProps {
  items: NavItem[]
}

export function NavMainAdmin({ items }: NavMainAdminProps) {
  const pathname = usePathname()

  // Fonction pour obtenir l'icône correspondante
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutDashboard":
        return <LayoutDashboard className="size-4" />
      case "Users":
        return <Users className="size-4" />
      case "Key":
        return <Key className="size-4" />
      case "CreditCard":
        return <CreditCard className="size-4" />
      case "Settings":
        return <Settings className="size-4" />
      default:
        return <Database className="size-4" />
    }
  }

  return (
    <SidebarMenu title="Navigation">
      {items.map((item) => {
        const isActive = pathname === item.href

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton variant={isActive ? "default" : item.variant} asChild>
              <Link href={item.href}>
                {getIcon(item.icon)}
                <span>{item.title}</span>
                {item.count !== undefined && (
                  <div className="ml-auto text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                    {item.count}
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
