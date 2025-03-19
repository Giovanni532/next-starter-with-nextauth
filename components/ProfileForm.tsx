"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/profile";
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

interface ProfileFormProps {
    user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;

        try {
            const result = await updateProfile({
                firstName,
                lastName,
            });

            if (result?.data?.data?.user) {
                toast.success("Profil mis à jour avec succès !");
                router.refresh();
            } else if (result && result.serverError) {
                toast.error(result.serverError.message || "Une erreur est survenue lors de la mise à jour du profil.");
            } else {
                toast.error("Une erreur est survenue lors de la mise à jour du profil.");
            }
        } catch (error) {
            console.error(error)
            toast.error("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle>Modifier votre profil</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            defaultValue={user.firstName}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            defaultValue={user.lastName}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={user.email}
                            disabled={true}
                            className="bg-gray-50 dark:bg-gray-800"
                        />
                        <p className="text-xs text-muted-foreground py-2">L&apos;email ne peut pas être modifié</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading}>
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