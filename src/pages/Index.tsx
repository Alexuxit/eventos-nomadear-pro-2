import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/landing/HeroSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { EventsSection } from '@/components/landing/EventsSection';
import { GallerySection } from '@/components/landing/GallerySection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { NewsletterSection } from '@/components/landing/NewsletterSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <BenefitsSection />
      <EventsSection />
      <GallerySection />
      <TestimonialsSection />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
