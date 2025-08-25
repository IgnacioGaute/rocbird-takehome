'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReferenteTecnico } from '@/types/technical-reference.type';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { UpdateReferenteDialog } from './update-technical-reference-dialog';
import { DeleteReferenteDialog } from './delete-technical-reference-dialog';
import { ReferenteDetailsDialog } from './details-technical-reference-dialog';


export const ReferenteColumns: ColumnDef<ReferenteTecnico>[] = [
  {
    accessorKey: 'nombre_y_apellido',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre y Apellido" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] text-sm">{row.getValue('nombre_y_apellido')}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const referente = row.original;

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
            <UpdateReferenteDialog referente={referente}/>
            <DeleteReferenteDialog referente={referente}/>
            <ReferenteDetailsDialog referente={referente}/>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
