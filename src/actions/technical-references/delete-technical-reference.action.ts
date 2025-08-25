'use server';

import { deleteReferente as deleteReferenteAPI } from '@/services/technical-reference.service';

export async function deleteReferenteAction(id: number) {
  try {
    const success = await deleteReferenteAPI(id);
    if (!success) {
      return { error: 'Error al eliminar el referente' };
    }
    return { success: 'Referente eliminado exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al eliminar el referente' };
  }
}
