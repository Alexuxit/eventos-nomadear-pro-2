import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const registrationSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresá un correo electrónico válido'),
  dni: z.string().min(7, 'Ingresá un DNI válido').max(10),
  telefono: z.string().optional(),
  marca_vehiculo: z.string().optional(),
  modelo_vehiculo: z.string().optional(),
  patente: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface Event {
  id: string;
  titulo: string;
}

interface EventRegistrationModalProps {
  event: Event | null;
  onClose: () => void;
}

export function EventRegistrationModal({ event, onClose }: EventRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    if (!event) return;

    setIsSubmitting(true);

    const { error } = await supabase.from('participants').insert({
      event_id: event.id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      dni: data.dni,
      telefono: data.telefono || null,
      marca_vehiculo: data.marca_vehiculo || null,
      modelo_vehiculo: data.modelo_vehiculo || null,
      patente: data.patente || null,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error('Ocurrió un error al registrarte. Por favor, intentá de nuevo.');
      console.error('Registration error:', error);
      return;
    }

    setIsSuccess(true);
    toast.success('¡Tu registro fue enviado correctamente!');
  };

  const handleClose = () => {
    setIsSuccess(false);
    reset();
    onClose();
  };

  return (
    <Dialog open={!!event} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isSuccess ? '¡Registro exitoso!' : `Inscripción: ${event?.titulo}`}
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              ¡Gracias por inscribirte!
            </h3>
            <p className="text-muted-foreground mb-6">
              Te enviamos un correo con los detalles del evento. ¡Te esperamos!
            </p>
            <Button onClick={handleClose} className="btn-premium">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  placeholder="Juan"
                  {...register('nombre')}
                  className={errors.nombre ? 'border-destructive' : ''}
                />
                {errors.nombre && (
                  <p className="text-xs text-destructive">{errors.nombre.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  placeholder="Pérez"
                  {...register('apellido')}
                  className={errors.apellido ? 'border-destructive' : ''}
                />
                {errors.apellido && (
                  <p className="text-xs text-destructive">{errors.apellido.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  placeholder="12345678"
                  {...register('dni')}
                  className={errors.dni ? 'border-destructive' : ''}
                />
                {errors.dni && (
                  <p className="text-xs text-destructive">{errors.dni.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  placeholder="+54 11 1234-5678"
                  {...register('telefono')}
                />
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Datos del vehículo (opcional)
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marca_vehiculo">Marca</Label>
                  <Input
                    id="marca_vehiculo"
                    placeholder="Toyota"
                    {...register('marca_vehiculo')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo_vehiculo">Modelo</Label>
                  <Input
                    id="modelo_vehiculo"
                    placeholder="Hilux"
                    {...register('modelo_vehiculo')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patente">Patente</Label>
                  <Input
                    id="patente"
                    placeholder="ABC123"
                    {...register('patente')}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="btn-premium">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Confirmar inscripción'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
