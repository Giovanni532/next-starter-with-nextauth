"use server"

import React from 'react'
import { getUserInfo } from '@/actions/auth'
import { AuthAdmin } from '@/components/AuthAdmin'

export default async function AdminPage() {
  const user = await getUserInfo()

  // Si l'utilisateur n'est pas administrateur, afficher le formulaire de connexion
  if (user?.role !== "ADMIN") {
    return <div className="flex justify-center items-center h-screen"><AuthAdmin /></div>
  }

  // Si l'utilisateur est administrateur, afficher l'interface d'administration
  return (
    <div className="flex h-screen">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord d'administration</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Bienvenue, {user.firstName}</h2>
            <p className="text-muted-foreground">
              Vous êtes connecté en tant qu'administrateur.
            </p>
          </div>

          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Gestion des utilisateurs</h2>
            <p className="text-muted-foreground">
              Gérez les comptes utilisateurs et leurs autorisations.
            </p>
          </div>

          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Configuration</h2>
            <p className="text-muted-foreground">
              Paramètres et configuration du système.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
