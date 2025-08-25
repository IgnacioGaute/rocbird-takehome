'use server';

import { referenteTecnicoSchema, ReferenteTecnicoSchemaType } from "@/schema/technical-reference.schema";
import { createReferente as createReferenteAPI } from '@/services/technical-reference.service'

export async function createReferenteAction(values: ReferenteTecnicoSchemaType) {
  const validatedFields = referenteTecnicoSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const referente = await createReferenteAPI(validatedFields.data);

    if (!referente) {
      return { error: 'Error al crear el referente' };
    }
    return { success: 'Referente creado exitosamente' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al crear el referente' };
  }
}
