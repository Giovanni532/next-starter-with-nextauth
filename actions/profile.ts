"use server";

import { z } from "zod";
import { useMutation } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/validations/profile";
// Action pour mettre à jour le profil d'un utilisateur (nécessite d'être connecté)
export const updateProfile = useMutation(
    updateProfileSchema,
    async (input, ctx) => {
        try {
            // Récupération de l'ID de l'utilisateur depuis le contexte
            const { userId } = ctx;

            // Mise à jour du profil utilisateur
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            });

            return {
                data: {
                    user: updatedUser,
                }
            };
        } catch (error) {
            console.error("Erreur de mise à jour du profil:", error);
            return {
                data: null,
                serverError: {
                    message: "Une erreur est survenue lors de la mise à jour du profil",
                }
            };
        }
    }
);

// Schéma pour le changement de mot de passe
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères").max(32),
    confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

// Action pour changer le mot de passe (nécessite d'être connecté)
export const changePassword = useMutation(
    changePasswordSchema,
    async (input, ctx) => {
        const { userId } = ctx;

        // Récupération de l'utilisateur avec son mot de passe actuel
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                password: true,
            },
        });

        if (!user) {
            return {
                success: false,
                error: "Utilisateur non trouvé",
            };
        }

        // Vérification du mot de passe actuel
        const bcrypt = await import("bcryptjs");
        const isPasswordValid = await bcrypt.compare(input.currentPassword, user.password);

        if (!isPasswordValid) {
            return {
                success: false,
                error: "Le mot de passe actuel est incorrect",
            };
        }

        // Hashage et mise à jour du nouveau mot de passe
        const hashedPassword = await bcrypt.hash(input.newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
            },
        });

        return {
            success: true,
            message: "Mot de passe changé avec succès",
        };
    }
); 