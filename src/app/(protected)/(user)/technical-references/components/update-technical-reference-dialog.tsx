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
import { updateReferenteTecnicoSchema, UpdateReferenteTecnicoSchemaType } from '@/schema/technical-reference.schema';
import { updateReferenteAction } from '@/actions/technical-references/update-technical-reference.action';
import { Input } from '@/components/ui/input';


export function UpdateReferenteDialog({ referente }: { referente: ReferenteTecnico }) {

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateReferenteTecnicoSchemaType>({
    resolver: zodResolver(updateReferenteTecnicoSchema),
    defaultValues: {
      nombre_y_apellido: referente.nombre_y_apellido || ""
    },
  });


  const onSubmit = async (values: UpdateReferenteTecnicoSchemaType) => {
    startTransition(async () => {
      const response = await updateReferenteAction(referente.id, values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Referente actualizado exitosamente');
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
            Editar Referente
          </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Editar Referente</DialogTitle>
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
            <Button className="w-full" type="submit" disabled={isPending}>
              Editar Referente
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
