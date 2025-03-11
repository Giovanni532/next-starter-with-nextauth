"use client";

import { useState } from "react";
import { changePassword } from "@/actions/profile";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";


export function ChangePassword() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const lastPassword = formData.get("lastPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        if (lastPassword === newPassword) {
            toast.error("Le nouveau mot de passe ne peut pas être identique au mot de passe actuel.");
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            setIsLoading(false);
            return;
        }

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
                    <div className="space-y-2 relative">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            required
                            disabled={isLoading}
                            type={showPassword ? "text" : "password"}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-3 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">{showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}</span>
                        </Button>
                    </div>
                    <div className="space-y-2 relative">
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            disabled={isLoading}
                            type={showConfirmPassword ? "text" : "password"}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-3 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">{showConfirmPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}</span>
                        </Button>
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