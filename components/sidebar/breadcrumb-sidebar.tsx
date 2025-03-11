"use client"

import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbList } from "@/components/ui/breadcrumb"
import Link from "next/link"
import React from "react"


export function BreadcrumbSidebar() {
    const pathname = usePathname()
    const pathParts = pathname.split("/").filter(Boolean)
    const breadcrumbs = pathParts.map((part, index) => {
        const href = "/" + pathParts.slice(0, index + 1).join("/");
        return (
            <React.Fragment key={href}>
                <BreadcrumbItem key={href}>
                    <BreadcrumbLink asChild className="text-sm py-1">
                        <Link href={href}>{part.charAt(0).toUpperCase() + part.slice(1)}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="block" />
            </React.Fragment>
        )
    })

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs}
            </BreadcrumbList>
        </Breadcrumb>
    )
}