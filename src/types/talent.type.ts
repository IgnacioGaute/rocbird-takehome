// types/talento.ts
import { Interaccion } from "./interaction.type";
import { ReferenteTecnico } from "./technical-reference.type";


export const ESTADO_TYPE = ['ACTIVO', 'INACTIVO'] as const;
export type EstadoType = (typeof ESTADO_TYPE)[number];

export const SENIORITY_TYPE = ['JUNIOR', 'SEMI_SENIOR', 'SENIOR'] as const;
export type SeniorityType = (typeof SENIORITY_TYPE)[number];

export type Talento = {
  id: number;
  nombre_y_apellido: string;
  seniority: SeniorityType;
  rol: string;
  estado: EstadoType;
  referenteLiderId?: number | null;
  referenteMentorId?: number | null;
  interacciones: Interaccion[];
  createdAt: string;
  updatedAt: string;
  referenteLider?: ReferenteTecnico | null;
  referenteMentor?: ReferenteTecnico | null;
};
