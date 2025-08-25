'use server';

import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getUserByEmail } from '@/services/user.service';
import { loginSchema, LoginSchemaType } from '../../schema/auth/login.schema';

export async function loginAction(
  values: LoginSchemaType,
  callbackUrl?: string,
): Promise<{ success?: string; error?: string; redirectTo?: string }> {
  try {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: 'Campos inválidos' };
    }

    const { email, password } = validatedFields.data;

    const existingUserByEmail = await getUserByEmail(email, process.env.API_SECRET_TOKEN!);


    if (!existingUserByEmail) {
      return { error: 'El email o usuario no está registrado' };
    }
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return { success: "Inicio de sesión exitoso.", redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT };
    }catch (error: unknown) {
      console.error("Error en signIn:", error);
    
      if (typeof error === "object" && error !== null && "type" in error) {
        const typedError = error as { type: string };
        if (typedError.type === "CredentialsSignin") {
          return { error: "Email o contraseña incorrectos" };
        }
      }
    
      return { error: "Algo salió mal. Intenta de nuevo." };
    }
    
  }

