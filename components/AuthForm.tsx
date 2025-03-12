"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { registerUser } from "@/actions/auth"
import Link from "next/link"
import { paths } from "@/paths"
import { useAuth } from "@/stores/useAuth"

export type AuthFormType = "signin" | "signup"

interface AuthFormProps {
    type: AuthFormType
}

export function AuthForm({ type }: AuthFormProps) {
    const router = useRouter()
    const { setUser } = useAuth()
    const callbackUrl = "/dashboard"
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isSignIn = type === "signin"

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            if (isSignIn) {
                // Connexion avec Auth.js
                const result = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                    callbackUrl,
                })

                if (!result?.error) {
                    // La session sera mise à jour par le SessionSync
                    router.push(callbackUrl)
                    router.refresh()
                } else {
                    toast.error("Identifiants invalides. Veuillez réessayer.")
                }
            } else {
                // Inscription avec notre action serveur
                const firstName = formData.get("firstName") as string
                const lastName = formData.get("lastName") as string

                const result = await registerUser({
                    email,
                    password,
                    firstName,
                    lastName
                })

                if (result?.data?.success) {
                    const signInResult = await signIn("credentials", {
                        redirect: false,
                        email,
                        password,
                        callbackUrl,
                    })

                    if (!signInResult?.error) {
                        // La session sera mise à jour par le SessionSync
                        router.push(callbackUrl)
                    }
                } else {
                    toast.error(result?.serverError?.message || "Une erreur est survenue lors de l'inscription.")
                }
            }
        } catch (error) {
            toast.error("Une erreur est survenue. Veuillez réessayer.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isSignIn ? "Connexion" : "Créer un compte"}</CardTitle>
                <CardDescription>
                    {isSignIn
                        ? "Entrez vos identifiants pour vous connecter"
                        : "Remplissez le formulaire pour créer votre compte"}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">

                    {!isSignIn && (
                        <div className="space-y-2 flex flex-row gap-2 justify-between">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" name="firstName" placeholder="Jean" required disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" name="lastName" placeholder="Dupont" required disabled={isLoading} />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="jean@exemple.fr" required disabled={isLoading} />
                    </div>

                    <div className="space-y-2 pb-4">
                        <Label htmlFor="password">Mot de passe</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                                className="pr-10"
                                minLength={isSignIn ? 1 : 8}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">{showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}</span>
                            </Button>
                        </div>
                        {!isSignIn && (
                            <p className="text-xs text-muted-foreground pb-2">Le mot de passe doit contenir au moins 8 caractères</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isSignIn ? "Connexion en cours..." : "Inscription en cours..."}
                            </>
                        ) : isSignIn ? (
                            "Se connecter"
                        ) : (
                            "S'inscrire"
                        )}
                    </Button>
                    <div className="text-center text-sm">
                        {isSignIn ? (
                            <>
                                Pas encore de compte?{" "}
                                <Link href={paths.auth.register} className="p-0 h-auto">
                                    Créer un compte
                                </Link>
                            </>
                        ) : (
                            <>
                                Déjà un compte?{" "}
                                <Link href={paths.auth.login} className="p-0 h-auto">
                                    Se connecter
                                </Link>
                            </>
                        )}
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}