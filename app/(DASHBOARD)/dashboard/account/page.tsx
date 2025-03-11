import { ProfileForm } from "@/components/ProfileForm"
import { getUserInfo } from "@/actions/auth"
import { ChangePassword } from "@/components/ChangePassword"
export default async function ProfilePage() {
    const user = await getUserInfo()

    if (!user) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Profil introuvable</h1>
                <p>Impossible de récupérer vos informations de profil.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Votre profil</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <ProfileForm user={user} />
                    <ChangePassword />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-fit">
                    <h2 className="text-xl font-semibold mb-4">Informations</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Vous pouvez modifier vos informations personnelles sur cette page.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Votre email ne peut pas être modifié pour des raisons de sécurité.
                    </p>
                </div>
            </div>
        </div>
    )
} 