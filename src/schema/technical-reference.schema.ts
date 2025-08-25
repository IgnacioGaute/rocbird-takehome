import { z } from "zod";

export const referenteTecnicoSchema = z.object({
  nombre_y_apellido: z.string().min(3, "El nombre y apellido debe tener al menos 3 caracteres"),
});

export type ReferenteTecnicoSchemaType = z.infer<typeof referenteTecnicoSchema>;

export const updateReferenteTecnicoSchema = z.object({
  nombre_y_apellido: z.string().min(3, "El nombre y apellido debe tener al menos 3 caracteres"),
});

export type UpdateReferenteTecnicoSchemaType = z.infer<typeof updateReferenteTecnicoSchema>;

export const deleteReferenteTecnicoSchema = z.object({
  confirmation: z.string().min(1, 'Ingrese la confirmación "Eliminar Referente"'),
});

export type DeleteReferenteTecnicoSchemaType = z.infer<typeof deleteReferenteTecnicoSchema>;
