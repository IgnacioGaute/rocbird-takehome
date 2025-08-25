'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useState } from 'react';
import { Interaccion } from '@/types/interaction.type';
import { updateInteraccionAction } from '@/actions/interactions/update-interaction.action';

type EstadoButtonProps = {
  interaccion: Interaccion;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
};

export function StateButton({ interaccion, onInteractionStart, onInteractionEnd }: EstadoButtonProps) {
  const [estado, setEstado] = useState<"INICIADA" | "EN_PROGRESO" | "FINALIZADA">(interaccion.estado);

  const handleUpdateEstado = async (newEstado: "INICIADA" | "EN_PROGRESO" | "FINALIZADA") => {
    try {
      onInteractionStart?.();
      const data = await updateInteraccionAction(interaccion.id, { estado: newEstado });
      if (data.error) toast.error(data.error);
      else {
        setEstado(newEstado);
        toast.success(`Estado actualizado a "${newEstado.replace(/_/g,' ').toLowerCase()}"`);
      }
    } catch {
      toast.error('No se pudo actualizar el estado');
    } finally {
      onInteractionEnd?.();
    }
  };

  const estados = [
    { label: 'Pendiente', value: 'INICIADA', color: 'bg-yellow-500 text-black' },
    { label: 'En progreso', value: 'EN_PROGRESO', color: 'bg-green-600 text-white' },
    { label: 'Finalizada', value: 'FINALIZADA', color: 'bg-red-600 text-white' },
  ];

  return (
    <DropdownMenu onOpenChange={(open) => {
      if (open) {
        onInteractionStart?.();
      } else {
        onInteractionEnd?.();
      }
    }}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className={`w-20 h-6 text-xs ${estados.find(e => e.value === estado)?.color}`}
          onClick={(e) => e.stopPropagation()}
        >
          {estados.find(e => e.value === estado)?.label}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" onClick={(e) => e.stopPropagation()}>
        {estados.map((e) => (
          <Button
            key={e.value}
            size="sm"
            variant="ghost"
            onClick={(ev) => {
              ev.stopPropagation(); // evita que el popover interprete el click como fuera
              handleUpdateEstado(e.value as "INICIADA" | "EN_PROGRESO" | "FINALIZADA");
            }}
          >
            {e.label}
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
