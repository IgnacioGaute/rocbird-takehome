'use server';

import { UpdateReferenteTecnicoSchemaType } from '@/schema/technical-reference.schema';
import { updateReferente as updateReferenteAPI } from '@/services/technical-reference.service'

export async function updateReferenteAction(
  id: number,
  values: Partial<UpdateReferenteTecnicoSchemaType>,
) {
  try {
    const success = await updateReferenteAPI(id, values);
    if (!success) {
      return { error: 'Error al editar el referente' };
    }
    return { success: 'Referente editado exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al editar el referente' };
  }
}
