'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Talento } from '@/types/talent.type';
import { deleteTalentoSchema, DeleteTalentoSchemaType } from '@/schema/talent.schema';
import { deleteTalentoAction } from '@/actions/talents/delete-talent.action';
import { Interaccion } from '@/types/interaction.type';
import { deleteInteraccionAction } from '@/actions/interactions/delete-interaction.action';
import { deleteInteraccionSchema, DeleteInteraccionSchemaType } from '@/schema/interaction.schema';


const DELETE_INTERACCION_TEXT = 'Eliminar interaccion';

export function DeleteInteraccionDialog({ interaccion }: { interaccion: Interaccion }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<DeleteInteraccionSchemaType>({
    resolver: zodResolver(deleteInteraccionSchema),
    defaultValues: {
      confirmation: '',
    },
  });

  const onSubmit = (values: DeleteInteraccionSchemaType) => {
    if (
      values.confirmation !== DELETE_INTERACCION_TEXT
    ) {
      toast.error('Los detalles de confirmación no coinciden.');
      return;
    }

    startTransition(() => {
      deleteInteraccionAction(interaccion.id).then((data) => {
        if (!data || data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          form.reset();
          setOpen(false);
        }
      });
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
            Eliminar Interaccion
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Interaccion</DialogTitle>
            <DialogDescription>
              Ingrese {DELETE_INTERACCION_TEXT} para confirmar.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmación</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder={DELETE_INTERACCION_TEXT}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={isPending}
                >
                  Eliminar Interaccion
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
