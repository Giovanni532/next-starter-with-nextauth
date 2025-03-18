"use server"

import { ActionError, useMutation } from "@/lib/safe-action";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Type de retour pour notre action
interface AddModelRowResult {
    success: boolean;
    data?: any;
    error?: string;
}

export const addModelRow = useMutation(
    z.object({
        model: z.string(),
        fields: z.array(z.any()),
        data: z.record(z.string(), z.any())
    }),
    async ({ model, fields, data }, ctx): Promise<AddModelRowResult> => {
        try {
            // Vérifier que l'utilisateur est admin
            if (ctx.role !== "ADMIN") {
                throw new ActionError("Vous devez être administrateur pour effectuer cette action");
            }

            // Vérification de base des champs obligatoires
            const requiredFields = fields
                .filter(field => field.is_nullable === 'NO')
                .map(field => field.column_name);

            // Vérifier manuellement les champs obligatoires
            for (const field of requiredFields) {
                if (data[field] === null || data[field] === undefined || data[field] === '') {
                    throw new ActionError(`Le champ ${field} est obligatoire`);
                }
            }

            // Préparer les colonnes et valeurs pour l'insertion SQL
            const columns = Object.keys(data).filter(key => data[key] !== null && data[key] !== '');
            const values = columns.map(col => data[col]);

            // Si aucune colonne à insérer, renvoyer une erreur
            if (columns.length === 0) {
                throw new ActionError("Aucune donnée valide à insérer");
            }

            // Construire et exécuter la requête SQL
            const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
            const query = `
        INSERT INTO "${model}" (${columns.map(c => `"${c}"`).join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `;

            const result = await prisma.$queryRawUnsafe(query, ...values);

            return { success: true, data: result };
        } catch (error: any) {
            console.error("Erreur lors de l'ajout d'une ligne:", error);
            return {
                success: false,
                error: error.message || "Une erreur est survenue lors de l'ajout"
            };
        }
    }
); 