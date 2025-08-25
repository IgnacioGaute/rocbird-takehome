import { Talento } from "./talent.type";

export const ESTADO_INTERACCION = ['INICIADA', 'EN_PROGRESO', 'FINALIZADA'] as const;
export type EstadoInteraccion = (typeof ESTADO_INTERACCION)[number];

export type Interaccion = {
  id: number;
  talentoId: number;
  tipo_de_interaccion: string;
  fecha: string;
  detalle: string;
  estado: EstadoInteraccion;
  fecha_de_modificacion?: string;
  talento?: Talento;
  createdAt: string;
  updatedAt: string;
};