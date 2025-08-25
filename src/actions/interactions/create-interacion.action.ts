'use server';

import { interaccionSchema, InteraccionSchemaType } from '@/schema/interaction.schema';
import { createInteraccion as createInteraccionAPI } from '@/services/interactions.service'

export async function createInteraccionAction(values: InteraccionSchemaType) {
  const validatedFields = interaccionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const interaccion = await createInteraccionAPI(validatedFields.data);

    if (!interaccion) {
      return { error: 'Error al crear el interaccion' };
    }
    return { success: 'Interaccion creado exitosamente' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al crear el interaccion' };
  }
}
