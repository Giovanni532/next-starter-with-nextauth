import { getUserInfo } from "@/actions/auth"
export default async function DashboardPage() {
    const user = await getUserInfo()

    return (
        <div className="">
            <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Bienvenue, {user?.firstName || user?.email}</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Vous êtes maintenant connecté à votre tableau de bord personnel.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Votre compte</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">Email:</span> {user?.email}</p>
                        {user?.firstName && (
                            <p><span className="font-medium">Nom:</span> {user?.firstName} {user?.lastName}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 