"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { addModelRow } from "@/actions/admin-models";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { AuthForm } from "@/components/AuthForm";

type ModelColumn = {
    column_name: string;
    data_type: string;
    character_maximum_length: number | null;
    column_default: string | null;
    is_nullable: string;
};

interface AddModelRowModalProps {
    modelName: string;
    formattedModelName: string;
    columns: ModelColumn[];
    onSuccess: () => void;
}

export function AddModelRowModal({
    modelName,
    formattedModelName,
    columns,
    onSuccess,
}: AddModelRowModalProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isUsersModel = modelName === "users";

    // Filtrer les colonnes pour ne pas inclure l'ID et les timestamps
    const editableColumns = columns.filter(
        (col) => !["id", "created_at", "updated_at"].includes(col.column_name)
    );

    const handleInputChange = (column: string, value: any) => {
        setFormData((prev) => ({ ...prev, [column]: value }));

        // Nettoyer l'erreur si l'utilisateur corrige le champ
        if (errors[column]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[column];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        editableColumns.forEach((col) => {
            if (col.is_nullable === "NO" && (formData[col.column_name] === undefined || formData[col.column_name] === "")) {
                newErrors[col.column_name] = "Ce champ est obligatoire";
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Convertir les valeurs selon le type de données
            const processedData = { ...formData };
            editableColumns.forEach((col) => {
                const value = processedData[col.column_name];

                // Si la valeur est vide, la définir comme null
                if (value === "" || value === undefined) {
                    processedData[col.column_name] = null;
                    return;
                }

                // Convertir les types selon la colonne
                switch (col.data_type) {
                    case "integer":
                    case "bigint":
                    case "numeric":
                    case "decimal":
                        processedData[col.column_name] = Number(value);
                        break;
                    case "boolean":
                        processedData[col.column_name] = value === "true";
                        break;
                    // Les autres types restent en string
                }
            });

            const result = await addModelRow({
                model: modelName,
                fields: columns,
                data: processedData,
            });

            // Vérifier le succès de l'opération
            if (result && "data" in result && result.data?.success) {
                toast.success("Enregistrement ajouté avec succès");
                setOpen(false);
                setFormData({});
                onSuccess();
            } else {
                const errorMessage = result && "data" in result && result.data?.error
                    ? result.data.error
                    : "Erreur lors de l'ajout";
                toast.error(errorMessage);
            }
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({});
        setErrors({});
    };

    const renderFormField = (column: ModelColumn) => {
        const { column_name, data_type, is_nullable } = column;
        const isRequired = is_nullable === "NO";

        switch (data_type) {
            case "boolean":
                return (
                    <div className="flex gap-4 items-center">
                        <Label htmlFor={`${column_name}_true`} className="flex-1">
                            <input
                                type="radio"
                                id={`${column_name}_true`}
                                name={column_name}
                                value="true"
                                checked={formData[column_name] === true}
                                onChange={() => handleInputChange(column_name, true)}
                                className="mr-2"
                            />
                            Oui
                        </Label>
                        <Label htmlFor={`${column_name}_false`} className="flex-1">
                            <input
                                type="radio"
                                id={`${column_name}_false`}
                                name={column_name}
                                value="false"
                                checked={formData[column_name] === false}
                                onChange={() => handleInputChange(column_name, false)}
                                className="mr-2"
                            />
                            Non
                        </Label>
                    </div>
                );

            case "text":
                return (
                    <Textarea
                        id={column_name}
                        name={column_name}
                        value={formData[column_name] || ""}
                        onChange={(e) => handleInputChange(column_name, e.target.value)}
                        required={isRequired}
                        rows={4}
                    />
                );

            case "date":
                return (
                    <Input
                        type="date"
                        id={column_name}
                        name={column_name}
                        value={formData[column_name] || ""}
                        onChange={(e) => handleInputChange(column_name, e.target.value)}
                        required={isRequired}
                    />
                );

            case "integer":
            case "bigint":
            case "numeric":
            case "decimal":
                return (
                    <Input
                        type="number"
                        id={column_name}
                        name={column_name}
                        value={formData[column_name] || ""}
                        onChange={(e) => handleInputChange(column_name, e.target.value)}
                        required={isRequired}
                    />
                );

            default:
                return (
                    <Input
                        type="text"
                        id={column_name}
                        name={column_name}
                        value={formData[column_name] || ""}
                        onChange={(e) => handleInputChange(column_name, e.target.value)}
                        required={isRequired}
                    />
                );
        }
    };

    const handleUserRegistrationSuccess = () => {
        setOpen(false);
        onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => {
            setOpen(o);
            if (!o) resetForm();
        }}>
            <DialogTrigger asChild>
                <Button className="flex gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Ajouter un enregistrement</span>
                </Button>
            </DialogTrigger>
            <DialogContent className={`max-h-[90vh] overflow-y-auto ${isUsersModel ? "sm:max-w-[420px]" : "sm:max-w-[500px]"}`}>
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Ajouter un enregistrement à {formattedModelName}</span>
                    </DialogTitle>
                </DialogHeader>

                {isUsersModel ? (
                    <div className="py-4">
                        <AuthForm
                            type="signup"
                            onSuccess={handleUserRegistrationSuccess}
                            disableRedirect
                            skipSignIn
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        {editableColumns.map((column) => (
                            <div key={column.column_name} className="space-y-2">
                                <Label htmlFor={column.column_name} className="flex gap-1">
                                    {column.column_name}
                                    {column.is_nullable === "NO" && (
                                        <span className="text-red-500">*</span>
                                    )}
                                    <span className="text-xs text-muted-foreground ml-2">
                                        ({column.data_type})
                                    </span>
                                </Label>
                                {renderFormField(column)}
                                {errors[column.column_name] && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors[column.column_name]}
                                    </p>
                                )}
                            </div>
                        ))}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Ajout...
                                    </>
                                ) : (
                                    "Ajouter"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
} 