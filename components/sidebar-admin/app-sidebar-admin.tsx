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
import { getDbModels } from "@/actions/admin"
import { ThemeToggle } from "../theme/ThemeToggle"

export async function AppSidebarAdmin({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUserInfo()

  // Tenter de récupérer les données d'administration et gérer les erreurs
  let navItems: NavItem[] = []
  try {
    const adminDataResult = await getDbModels({})
    if (adminDataResult?.data?.success) {
      navItems = adminDataResult.data.navItems || []
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données d'administration:", error)
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
