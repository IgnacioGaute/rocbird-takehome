'use client';

import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Talento } from '@/types/talent.type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateInteraccionSchema, UpdateInteraccionSchemaType } from '@/schema/interaction.schema';
import { Interaccion } from '@/types/interaction.type';
import { updateInteraccionAction } from '@/actions/interactions/update-interaction.action';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


export function UpdateInteraccionDialog({ interaccion, talentos }: { interaccion: Interaccion, talentos : Talento[] }) {

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateInteraccionSchemaType>({
    resolver: zodResolver(updateInteraccionSchema),
    defaultValues: {
      tipo_de_interaccion: interaccion.tipo_de_interaccion || "",
      fecha: interaccion.fecha || "",
      detalle: interaccion.detalle || "",
      estado: interaccion.estado || 'INICIADA',
      talentoId: interaccion.talentoId || undefined,
    },
  });


  const onSubmit = async (values: UpdateInteraccionSchemaType) => {
    startTransition(async () => {
      const response = await updateInteraccionAction(interaccion.id, values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Interaccion actualizada exitosamente');
        form.reset();
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button
            variant="ghost"
            className="w-full justify-start"
            size="sm"
            onClick={() => setOpen(true)}
          >
            Editar Interaccion
          </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Editar Interaccion</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
              control={form.control}
              name="tipo_de_interaccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Interaccion</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-left"
                          disabled={isPending}
                        >
                        {field.value
                          ? new Date(field.value).toLocaleDateString("es-AR")
                          : "Selecciona una fecha"}

                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString() || "")}
                          disabled={isPending}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detalle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INICIADA">Iniciada</SelectItem>
                          <SelectItem value="EN_PROGRESO">En progreso</SelectItem>
                          <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="talentoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Talento de esta interaccion</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar el talento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {talentos.map((ref) => (
                        <SelectItem key={ref.id} value={String(ref.id)}>
                          {ref.nombre_y_apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              Editar Interaccion
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
