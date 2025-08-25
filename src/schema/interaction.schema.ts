import { z } from "zod";
import { ESTADO_INTERACCION } from "@/types/interaction.type";

export const interaccionSchema = z.object({
  talentoId: z.number(),
  tipo_de_interaccion: z.string().min(3, "El tipo de interacción debe tener al menos 3 caracteres"),
  fecha: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Fecha inválida" }),
  detalle: z.string().min(5, "El detalle debe tener al menos 5 caracteres"),
  estado: z.enum(ESTADO_INTERACCION),
});

export type InteraccionSchemaType = z.infer<typeof interaccionSchema>;

export const updateInteraccionSchema = z.object({
  talentoId: z.number(),
  tipo_de_interaccion: z.string().min(3, "El tipo de interacción debe tener al menos 3 caracteres"),
  fecha: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Fecha inválida" }),
  detalle: z.string().min(5, "El detalle debe tener al menos 5 caracteres"),
  estado: z.enum(ESTADO_INTERACCION),
});

export type UpdateInteraccionSchemaType = z.infer<typeof updateInteraccionSchema>;

export const deleteInteraccionSchema = z.object({
    confirmation: z.string().min(1, 'Ingrese la confirmación "Eliminar Interaccion"'),
  });
  export type DeleteInteraccionSchemaType = z.infer<typeof deleteInteraccionSchema>;