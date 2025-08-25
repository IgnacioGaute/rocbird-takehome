'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import { Talento } from '@/types/talent.type';
import { CreateInteractionDialog } from './create-interaction-dialog';
import { Search, MessageSquare } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: (talentos: Talento[]) =>  ColumnDef<TData, TValue>[];
  data: TData[];
  talentos: Talento[];
}

export function InteraccionTable<TData, TValue>({
  columns,
  data,
  talentos
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns: columns(talentos),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Table Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input
              placeholder="Buscar por tipo de interacción..."
              value={(table.getColumn('tipo_de_interaccion')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('tipo_de_interaccion')?.setFilterValue(event.target.value)
              }
              className="pl-10 h-11 bg-slate-800/90 border-slate-600 text-white placeholder:text-slate-300 focus:border-green-400 focus:ring-green-400/20 rounded-xl transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <CreateInteractionDialog talentos={talentos}/>
          <div className="relative">
            <DataTableViewOptions table={table} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/95 rounded-xl border border-slate-700/60 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-slate-600/40 hover:bg-slate-800/40">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead 
                        key={header.id} 
                        className="whitespace-nowrap bg-gradient-to-r from-slate-800 to-slate-700 text-slate-100 font-semibold py-4 px-6 text-sm border-b border-slate-600/60"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`border-slate-600/30 hover:bg-slate-800/50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-900/40'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="whitespace-nowrap py-4 px-6 text-sm text-slate-100 border-b border-slate-600/20"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleFlatColumns().length}
                    className="h-32 text-center text-slate-300 py-8"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="h-8 w-8 text-slate-400" />
                      <p className="text-sm font-medium text-slate-200">No hay interacciones para mostrar</p>
                      <p className="text-xs text-slate-400">Comienza agregando una nueva interacción</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-slate-800/90 rounded-xl border border-slate-700/60 p-4 shadow-lg">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
