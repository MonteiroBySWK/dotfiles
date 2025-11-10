// src/App.jsx (ou Home.jsx)
import React, { Suspense, lazy } from 'react'

// Importação dinâmica dos componentes
const Navbar = lazy(() => import('./components/navbar'))
const HeroSection = lazy(() => import('./components/hero-section'))
const AboutSection = lazy(() => import('./components/about-section'))
const MissionVisionSection = lazy(() => import('./components/mission-vision-section'))
const ValuesSection = lazy(() => import('./components/values-section'))
const ServicesSection = lazy(() => import('./components/services-section'))
const DifferentialsSection = lazy(() => import('./components/differentials-section'))
const TestimonialsSection = lazy(() => import('./components/testimonials-section'))
const CTASection = lazy(() => import('./components/cta-section'))
const ContactSection = lazy(() => import('./components/contact-section'))

export default function App() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Carrega o Navbar de forma independente */}
      <Suspense fallback={<div>Carregando menu...</div>}>
        <Navbar />
      </Suspense>

      {/* Carrega todas as seções dentro de um mesmo Suspense */}
      <Suspense fallback={<div>Carregando conteúdo...</div>}>
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
    </main>
  )
}
