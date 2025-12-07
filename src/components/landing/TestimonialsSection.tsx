import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  nombre: string;
  rol: string | null;
  contenido: string;
  imagen_url: string | null;
}

// Sample testimonials for placeholder
const sampleTestimonials: Testimonial[] = [
  {
    id: '1',
    nombre: 'Martín González',
    rol: 'Propietario de Ford Ranger',
    contenido: 'Increíble experiencia en el test drive. El circuito profesional me permitió conocer todo el potencial de la Ranger. Definitivamente volveré.',
    imagen_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
  },
  {
    id: '2',
    nombre: 'Carolina Méndez',
    rol: 'Empresaria',
    contenido: 'Los eventos de Nomadear son de primer nivel. La organización impecable y el trato personalizado hacen la diferencia.',
    imagen_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
  },
  {
    id: '3',
    nombre: 'Roberto Fernández',
    rol: 'Coleccionista automotriz',
    contenido: 'Como entusiasta de las pick-ups, encontré en Nomadear una comunidad única. Las experiencias superan cualquier expectativa.',
    imagen_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
  },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(sampleTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true })
        .limit(6);

      if (!error && data && data.length > 0) {
        setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonios" className="section-padding bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Testimonios
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Lo que dicen nuestros participantes
          </h2>
          <p className="text-lg text-muted-foreground">
            Historias reales de quienes vivieron la experiencia Nomadear.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="p-6 lg:p-8 rounded-2xl bg-background border border-border card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="h-8 w-8 text-primary/40 mb-4" />
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.contenido}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.imagen_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'}
                  alt={testimonial.nombre}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.nombre}</p>
                  {testimonial.rol && (
                    <p className="text-sm text-muted-foreground">{testimonial.rol}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
