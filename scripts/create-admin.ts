import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Initialisation de Prisma Client
const prisma = new PrismaClient()

async function main() {
    try {
        // Définition des informations de l'administrateur
        const adminEmail = 'admin@example.com'
        const adminPassword = 'Admin123!' // Changer le mot de passe quand on est sur le prod
        const firstName = 'Admin'
        const lastName = 'User'

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail },
        })

        if (existingUser) {
            console.log(`L'utilisateur avec l'email ${adminEmail} existe déjà.`)

            // Si l'utilisateur existe mais n'est pas admin, mettre à jour son rôle
            if (existingUser.role !== 'ADMIN') {
                await prisma.user.update({
                    where: { email: adminEmail },
                    data: { role: 'ADMIN' },
                })
                console.log(`Le rôle de l'utilisateur a été mis à jour vers ADMIN.`)
            }

            return
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(adminPassword, 10)

        // Créer l'utilisateur admin
        const user = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'ADMIN', // Attribution du rôle admin
            },
        })

        console.log(`Utilisateur administrateur créé avec succès:`)
        console.log(`- Email: ${adminEmail}`)
        console.log(`- Mot de passe: ${adminPassword}`)
        console.log(`- Rôle: ADMIN`)
        console.log(`- ID: ${user.id}`)
    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur:', error)
    } finally {
        // Fermer la connexion Prisma
        await prisma.$disconnect()
    }
}

// Exécution du script
main() 