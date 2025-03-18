import * as React from "react"
import {
  Command,
} from "lucide-react"

import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getUserInfo } from "@/actions/auth"
import { NavMainAdmin, type NavItem } from "./nav-main-admin"
import { ThemeToggle } from "../theme/ThemeToggle"

export async function AppSidebarAdmin({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUserInfo()
  let navItems: NavItem[] = []

  // Seulement faire l'appel API si l'utilisateur est connecté
  if (user) {
    try {
      // Encode user data as a base64 string for the authorization header
      const userToken = btoa(JSON.stringify({
        id: user.id,
        role: user.role
      }))

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/admin`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          navItems = data.navItems
        }
      } else {
        console.error("Erreur lors de la récupération des données d'administration:", await response.text())
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données d'administration:", error)
    }
  }

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Administration</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMainAdmin items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
