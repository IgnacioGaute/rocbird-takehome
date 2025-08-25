import { ReferenteTecnicoSchemaType, UpdateReferenteTecnicoSchemaType } from "@/schema/technical-reference.schema";
import { ReferenteTecnico } from "@/types/technical-reference.type";
import { getCacheTag } from "./cache-tags";
import { revalidateTag } from "next/cache";
import { getAuthHeaders } from "@/lib/auth";
import { Logger } from "@/lib/logger";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/technical-reference`;
const logger = new Logger("ReferenteTecnicoService");

export const getReferentes = async (authToken?: string) => {
  try {
    logger.log("Obteniendo todos los referentes técnicos...");
    const response = await fetch(`${BASE_URL}`, {
      headers: await getAuthHeaders(authToken),
      next: { tags: [getCacheTag('technicalReference', 'all')] },
    });
    const data = await response.json();

    if (response.ok) return data as ReferenteTecnico[];
    
    logger.error("Error en getReferentes:", data);
    return null;
  } catch (error) {
    logger.error("Error en getReferentes:", error);
    return null;
  }
};

export const getReferenteById = async (referenteId: number, authToken?: string) => {
  try {
    logger.log(`Obteniendo referente técnico con ID: ${referenteId}`);
    const response = await fetch(`${BASE_URL}/${referenteId}`, {
      headers: await getAuthHeaders(authToken),
    });
    const data = await response.json();

    if (response.ok) return data as ReferenteTecnico;

    logger.error(`Error en getReferenteById ${referenteId}:`, data);
    return null;
  } catch (error) {
    logger.error("Error en getReferenteById:", error);
    return null;
  }
};

export const createReferente = async (values: ReferenteTecnicoSchemaType, authToken?: string) => {
  try {
    logger.log("Creando referente técnico...", values);
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (res.ok) {
      revalidateTag(getCacheTag('technicalReference', 'all'));
      logger.log("Referente técnico creado:", data);
      return data as ReferenteTecnico;
    }

    logger.error("Error en createReferente:", data);
    return null;
  } catch (error) {
    logger.error("Error en createReferente:", error);
    return null;
  }
};

export const updateReferente = async (referenteId: number, values: Partial<UpdateReferenteTecnicoSchemaType>, authToken?: string) => {
  try {
    logger.log(`Actualizando referente técnico ${referenteId}...`, values);
    const res = await fetch(`${BASE_URL}/${referenteId}`, {
      method: "PUT",
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (res.ok) {
      revalidateTag(getCacheTag('technicalReference', 'all'));
      logger.log(`Referente técnico ${referenteId} actualizado:`, data);
      return data as ReferenteTecnico;
    }

    logger.error(`Error en updateReferente ${referenteId}:`, data);
    return null;
  } catch (error) {
    logger.error(`Error en updateReferente ${referenteId}:`, error);
    return null;
  }
};

export const deleteReferente = async (referenteId: number, authToken?: string) => {
  try {
    logger.log(`Eliminando referente técnico ${referenteId}...`);
    const res = await fetch(`${BASE_URL}/${referenteId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(authToken),
    });
    const data = await res.json();

    if (res.ok) {
      revalidateTag(getCacheTag('technicalReference', 'all'));
      logger.log(`Referente técnico ${referenteId} eliminado.`);
      return data as ReferenteTecnico;
    }

    logger.error(`Error en deleteReferente ${referenteId}:`, data);
    return null;
  } catch (error) {
    logger.error(`Error en deleteReferente ${referenteId}:`, error);
    return null;
  }
};
