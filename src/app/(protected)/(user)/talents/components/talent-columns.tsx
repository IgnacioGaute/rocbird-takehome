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
import { ReferenteTecnico } from '@/types/technical-reference.type';
import { UpdateTalentoDialog } from './update-talent-dialog';
import { DeleteTalentoDialog } from './delete-talent-dialog';
import { TalentoInteractionsHover } from './talent-card';


export const TalentoColumns = (referentes: ReferenteTecnico[]): ColumnDef<Talento>[] => [
  {
    accessorKey: 'nombre_y_apellido',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre y Apellido" />
    ),
    cell: ({ row }) => {
      const talento = row.original;
      return <TalentoInteractionsHover talento={talento} />;
    },
  },
  {
    accessorKey: 'seniority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seniority" />
    ),
    cell: ({ row }) => {
      const value = row.getValue('seniority') as string;
      const formatted = value.replace(/_/g, ' ').toLowerCase(); 
      return <div className="min-w-[100px] text-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: 'rol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] text-sm">{row.getValue('rol')}</div>
    ),
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const value = row.getValue('estado') as string;
      const formatted = value.replace(/_/g, ' ').toLowerCase();
      return <div className="min-w-[100px] text-sm">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const talento = row.original;

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
            <UpdateTalentoDialog talento={talento} referentes={referentes}/>
            <DeleteTalentoDialog talento={talento}/>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
