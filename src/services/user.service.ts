import { getAuthHeaders } from "@/lib/auth";
import { User } from "@/types/user.type";
import { getCacheTag } from "./cache-tags";
import { UpdateUserSchemaType, UserSchemaType } from "@/schema/user.schema";
import { revalidateTag } from "next/cache";
import { Logger } from "@/lib/logger";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;
const logger = new Logger("UserService");

export const getUsers = async (authToken?: string) => {
  try {
    logger.log("Obteniendo todos los usuarios...");
    const response = await fetch(`${BASE_URL}`, {
      headers: await getAuthHeaders(authToken),
      next: { tags: [getCacheTag('users', 'all')] },
    });
    const data = await response.json();

    if (response.ok) return data as User[];

    logger.error("Error en getUsers:", data);
    return null;
  } catch (error) {
    logger.error("Error en getUsers:", error);
    return null;
  }
};

export const getUserById = async (id: string, authToken?: string) => {
  try {
    logger.log(`Obteniendo usuario con ID: ${id}`);
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: await getAuthHeaders(authToken),
    });
    const data = await response.json();

    if (response.ok) return data as User;

    logger.error(`Error en getUserById ${id}:`, data);
    return null;
  } catch (error) {
    logger.error("Error en getUserById:", error);
    return null;
  }
};

export const getUserByEmail = async (email: string, authToken?: string) => {
  try {
    if (!email) return null;
    logger.log(`Buscando usuario por email: ${email}`);

    const response = await fetch(`${BASE_URL}/?email=${encodeURIComponent(email)}`, {
      headers: await getAuthHeaders(authToken),
    });
    const data = await response.json();

    if (response.ok) return data as User | null;

    logger.error(`Error en getUserByEmail ${email}:`, data);
    return null;
  } catch (error) {
    logger.error("Error en getUserByEmail:", error);
    return null;
  }
};

export const createUser = async (user: UserSchemaType, authToken?: string) => {
  try {
    logger.log("Creando usuario...", user);
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(user),
    });
    const data = await response.json();

    if (response.ok) {
      revalidateTag(getCacheTag('users', 'all'));
      logger.log("Usuario creado:", data);
      return data as User;
    }

    logger.error("Error en createUser:", data);
    return null;
  } catch (error) {
    logger.error("Error en createUser:", error);
    return null;
  }
};

export const updateUser = async (
  id: string,
  user: Partial<UpdateUserSchemaType>,
  authToken?: string,
) => {
  try {
    logger.log(`Actualizando usuario ${id}...`, user);
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(user),
    });

    const data = await response.json();
    revalidateTag(getCacheTag('users', 'all'));

    if (!response.ok) {
      logger.error(`Error en updateUser ${id}:`, data);
      return {
        error: {
          code: data.code || 'UNKNOWN_ERROR',
          message: data.message || 'Error desconocido',
        },
      };
    }

    logger.log(`Usuario ${id} actualizado:`, data);
    return data;
  } catch (error) {
    logger.error(`Error en updateUser ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string, authToken?: string) => {
  try {
    logger.log(`Eliminando usuario ${id}...`);
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(authToken),
    });
    const data = await response.json();

    if (response.ok) {
      revalidateTag(getCacheTag('users', 'all'));
      logger.log(`Usuario ${id} eliminado.`);
      return data;
    }

    logger.error(`Error en deleteUser ${id}:`, data);
    return null;
  } catch (error) {
    logger.error(`Error en deleteUser ${id}:`, error);
    return null;
  }
};
