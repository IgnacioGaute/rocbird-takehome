import { Talento } from "./talent.type";

export type ReferenteTecnico = {
  id: number;
  nombre_y_apellido: string;
  createdAt: string;
  updatedAt: string;
  liderTalentos?: Talento[];
  mentorTalentos?: Talento[];
};