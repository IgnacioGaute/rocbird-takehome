'use server';

import { UpdateTalentoSchemaType } from '@/schema/talent.schema';
import { updateTalento as updateTalentoAPI } from '@/services/talent.service'

export async function updateTalentoAction(
  id: number,
  values: Partial<UpdateTalentoSchemaType>,
) {
  try {
    const success = await updateTalentoAPI(id, values);
    if (!success) {
      return { error: 'Error al editar el talento' };
    }
    return { success: 'Talento editado exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al editar el talento' };
  }
}
