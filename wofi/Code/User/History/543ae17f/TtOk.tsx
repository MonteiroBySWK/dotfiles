import React, { Suspense } from 'react';

// Carregamento dinâmico dos componentes
const Navbar                 = React.lazy(() => import('@/components/navbar'));
const HeroSection            = React.lazy(() => import('@/components/hero-section'));
const AboutSection           = React.lazy(() => import('@/components/about-section'));
const MissionVisionSection   = React.lazy(() => import('@/components/mission-vision-section'));
const ValuesSection          = React.lazy(() => import('@/components/values-section'));
const ServicesSection        = React.lazy(() => import('@/components/services-section'));
const DifferentialsSection   = React.lazy(() => import('@/components/differentials-section'));
const TestimonialsSection    = React.lazy(() => import('@/components/testimonials-section'));
const CTASection             = React.lazy(() => import('@/components/cta-section'));
const ContactSection         = React.lazy(() => import('@/components/contact-section'));

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Suspense fallback={<div>Carregando...</div>}>
        <Navbar />
        <HeroSection />
        <AboutSection />
        <MissionVisionSection />
        <ValuesSection />
        <ServicesSection />
        <DifferentialsSection />
        <TestimonialsSection />
        <CTASection />
        <ContactSection />
      </Suspense>
    </div>
  );
}
