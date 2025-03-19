"use server";

import { safeAction } from "@/lib/safe-action";
import { signUpSchema } from "@/validations/auth";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth, signOut } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { paths } from "@/paths";
import { revalidatePath } from "next/cache";

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
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
        },
    })

    return user
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("user-app")
    await signOut({ redirectTo: paths.auth.login })

    // Assurer que la page est revalidée (même si nous le faisons déjà côté client)
    revalidatePath("/")
}