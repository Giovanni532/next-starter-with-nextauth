"use client"

import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch by only rendering after component is mounted
    useEffect(() => {
        setMounted(true)
    }, [])

    // Use a more reliable way to determine the current theme
    const isDark = mounted && resolvedTheme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    // Show a placeholder with the same dimensions during SSR
    if (!mounted) {
        return <div className="h-10 w-20" />
    }

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative h-10 w-20 rounded-full bg-slate-200 p-1 shadow-inner dark:bg-slate-800"
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
            <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md dark:bg-slate-700"
                layout
                transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30,
                }}
                animate={{
                    x: isDark ? 40 : 0,
                }}
            >
                {isDark ? <Moon className="h-5 w-5 text-white" /> : <Sun className="h-5 w-5 text-black" />}
            </motion.div>
        </motion.button>
    )
}

