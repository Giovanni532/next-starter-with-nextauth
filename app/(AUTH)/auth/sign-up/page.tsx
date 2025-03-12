import { AuthForm } from "@/components/AuthForm"

export default function SignUp() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Créer un compte</h1>
                </div>
                <AuthForm type="signup" />
            </div>
        </div>

    )
}