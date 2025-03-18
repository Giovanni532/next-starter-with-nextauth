import { getUserInfo } from "@/actions/auth";
import { AppSidebarAdmin } from "@/components/sidebar-admin/app-sidebar-admin";
import { BreadcrumbSidebar } from "@/components/sidebar/breadcrumb-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getUserInfo()
    if (user?.role !== "ADMIN") {
        return children
    }
    return (
        <SidebarProvider>
            <AppSidebarAdmin />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <BreadcrumbSidebar />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
