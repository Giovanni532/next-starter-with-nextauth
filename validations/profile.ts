import { z } from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, "Le prénom est requis").max(32),
    lastName: z.string().min(1, "Le nom est requis").max(32),
});
