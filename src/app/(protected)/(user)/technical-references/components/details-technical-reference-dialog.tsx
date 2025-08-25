'use client';

import * as React from 'react';
import { ReferenteTecnico } from '@/types/technical-reference.type';
import { Talento } from '@/types/talent.type';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Props = {
  referente: ReferenteTecnico;
};

function formatValue(value: string) {
  return value.replace(/_/g, ' ').toLowerCase();
}

export function ReferenteDetailsDialog({ referente }: Props) {
  const talentos: Array<Talento & { tipoRelacion: 'líder' | 'mentor' }> = [
    ...(referente.liderTalentos ?? []).map(t => ({ ...t, tipoRelacion: 'líder' as const })),
    ...(referente.mentorTalentos ?? []).map(t => ({ ...t, tipoRelacion: 'mentor' as const })),
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button
            variant="ghost"
            className="w-full justify-start"
            size="sm"
          >
            Ver Detalles
          </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[100vh] sm:max-h-[150vh] overflow-y-auto w-full max-w-2xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Referente técnico</DialogTitle>
        </DialogHeader>

        <Card className="p-4 space-y-3 text-sm sm:text-base">

          <CardHeader>
            <CardTitle className="text-lg">
              Relaciones con los Talentos de {referente.nombre_y_apellido}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {talentos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tiene talentos a cargo.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[220px]">Nombre y apellido</TableHead>
                      <TableHead className="min-w-[120px]">Seniority</TableHead>
                      <TableHead className="min-w-[140px]">Rol</TableHead>
                      <TableHead className="min-w-[120px]">Estado</TableHead>
                      <TableHead className="min-w-[120px]">Relación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {talentos.map((t, index) => (
                    <TableRow key={`${t.id}-${t.tipoRelacion}-${index}`}>
                      <TableCell>{t.nombre_y_apellido}</TableCell>
                      <TableCell className="capitalize">{formatValue(t.seniority)}</TableCell>
                      <TableCell className="capitalize">{formatValue(t.rol)}</TableCell>
                      <TableCell className="capitalize">{formatValue(t.estado)}</TableCell>
                      <TableCell className="capitalize">{t.tipoRelacion}</TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
