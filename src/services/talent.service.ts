import { TalentoSchemaType, UpdateTalentoSchemaType } from "../schema/talent.schema";
import { Talento } from "@/types/talent.type";
import { getCacheTag } from "./cache-tags";
import { revalidateTag } from "next/cache";
import { getAuthHeaders } from "@/lib/auth";
import { Logger } from "@/lib/logger";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/talents`;
const logger = new Logger("TalentoService");

export const getTalentos = async (authToken?: string) => {
  try {
    logger.log("Obteniendo talentos...");
    const response = await fetch(`${BASE_URL}`, { headers: await getAuthHeaders(authToken) });
    const data = await response.json();

    if (response.ok) {
      return data as Talento[];
    } else {
      logger.error("Error obteniendo talentos:", data);
      return null;
    }
  } catch (error) {
    logger.error("Error en getTalentos:", error);
    return null;
  }
};

export const getTalentoById = async (talentoId: number) => {
  try {
    logger.log(`Obteniendo talento con ID: ${talentoId}`);
    const response = await fetch(`${BASE_URL}/${talentoId}`, { headers: { "Content-Type": "application/json" } });
    const data = await response.json();

    if (response.ok) {
      return data as Talento;
    } else {
      logger.error(`Error obteniendo talento ${talentoId}:`, data);
      return null;
    }
  } catch (error) {
    logger.error("Error en getTalentoById:", error);
    return null;
  }
};

export const createTalento = async (values: TalentoSchemaType, authToken?: string) => {
  try {
    logger.log("Creando talento...", values);
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(values),
    });

    const data = await res.json();
    if (res.ok) {
      revalidateTag(getCacheTag("talents", "all"));
      logger.log("Talento creado:", data);
      return data as Talento;
    } else {
      logger.error("Error en createTalento:", data);
      return null;
    }
  } catch (error) {
    logger.error("Error en createTalento:", error);
    return null;
  }
};

export const updateTalento = async (talentoId: number, values: Partial<UpdateTalentoSchemaType>, authToken?: string) => {
  try {
    logger.log(`Actualizando talento ${talentoId}...`, values);
    const res = await fetch(`${BASE_URL}/${talentoId}`, {
      method: "PUT",
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(values),
    });

    const data = await res.json();
    if (res.ok) {
      revalidateTag(getCacheTag("talents", "all"));
      logger.log(`Talento ${talentoId} actualizado:`, data);
      return data as Talento;
    } else {
      logger.error(`Error en updateTalento ${talentoId}:`, data);
      return null;
    }
  } catch (error) {
    logger.error(`Error en updateTalento ${talentoId}:`, error);
    return null;
  }
};

export const deleteTalento = async (talentoId: number, authToken?: string) => {
  try {
    logger.log(`Eliminando talento ${talentoId}...`);
    const res = await fetch(`${BASE_URL}/${talentoId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(authToken),
    });

    const data = await res.json();
    if (res.ok) {
      revalidateTag(getCacheTag("talents", "all"));
      logger.log(`Talento ${talentoId} eliminado.`);
      return data as Talento;
    } else {
      logger.error(`Error en deleteTalento ${talentoId}:`, data);
      return null;
    }
  } catch (error) {
    logger.error(`Error en deleteTalento ${talentoId}:`, error);
    return null;
  }
};
