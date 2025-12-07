import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { EventRegistrationModal } from './EventRegistrationModal';

interface Event {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  hora_inicio: string | null;
  ubicacion: string | null;
  ciudad: string | null;
  capacidad_maxima: number | null;
  imagen_url: string | null;
}

// Sample events for placeholder
const sampleEvents: Event[] = [
  {
    id: '1',
    titulo: 'Test Drive Ford Ranger',
    descripcion: 'Viví la experiencia de manejar la nueva Ford Ranger en un circuito profesional.',
    fecha: '2024-02-15',
    hora_inicio: '10:00',
    ubicacion: 'Autódromo de Buenos Aires',
    ciudad: 'Buenos Aires',
    capacidad_maxima: 30,
    imagen_url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=2039',
  },
  {
    id: '2',
    titulo: 'Lanzamiento Toyota Hilux 2024',
    descripcion: 'Sé el primero en conocer la nueva Hilux con sus innovadoras características.',
    fecha: '2024-02-22',
    hora_inicio: '18:00',
    ubicacion: 'Centro de Convenciones',
    ciudad: 'Córdoba',
    capacidad_maxima: 100,
    imagen_url: 'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?q=80&w=2070',
  },
  {
    id: '3',
    titulo: 'Encuentro Pick-up Owners',
    descripcion: 'Encuentro exclusivo para propietarios y entusiastas de pick-ups premium.',
    fecha: '2024-03-01',
    hora_inicio: '09:00',
    ubicacion: 'Estancia La Aurora',
    ciudad: 'Mendoza',
    capacidad_maxima: 50,
    imagen_url: 'https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?q=80&w=2070',
  },
];

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('activo', true)
        .gte('fecha', new Date().toISOString().split('T')[0])
        .order('fecha', { ascending: true })
        .limit(6);

      if (!error && data && data.length > 0) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <section id="eventos" className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Eventos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Próximos eventos
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubrí los eventos más exclusivos del mundo automotriz y reservá tu lugar.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event, index) => (
            <article
              key={event.id}
              className="group rounded-2xl overflow-hidden bg-card border border-border card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.imagen_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070'}
                  alt={event.titulo}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {format(new Date(event.fecha), 'dd MMM', { locale: es }).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {event.titulo}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {event.descripcion}
                </p>

                {/* Meta */}
                <div className="space-y-2 mb-6">
                  {event.hora_inicio && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{event.hora_inicio} hs</span>
                    </div>
                  )}
                  {(event.ubicacion || event.ciudad) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.ubicacion}{event.ciudad && `, ${event.ciudad}`}</span>
                    </div>
                  )}
                  {event.capacidad_maxima && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Hasta {event.capacidad_maxima} participantes</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button 
                  onClick={() => setSelectedEvent(event)}
                  className="w-full btn-premium"
                >
                  Inscribirme
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-xl">
            Ver todos los eventos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}
