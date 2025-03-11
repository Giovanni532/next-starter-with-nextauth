"use server";

import { safeAction } from "@/lib/safe-action";
import { signUpSchema } from "@/validatition/auth";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Action pour l'inscription d'un utilisateur (pas besoin d'authentification)
export const registerUser = safeAction
    .schema(signUpSchema)
    .action(async ({ parsedInput }) => {
        try {
            const { email, password, firstName, lastName } = parsedInput;

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return {
                    success: false,
                    error: "Cet email est déjà utilisé",
                };
            }

            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer l'utilisateur
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                },
            });

            return {
                success: true,
                userId: user.id,
            };
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);

            if (error instanceof ZodError) {
                return {
                    success: false,
                    error: "Données d'entrée invalides",
                    zodError: error.flatten(),
                };
            }

            return {
                success: false,
                error: "Une erreur est survenue lors de l'inscription",
            };
        }
    });

export async function getUserInfo() {
    const session = await auth()

    if (!session) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email as string },
    })

    return user
}