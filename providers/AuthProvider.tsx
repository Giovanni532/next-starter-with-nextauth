"use client"

import { SessionProvider } from "next-auth/react"
import { useAuth } from "@/stores/useAuth"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

function SessionSync() {
  const { data: session, status } = useSession()
  const { setUser, setIsLoading } = useAuth()

  useEffect(() => {
    // Mettre à jour l'état de chargement en fonction du statut de la session
    setIsLoading(status === "loading")

    // Mettre à jour l'utilisateur une fois que la session est chargée
    if (status === "authenticated" && session?.user) {
      setUser(session.user)
    } else if (status === "unauthenticated") {
      setUser(null)
    }
  }, [session, status, setUser, setIsLoading])

  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  )
} 