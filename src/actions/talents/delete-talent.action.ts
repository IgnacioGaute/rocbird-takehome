'use server';

import { deleteTalento as deleteTalentoAPI } from '@/services/talent.service';

export async function deleteTalentoAction(id: number) {
  try {
    const success = await deleteTalentoAPI(id);
    if (!success) {
      return { error: 'Error al eliminar el talento' };
    }
    return { success: 'Talento eliminado exitosamente' };
  } catch (error) {
    console.log(error);
    return { error: 'Error al eliminar el talento' };
  }
}
