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
import { ReferenteTecnico } from '@/types/technical-reference.type';
import { Input } from '@/components/ui/input';
import { Talento } from '@/types/talent.type';
import { updateTalentoSchema, UpdateTalentoSchemaType } from '@/schema/talent.schema';
import { updateTalentoAction } from '@/actions/talents/update-talent.action';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



export function UpdateTalentoDialog({ talento, referentes }: { talento: Talento, referentes : ReferenteTecnico[] }) {

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateTalentoSchemaType>({
    resolver: zodResolver(updateTalentoSchema),
    defaultValues: {
      nombre_y_apellido: talento.nombre_y_apellido || "",
      seniority: talento.seniority || 'JUNIOR',
      rol: talento.rol || "",
      estado: talento.estado || 'ACTIVO',
      referenteLiderId: talento.referenteLiderId || undefined,
      referenteMentorId: talento.referenteMentorId || undefined
    },
  });


  const onSubmit = async (values: UpdateTalentoSchemaType) => {
    startTransition(async () => {
      const response = await updateTalentoAction(talento.id, values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Talento actualizado exitosamente');
        form.reset();
        setOpen(false);
      }
    });
  };

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button
            variant="ghost"
            className="w-full justify-start"
            size="sm"
            onClick={() => setOpen(true)}
          >
            Editar Talento
          </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Editar Talento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
              control={form.control}
              name="nombre_y_apellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre y Apellido</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="seniority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seniority</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un Seniority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JUNIOR">Junior</SelectItem>
                          <SelectItem value="SEMI_SENIOR">Semi Senior</SelectItem>
                          <SelectItem value="SENIOR">Senior</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="ACTIVO">Activo</SelectItem>
                          <SelectItem value="INACTIVO">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="referenteLiderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referente Líder</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar referente líder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {referentes.map((ref) => (
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
            <FormField
              control={form.control}
              name="referenteMentorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referente Mentor</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar referente mentor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {referentes.map((ref) => (
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
              Editar Talento
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
