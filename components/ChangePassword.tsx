"use client";

import { useState } from "react";
import { changePassword } from "@/actions/profile";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface ChangePasswordProps {
    user: User;
}

export function ChangePassword({ user }: ChangePasswordProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const lastPassword = formData.get("lastPassword") as string;
        const newPassword = formData.get("newPassword") as string;

        try {
            const result = await changePassword({
                currentPassword: lastPassword,
                newPassword,
                confirmPassword: newPassword,
            });

            if (result?.data?.success) {
                toast.success("Mot de passe mis à jour avec succès !");
                router.refresh();
            } else if (result && result.serverError) {
                toast.error(result.serverError.message || "Une erreur est survenue lors de la mise à jour du mot de passe.");
            } else {
                toast.error("Une erreur est survenue lors de la mise à jour du mot de passe.");
            }
        } catch (error) {
            toast.error("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle>Modifier votre mot de passe</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="lastPassword">Mot de passe actuel</Label>
                        <Input
                            id="lastPassword"
                            name="lastPassword"
                            required
                            disabled={isLoading}
                            type="password"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            required
                            disabled={isLoading}
                            type="password"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} className="my-4">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mise à jour en cours...
                            </>
                        ) : (
                            "Enregistrer les modifications"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
} 