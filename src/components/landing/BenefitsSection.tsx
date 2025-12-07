import { Shield, Zap, Users, Award, Car, Calendar } from 'lucide-react';

const benefits = [
  {
    icon: Car,
    title: 'Test drives exclusivos',
    description: 'Probá los últimos modelos de pick-ups en circuitos profesionales diseñados para mostrar todo su potencial.',
  },
  {
    icon: Calendar,
    title: 'Eventos premium',
    description: 'Accedé a lanzamientos, exposiciones y encuentros exclusivos con las principales marcas automotrices.',
  },
  {
    icon: Users,
    title: 'Comunidad selecta',
    description: 'Conectá con otros entusiastas, coleccionistas y profesionales del mundo automotriz.',
  },
  {
    icon: Shield,
    title: 'Experiencia segura',
    description: 'Todos nuestros eventos cuentan con protocolos de seguridad y profesionales capacitados.',
  },
  {
    icon: Award,
    title: 'Beneficios exclusivos',
    description: 'Accedé a descuentos especiales, financiación preferencial y promociones únicas.',
  },
  {
    icon: Zap,
    title: 'Innovación constante',
    description: 'Descubrí las últimas tecnologías y tendencias del mercado automotriz antes que nadie.',
  },
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="section-padding bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Beneficios
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Por qué elegir Nomadear
          </h2>
          <p className="text-lg text-muted-foreground">
            Más que una plataforma, somos tu conexión directa con el mundo premium de las pick-ups.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group p-6 lg:p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300 card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
