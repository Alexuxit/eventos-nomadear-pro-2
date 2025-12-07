import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const newsletterSchema = z.object({
  email: z.string().email('Ingresá un correo electrónico válido'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export function NewsletterSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);

    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: data.email,
    });

    setIsSubmitting(false);

    if (error) {
      if (error.code === '23505') {
        toast.info('Este correo ya está suscripto al newsletter.');
      } else {
        toast.error('Ocurrió un error. Por favor, intentá de nuevo.');
      }
      return;
    }

    setIsSubscribed(true);
    reset();
    toast.success('¡Te suscribiste correctamente!');
  };

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10" />
            <div className="absolute inset-0 bg-card/90" />
            
            {/* Content */}
            <div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Mantenete informado
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Suscribite a nuestro newsletter y recibí información sobre próximos eventos, 
                lanzamientos exclusivos y promociones especiales.
              </p>

              {isSubscribed ? (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">¡Gracias por suscribirte!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...register('email')}
                        className={`h-12 bg-background ${errors.email ? 'border-destructive' : ''}`}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive text-left mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="h-12 px-8 btn-premium"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Suscribirme'
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Al suscribirte aceptás recibir comunicaciones de Nomadear. 
                    Podés darte de baja en cualquier momento.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
