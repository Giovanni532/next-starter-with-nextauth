"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function AuthAdmin() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            })

            if (!result?.error) {
                router.refresh()
            } else {
                toast.error("Identifiants invalides ou vous n'avez pas les droits d'administrateur.")
            }
        } catch (error) {
            console.error(error)
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Card className="max-w-md mx-auto mt-10 overflow-hidden">
                <CardHeader>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <CardTitle>Accès administrateur</CardTitle>
                        <CardDescription>
                            Connectez-vous avec vos identifiants d&apos;administrateur pour accéder à cette page
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
                            <motion.div className="space-y-2" variants={itemVariants}>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@exemple.fr"
                                    required
                                    disabled={isLoading}
                                />
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
                            </motion.div>
                        </motion.div>
                    </CardContent>
                    <CardFooter>
                        <motion.div
                            className="w-full"
                            variants={buttonVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
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
                                        Connexion en cours...
                                    </>
                                ) : (
                                    "Se connecter"
                                )}
                            </Button>
                        </motion.div>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    )
} 