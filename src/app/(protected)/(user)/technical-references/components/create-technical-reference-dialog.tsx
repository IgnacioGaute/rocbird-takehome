'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
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
import { referenteTecnicoSchema, ReferenteTecnicoSchemaType } from '@/schema/technical-reference.schema';
import { createReferenteAction } from '@/actions/technical-references/create-technical-reference.action';
import { Briefcase } from 'lucide-react';

export function CreateReferenteDialog() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<ReferenteTecnicoSchemaType>({
    resolver: zodResolver(referenteTecnicoSchema),
    defaultValues: {
      nombre_y_apellido: ""
    },
  });

  const onSubmit = (values: ReferenteTecnicoSchemaType) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      createReferenteAction(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
          toast.success('Referente creado exitosamente');
          setOpen(false)
        })
        .catch((error) => {
          console.error(error);
          setError('Error al crear el Referente');
          toast.error(error);
        });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
        >
          <Briefcase className="h-5 w-5 mr-2" />
          Crear Referente
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Crear Referente</DialogTitle>
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
            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0" type="submit" disabled={isPending}>
              Crear Referente
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
