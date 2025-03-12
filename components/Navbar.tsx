"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMotionValue, motion, animate, useTransform } from "framer-motion"
import { paths } from "@/paths"
import { useAuth } from "@/stores/useAuth"

export function Navbar() {
    const { user, isLoading } = useAuth()
    const [isOpen, setIsOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)

    // Animation pour le menu hamburger
    const firstBar = useMotionValue(0)
    const secondBar = useMotionValue(0)
    const thirdBar = useMotionValue(0)

    const firstBarRotate = useTransform(firstBar, [0, 1], [0, 45])
    const secondBarOpacity = useTransform(secondBar, [0, 1], [1, 0])
    const thirdBarRotate = useTransform(thirdBar, [0, 1], [0, -45])
    const thirdBarY = useTransform(thirdBar, [0, 1], [0, -8])
    const firstBarY = useTransform(firstBar, [0, 1], [0, 8])

    // Détection du scroll
    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Animation du menu hamburger
    React.useEffect(() => {
        if (isOpen) {
            animate(firstBar, 1, { duration: 0.3 })
            animate(secondBar, 1, { duration: 0.3 })
            animate(thirdBar, 1, { duration: 0.3 })
        } else {
            animate(firstBar, 0, { duration: 0.3 })
            animate(secondBar, 0, { duration: 0.3 })
            animate(thirdBar, 0, { duration: 0.3 })
        }
    }, [isOpen, firstBar, secondBar, thirdBar])

    // Ne pas afficher la navbar pendant le chargement ou si l'utilisateur est connecté
    if (isLoading || user) {
        return null
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isOpen
                    ? "bg-background" // Fond blanc solide quand le menu est ouvert
                    : scrolled
                        ? "bg-background/80 backdrop-blur-md shadow-sm"
                        : "bg-transparent",
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={paths.home} className="text-xl font-bold">
                        Brand
                    </Link>

                    {/* Navigation desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {["Accueil", "Services", "À propos", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="relative text-foreground/80 hover:text-foreground transition-colors duration-200 py-1 group"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Bouton de connexion - Desktop */}
                    <div className="hidden md:block">
                        <Link
                            href={paths.auth.login}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Connexion
                        </Link>
                    </div>

                    {/* Bouton hamburger */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 relative z-50"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        aria-expanded={isOpen}
                    >
                        <motion.span
                            className={`w-6 h-0.5 rounded-full block mb-1.5 ${isOpen ? "bg-black" : "bg-foreground"}`}
                            style={{
                                rotate: firstBarRotate,
                                y: firstBarY,
                                transformOrigin: "center",
                            }}
                        />
                        <motion.span
                            className={`w-6 h-0.5 rounded-full block mb-1.5 ${isOpen ? "bg-black" : "bg-foreground"}`}
                            style={{ opacity: secondBarOpacity }}
                        />
                        <motion.span
                            className={`w-6 h-0.5 rounded-full block ${isOpen ? "bg-black" : "bg-foreground"}`}
                            style={{
                                rotate: thirdBarRotate,
                                y: thirdBarY,
                                transformOrigin: "center",
                            }}
                        />
                    </button>
                </div>
            </div>

            {/* Menu mobile */}
            <motion.div
                className={cn(
                    "fixed inset-0 bg-background z-40 flex flex-col items-center justify-center md:hidden",
                    isOpen ? "block" : "hidden",
                )}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                    opacity: isOpen ? 1 : 0,
                    y: isOpen ? 0 : -20,
                }}
                transition={{ duration: 0.3 }}
            >
                <nav className="flex flex-col items-center space-y-6 w-full pt-6">
                    {["Accueil", "Services", "À propos", "Contact"].map((item, index) => (
                        <motion.div
                            key={item}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{
                                opacity: isOpen ? 1 : 0,
                                y: isOpen ? 0 : -10,
                            }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                            className="w-full text-center py-4 border-b border-border last:border-b-0"
                        >
                            <Link
                                href={`#${item.toLowerCase()}`}
                                className="text-2xl font-medium text-foreground/80 hover:text-foreground transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </Link>
                        </motion.div>
                    ))}

                    {/* Bouton de connexion - Mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                            opacity: isOpen ? 1 : 0,
                            y: isOpen ? 0 : -10,
                        }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="mt-6"
                    >
                        <Link
                            href={paths.auth.login}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            onClick={() => setIsOpen(false)}
                        >
                            Connexion
                        </Link>
                    </motion.div>
                </nav>
            </motion.div>
        </header>
    )
}

