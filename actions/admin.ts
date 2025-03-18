"use server";

import { useRoleMutation } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma Zod vide car nous n'avons pas d'entrée
const emptySchema = z.object({});

// Action serveur sécurisée pour récupérer les modèles de la base de données
// Cette action nécessite le rôle ADMIN pour être exécutée
export const getDbModels = useRoleMutation(
    emptySchema,
    "ADMIN",
    async () => {
        try {
            // Récupération des statistiques des différentes tables
            const usersCount = await prisma.user.count();
            const sessionsCount = await prisma.session.count();
            const accountsCount = await prisma.account.count();

            // Structure de navigation pour l'admin
            const navItems = [
                {
                    title: "Dashboard",
                    href: "/admin1208",
                    icon: "LayoutDashboard",
                    variant: "default" as const,
                },
                {
                    title: "Utilisateurs",
                    href: "/admin1208/users",
                    icon: "Users",
                    count: usersCount,
                    variant: "outline" as const,
                },
                {
                    title: "Sessions",
                    href: "/admin1208/sessions",
                    icon: "Key",
                    count: sessionsCount,
                    variant: "outline" as const,
                },
                {
                    title: "Comptes",
                    href: "/admin1208/accounts",
                    icon: "CreditCard",
                    count: accountsCount,
                    variant: "outline" as const,
                },
                {
                    title: "Paramètres",
                    href: "/admin1208/settings",
                    icon: "Settings",
                    variant: "outline" as const,
                },
            ];

            return {
                success: true,
                navItems,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des modèles DB:", error);
            return {
                success: false,
                error: "Une erreur est survenue lors de la récupération des données.",
            };
        }
    }
); 