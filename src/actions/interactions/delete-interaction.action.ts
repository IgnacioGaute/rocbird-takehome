'use server';

import { deleteInteraccion as deleteInteraccionAPI } from '@/services/interactions.service';

export async function deleteInteraccionAction(id: number) {
  try {
    const success = await deleteInteraccionAPI(id);
    if (!success) {
      return { error: 'Error al eliminar el interaccion' };
    }
    return { success: 'Interaccion eliminado exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al eliminar el interaccion' };
  }
}
