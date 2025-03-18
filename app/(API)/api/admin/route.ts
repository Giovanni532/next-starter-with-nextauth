import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client';

type NavItemVariant = "default" | "outline";

interface NavItem {
    title: string;
    href: string;
    icon: string;
    variant: NavItemVariant;
    count?: number;
}

export async function GET(request: Request) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization');

        // Check if authorization header exists and is in proper format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        // Extract and validate user data from token
        try {
            const userData = JSON.parse(atob(authHeader.split(' ')[1]));

            // Verify user has ADMIN role
            if (userData?.role !== "ADMIN") {
                return NextResponse.json(
                    { error: "Accès non autorisé" },
                    { status: 403 }
                );
            }

            // Dynamically fetch tables from the database
            const tableInfo = await prisma.$queryRaw`
                SELECT tablename 
                FROM pg_catalog.pg_tables
                WHERE schemaname = 'public'
            `;

            // Initialize navItems with the Dashboard item
            const navItems: NavItem[] = [
                {
                    title: "Dashboard",
                    href: "/admin1208",
                    icon: "LayoutDashboard",
                    variant: "default",
                }
            ];

            // For each table, get the count and add to navItems
            for (const table of tableInfo as { tablename: string }[]) {
                const tableName = table.tablename;

                // Get count for this table using dynamic query
                const countResult = await prisma.$queryRaw`
                    SELECT COUNT(*) as count FROM ${Prisma.raw(tableName)}
                `;

                const count = Number((countResult as any)[0]?.count || 0);

                // Determine icon based on table name (customize as needed)
                let icon = "Database";
                if (tableName.includes("user")) icon = "Users";
                else if (tableName.includes("session")) icon = "Key";
                else if (tableName.includes("account")) icon = "CreditCard";
                else if (tableName.includes("token")) icon = "Database";
                else icon = "Database";

                // Format table name for display (convert snake_case to Title Case)
                const formattedName = tableName
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                navItems.push({
                    title: formattedName,
                    href: `/admin1208/${tableName}`,
                    icon,
                    count,
                    variant: "outline",
                });
            }


            return NextResponse.json({
                success: true,
                navItems,
            });
        } catch (e) {
            console.error("Error processing request:", e);
            return NextResponse.json(
                { error: "Token invalide ou erreur de traitement" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des modèles DB:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Une erreur est survenue lors de la récupération des données."
            },
            { status: 500 }
        );
    }
} 