import { InteraccionSchemaType, UpdateInteraccionSchemaType } from "@/schema/interaction.schema";
import { Interaccion } from "@/types/interaction.type";
import { getCacheTag } from "./cache-tags";
import { revalidateTag } from "next/cache";
import { getAuthHeaders } from "@/lib/auth";
import { Logger } from "@/lib/logger";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/interactions`;
const logger = new Logger("InteraccionService");

export const getInteracciones = async (authToken?: string) => {
  try {
    logger.log("Obteniendo todas las interacciones...");
    const res = await fetch(BASE_URL, {
      headers: await getAuthHeaders(authToken),
      next: { tags: [getCacheTag('interactions', 'all')] },
    });
    const data = await res.json();

    if (res.ok) return data as Interaccion[];
    
    logger.error("Error en getInteracciones:", data);
    return null;
  } catch (error) {
    logger.error("Error en getInteracciones:", error);
    return null;
  }
};

export const getInteraccionById = async (id: number, authToken?: string) => {
  try {
    logger.log(`Obteniendo interacción con ID: ${id}`);
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: await getAuthHeaders(authToken),
    });
    const data = await res.json();

    if (res.ok) return data as Interaccion;

    logger.error(`Error en getInteraccionById ${id}:`, data);
    return null;
  } catch (error) {
    logger.error("Error en getInteraccionById:", error);
    return null;
  }
};

export const createInteraccion = async (values: InteraccionSchemaType, authToken?: string) => {
  try {
    logger.log("Creando interacción...", values);
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (res.ok) {
      revalidateTag(getCacheTag('interactions', 'all'));
      logger.log("Interacción creada:", data);
      return data as Interaccion;
    }

    logger.error("Error en createInteraccion:", data);
    return null;
  } catch (error) {
    logger.error("Error en createInteraccion:", error);
    return null;
  }
};

export const updateInteraccion = async (id: number, values: Partial<UpdateInteraccionSchemaType>, authToken?: string) => {
  try {
    logger.log(`Actualizando interacción ${id}...`, values);
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (res.ok) {
      revalidateTag(getCacheTag('interactions', 'all'));
      logger.log(`Interacción ${id} actualizada:`, data);
      return data as Interaccion;
    }

    logger.error(`Error en updateInteraccion ${id}:`, data);
    return null;
  } catch (error) {
    logger.error(`Error en updateInteraccion ${id}:`, error);
    return null;
  }
};

export const deleteInteraccion = async (id: number, authToken?: string) => {
  try {
    logger.log(`Eliminando interacción ${id}...`);
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(authToken),
    });
    const data = await res.json();

    if (res.ok) {
      revalidateTag(getCacheTag('interactions', 'all'));
      logger.log(`Interacción ${id} eliminada.`);
      return data as Interaccion;
    }

    logger.error(`Error en deleteInteraccion ${id}:`, data);
    return null;
  } catch (error) {
    logger.error(`Error en deleteInteraccion ${id}:`, error);
    return null;
  }
};
