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
import { motion, AnimatePresence } from "framer-motion"

export type AuthFormType = "signin" | "signup"

interface AuthFormProps {
    type: AuthFormType
    onSuccess?: () => void
    disableRedirect?: boolean
    skipSignIn?: boolean
}

export function AuthForm({ type, onSuccess, disableRedirect, skipSignIn }: AuthFormProps) {
    const router = useRouter()
    const callbackUrl = paths.dashboard.root
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
                    // Appeler onSuccess si fourni
                    if (onSuccess) {
                        onSuccess();
                    }
                    // Rediriger uniquement si disableRedirect n'est pas défini
                    else if (!disableRedirect) {
                        router.push(callbackUrl)
                        router.refresh()
                    }
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
                    // Afficher un message de succès
                    toast.success("Compte créé avec succès")

                    // Se connecter après inscription réussie seulement si skipSignIn n'est pas activé
                    if (!skipSignIn) {
                        const signInResult = await signIn("credentials", {
                            redirect: false,
                            email,
                            password,
                            callbackUrl,
                        })

                        if (!signInResult?.error) {
                            // Appeler onSuccess si fourni
                            if (onSuccess) {
                                onSuccess();
                            }
                            // Rediriger uniquement si disableRedirect n'est pas défini
                            else if (!disableRedirect) {
                                router.push(callbackUrl)
                            }
                        }
                    } else {
                        // Si on saute la connexion, appeler directement onSuccess
                        if (onSuccess) {
                            onSuccess();
                        }
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    }

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.03 },
        tap: { scale: 0.97 }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Card className="overflow-hidden">
                <CardHeader>
                    <motion.div layout>
                        <CardTitle>
                            <motion.span
                                key={isSignIn ? "signin-title" : "signup-title"}
                                initial={{ opacity: 0, x: isSignIn ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isSignIn ? 20 : -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isSignIn ? "Connexion" : "Créer un compte"}
                            </motion.span>
                        </CardTitle>
                        <CardDescription>
                            <motion.span
                                key={isSignIn ? "signin-desc" : "signup-desc"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {isSignIn
                                    ? "Entrez vos identifiants pour vous connecter"
                                    : "Remplissez le formulaire pour créer votre compte"}
                            </motion.span>
                        </CardDescription>
                    </motion.div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-4"
                        >
                            <AnimatePresence mode="wait">
                                {!isSignIn && (
                                    <motion.div
                                        className="space-y-2 flex flex-row gap-2 justify-between"
                                        key="name-fields"
                                        variants={itemVariants}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Prénom</Label>
                                            <Input id="firstName" name="firstName" placeholder="Jean" required disabled={isLoading} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Nom</Label>
                                            <Input id="lastName" name="lastName" placeholder="Dupont" required disabled={isLoading} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div className="space-y-2" variants={itemVariants}>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="jean@exemple.fr" required disabled={isLoading} />
                            </motion.div>

                            <motion.div className="space-y-2 pb-4" variants={itemVariants}>
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
                                        <motion.div
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: showPassword ? 0 : 180 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </motion.div>
                                        <span className="sr-only">{showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}</span>
                                    </Button>
                                </div>
                                <AnimatePresence>
                                    {!isSignIn && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-xs text-muted-foreground pb-2"
                                        >
                                            Le mot de passe doit contenir au moins 8 caractères
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <motion.div
                            variants={buttonVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
                            className="w-full"
                        >
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        >
                                            <Loader2 className="mr-2 h-4 w-4" />
                                        </motion.div>
                                        {isSignIn ? "Connexion en cours..." : "Inscription en cours..."}
                                    </>
                                ) : isSignIn ? (
                                    "Se connecter"
                                ) : (
                                    "S'inscrire"
                                )}
                            </Button>
                        </motion.div>
                        <motion.div
                            className="text-center text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {isSignIn ? (
                                <>
                                    Pas encore de compte?{" "}
                                    <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link href={paths.auth.register} className="p-0 h-auto">
                                            Créer un compte
                                        </Link>
                                    </motion.span>
                                </>
                            ) : (
                                <>
                                    Déjà un compte?{" "}
                                    <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link href={paths.auth.login} className="p-0 h-auto">
                                            Se connecter
                                        </Link>
                                    </motion.span>
                                </>
                            )}
                        </motion.div>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    )
}