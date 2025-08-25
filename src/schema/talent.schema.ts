
import { z } from "zod";
import { ESTADO_TYPE, SENIORITY_TYPE } from "@/types/talent.type";

export const talentoSchema = z.object({
  nombre_y_apellido: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  seniority: z.enum(SENIORITY_TYPE),
  rol: z.string().min(2, "El rol es obligatorio"),
  estado: z.enum(ESTADO_TYPE),
  referenteLiderId: z.number().optional(),
  referenteMentorId: z.number().optional(),
});

export type TalentoSchemaType = z.infer<typeof talentoSchema>;


export const updateTalentoSchema = z.object({
  nombre_y_apellido: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  seniority: z.enum(SENIORITY_TYPE),
  rol: z.string().min(2, "El rol es obligatorio"),
  estado: z.enum(ESTADO_TYPE),
  referenteLiderId: z.number().optional(),
  referenteMentorId: z.number().optional(),
  });
  
  export type UpdateTalentoSchemaType = z.infer<typeof updateTalentoSchema>;


  export const deleteTalentoSchema = z.object({
    confirmation: z.string().min(1, 'Ingrese la confirmación "Eliminar Talento"'),
  });
  export type DeleteTalentoSchemaType = z.infer<typeof deleteTalentoSchema>;