"use server";

import { signUpSchema } from "@/validatition/auth";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Action pour l'inscription d'un utilisateur
export async function registerUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    try {
        // Valider les données avec Zod
        const validatedData = signUpSchema.parse(data);
        const { email, password, firstName, lastName } = validatedData;

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
} 