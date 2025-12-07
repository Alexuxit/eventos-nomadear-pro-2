import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const galleryItems = [
  {
    id: 1,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070',
    title: 'Test drive Ford Ranger',
  },
  {
    id: 2,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=2039',
    title: 'Circuito profesional',
  },
  {
    id: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?q=80&w=2070',
    title: 'Lanzamiento Toyota Hilux',
  },
  {
    id: 4,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?q=80&w=2070',
    title: 'Encuentro de propietarios',
  },
  {
    id: 5,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2074',
    title: 'Experiencia off-road',
  },
];

export function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Galería
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Momentos inolvidables
          </h2>
          <p className="text-lg text-muted-foreground">
            Reviví las mejores experiencias de nuestros eventos.
          </p>
        </div>

        {/* Main Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
            <img
              src={galleryItems[currentIndex].url}
              alt={galleryItems[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-foreground font-semibold text-lg">
                {galleryItems[currentIndex].title}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background border-border/50"
            onClick={goToPrevious}
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background border-border/50"
            onClick={goToNext}
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-2 mt-6">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'opacity-50 hover:opacity-75'
              }`}
              aria-label={`Ver ${item.title}`}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
