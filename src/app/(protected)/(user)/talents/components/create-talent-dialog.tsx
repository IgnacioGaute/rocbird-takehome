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
import { talentoSchema, TalentoSchemaType } from '@/schema/talent.schema';
import { createTalentoAction } from '@/actions/talents/create-talent.action';
import { ReferenteTecnico } from '@/types/technical-reference.type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';


export function CreateTalentDialog({ referentes } : { referentes : ReferenteTecnico[] }) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<TalentoSchemaType>({
    resolver: zodResolver(talentoSchema),
    defaultValues: {
      nombre_y_apellido: "",
      seniority: 'JUNIOR',
      rol: "",
      estado: 'ACTIVO',
      referenteLiderId: undefined,
      referenteMentorId: undefined
    },
  });

  const onSubmit = (values: TalentoSchemaType) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      createTalentoAction(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
          toast.success('Talento creado exitosamente');
          setOpen(false)
        })
        .catch((error) => {
          console.error(error);
          setError('Error al crear el Talento');
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
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Talento
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Crear Talento</DialogTitle>
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
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0" type="submit" disabled={isPending}>
              Crear Talento
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
