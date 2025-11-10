import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AdminLayout } from '@/pages/admin/layout';
import Dashboard from '@/pages/admin/dashboard';

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
const Team                   = React.lazy(() => import('@/components/team'));


function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Suspense fallback={<div></div>}>
        <Navbar />
        <HeroSection />
        <AboutSection />
        <Team />
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

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<div className="p-6">Clientes em breve</div>} />
            <Route path="products" element={<div className="p-6">Produtos em breve</div>} />
            <Route path="orders" element={<div className="p-6">Pedidos em breve</div>} />
            <Route path="financial" element={<div className="p-6">Financeiro em breve</div>} />
            <Route path="reports" element={<div className="p-6">Relatórios em breve</div>} />
            <Route path="settings" element={<div className="p-6">Configurações em breve</div>} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
