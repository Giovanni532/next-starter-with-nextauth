import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { cookies } from "next/headers"
import { ZodError } from "zod"
import { signInSchema, signUpSchema } from "@/validations/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: session.user.id
                }
            })
            session.user = user
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
                firstName: {},
                lastName: {},
            },
            authorize: async (credentials) => {
                try {
                    // Pour la connexion, on utilise le schéma de connexion
                    if (!credentials.firstName && !credentials.lastName) {
                        const { email, password } = signInSchema.parse(credentials);

                        // Vérification si l'utilisateur existe
                        const user = await prisma.user.findUnique({
                            where: {
                                email
                            },
                        });

                        if (!user) {
                            throw new Error("Identifiants invalides");
                        }

                        // Vérification du mot de passe (en supposant qu'il est hashé)
                        const isPasswordValid = await bcrypt.compare(password, user.password);

                        if (!isPasswordValid) {
                            throw new Error("Identifiants invalides");
                        }
                        const cookieStore = await cookies()
                        // Retourne l'utilisateur sans le mot de passe
                        const { password: _, ...userWithoutPassword } = user;
                        cookieStore.set("user-app", JSON.stringify(userWithoutPassword))
                        return userWithoutPassword;
                    }
                    // Pour l'inscription, on utilise le schéma d'inscription
                    else {
                        const { email, password, firstName, lastName } = signUpSchema.parse(credentials);

                        // Vérification si l'email existe déjà
                        const existingUser = await prisma.user.findUnique({
                            where: {
                                email
                            }
                        });

                        if (existingUser) {
                            throw new Error("Cet email est déjà utilisé");
                        }

                        // Hashage du mot de passe
                        const hashedPassword = await bcrypt.hash(password, 10);

                        // Création de l'utilisateur
                        const newUser = await prisma.user.create({
                            data: {
                                email,
                                password: hashedPassword,
                                firstName,
                                lastName,
                            },
                        });
                        const cookieStore = await cookies()
                        // Retourne l'utilisateur sans le mot de passe
                        const { password: _, ...userWithoutPassword } = newUser;
                        cookieStore.set("user-app", JSON.stringify(newUser))
                        return userWithoutPassword;
                    }
                } catch (error) {
                    if (error instanceof ZodError) {
                        throw new Error("Données d'entrée invalides");
                    }
                    throw error;
                }
            },
        }),
    ],
})