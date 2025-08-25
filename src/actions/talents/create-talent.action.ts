'use server';

import { talentoSchema, TalentoSchemaType } from '@/schema/talent.schema';
import { createTalento as createTalentoAPI } from '@/services/talent.service'

export async function createTalentoAction(values: TalentoSchemaType) {
  const validatedFields = talentoSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const talento = await createTalentoAPI(validatedFields.data);

    if (!talento) {
      return { error: 'Error al crear el talento' };
    }
    return { success: 'Talento creado exitosamente' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al crear el talento' };
  }
}
