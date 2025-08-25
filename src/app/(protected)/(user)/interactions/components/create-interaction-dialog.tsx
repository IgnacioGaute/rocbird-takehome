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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { interaccionSchema, InteraccionSchemaType } from '@/schema/interaction.schema';
import { createInteraccionAction } from '@/actions/interactions/create-interacion.action';
import { Textarea } from '@/components/ui/textarea';
import { Talento } from '@/types/talent.type';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare } from 'lucide-react';

type CreateInteractionDialogProps = {
  talentos: Talento[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTalentoId?: number;
  omitTrigger?: boolean;
};
export function CreateInteractionDialog({
  talentos,
  open: controlledOpen,
  onOpenChange,
  defaultTalentoId,
  omitTrigger = false
}: CreateInteractionDialogProps) {

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const isDialogOpen = controlledOpen ?? open;
  const setIsDialogOpen = onOpenChange ?? setOpen;
  

  const form = useForm<InteraccionSchemaType>({
    resolver: zodResolver(interaccionSchema),
    defaultValues: {
      tipo_de_interaccion: "",
      fecha: "",
      detalle: "",
      estado: 'INICIADA',
      talentoId: defaultTalentoId,
    },
  });

  const onSubmit = (values: InteraccionSchemaType) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      createInteraccionAction(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
          toast.success('Interaccion creada exitosamente');
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

      {!omitTrigger && (
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Crear Interacción
        </Button>
      </DialogTrigger>
      )}

      <DialogContent className="max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-full max-w-md sm:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Crear Interaccion</DialogTitle>
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
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0" type="submit" disabled={isPending}>
              Crear Interaccion
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
