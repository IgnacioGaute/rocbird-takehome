'use server';

import { UpdateInteraccionSchemaType } from '@/schema/interaction.schema';
import { updateInteraccion as updateInteraccionAPI } from '@/services/interactions.service'

export async function updateInteraccionAction(
  id: number,
  values: Partial<UpdateInteraccionSchemaType>,
) {
  try {
    const success = await updateInteraccionAPI(id, values);
    if (!success) {
      return { error: 'Error al editar el interaccion' };
    }
    return { success: 'Interaccion editado exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al editar el interaccion' };
  }
}
