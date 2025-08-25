'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Talento } from '@/types/talent.type';
import { Interaccion } from '@/types/interaction.type';
import { UpdateInteraccionDialog } from './update-interaction-dialog';
import { DeleteInteraccionDialog } from './delete-interaction-dialog';
import { useState } from 'react';
import { updateInteraccionAction } from '@/actions/interactions/update-interaction.action';
import { toast } from 'sonner';
import { StateButton } from './state-button';


export const InteraccionColumns = (talentos: Talento[]): ColumnDef<Interaccion>[] => [
  {
    accessorKey: 'tipo_de_interaccion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de interaccion" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] text-sm">{row.getValue('tipo_de_interaccion')}</div>
    ),
  },
  {
    accessorKey: 'fecha',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const fechaISO = row.getValue('fecha') as string;
      const fecha = new Date(fechaISO);
      const fechaFormateada = fecha.toLocaleDateString('es-AR'); // DD/MM/YYYY
      return <div className="min-w-[100px] text-sm">{fechaFormateada}</div>;
    },
  },
  {
    id: 'talento',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Talento" />,
    cell: ({ row }) => {
      const interaccion = row.original;
      const talento = talentos.find(t => t.id === interaccion.talentoId);
  
      return (
        <div className="min-w-[150px] text-sm">
          {talento ? talento.nombre_y_apellido : 'Sin talento'}
        </div>
      );
    },
  },
  
  {
    accessorKey: 'estado',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => <StateButton interaccion={row.original} />,
  },
  
  {
    id: 'actions',
    cell: ({ row }) => {
      const interaccion = row.original;

      return  (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel className="text-sm">Acciones</DropdownMenuLabel>
            <UpdateInteraccionDialog interaccion={interaccion} talentos={talentos}/>
            <DeleteInteraccionDialog interaccion={interaccion}/>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
