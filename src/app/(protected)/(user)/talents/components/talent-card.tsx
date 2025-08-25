'use client';

import * as React from 'react';
import { Talento } from '@/types/talent.type';
import { Interaccion } from '@/types/interaction.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CreateInteractionDialog } from '../../interactions/components/create-interaction-dialog';
import { StateButton } from '../../interactions/components/state-button';

type Props = {
  talento: Talento;
};

export function TalentoInteractionsHover({ talento }: Props) {
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isInteracting, setIsInteracting] = React.useState(false);

  const interaccionesActivas = talento.interacciones?.filter(
    i => i.estado !== 'FINALIZADA'
  ) ?? [];

  const handleMouseEnter = () => {
    if (!isInteracting) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isInteracting) {
      setOpen(false);
    }
  };

  const handlePopoverOpenChange = (newOpen: boolean) => {
    if (!isInteracting) {
      setOpen(newOpen);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={handlePopoverOpenChange} modal={false}>
        <PopoverTrigger asChild>
          <span
            className="text-white cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {talento.nombre_y_apellido}
          </span>
        </PopoverTrigger>

        <PopoverContent
          className="w-80"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => e.stopPropagation()}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Interacciones activas o pendientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {interaccionesActivas.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No tiene interacciones activas o pendientes
                </p>
              ) : (
                interaccionesActivas.map((i: Interaccion) => (
                  <div
                    key={i.id}
                    className="text-xs border-b pb-1 flex flex-col gap-1"
                  >
                    <p><strong>Tipo:</strong> {i.tipo_de_interaccion}</p>
                    <p><strong>Detalle:</strong> {i.detalle}</p>
                    <p className="flex items-center gap-2">
                      <strong>Estado:</strong>
                      <StateButton 
                        interaccion={i} 
                        onInteractionStart={() => setIsInteracting(true)}
                        onInteractionEnd={() => setIsInteracting(false)}
                      />
                    </p>
                    <p><strong>Fecha:</strong> {new Date(i.fecha).toLocaleDateString()}</p>
                  </div>
                ))
              )}
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full"
                onClick={() => {
                  setDialogOpen(true);
                  setOpen(true); // Mantener abierto el popover mientras se abre el dialog
                }}
              >
                Agregar Interacción
              </Button>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      <CreateInteractionDialog
        talentos={[talento]}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultTalentoId={talento.id}
        omitTrigger={true}
      />
    </>
  );
}
