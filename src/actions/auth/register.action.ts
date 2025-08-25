'use server';

import {
  registerSchema,
  RegisterSchemaType,
} from '../../schema/auth/register.schema';
import { createUser, getUserByEmail } from '@/services/user.service';

export async function registerAction({
  values,
  isVerified,
}: {
  values: RegisterSchemaType;
  isVerified: boolean;
}) {
  try {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
      console.log(validatedFields.error);
      return { error: 'Invalid fields' };
    }

    const { email, firstName, lastName, password } =
      validatedFields.data;

    const existingUser = await getUserByEmail(
      email,
      process.env.API_SECRET_TOKEN!,
    );

    if (existingUser) {
      return { error: 'El email ya está en uso' };
    }

    const userData = {
      firstName,
      lastName,
      email,
      password
    };

    const user = await createUser(userData, process.env.API_SECRET_TOKEN!);

    if (!user) {
      return { error: 'Error al crear usuario' };
    }

    return {
      success: 'Usuario creado.',
      redirectTo: '/auth/login',
    };
  } catch (error) {
    console.error(error);
    return { error: 'Error al registrar usuario' };
  }
}
