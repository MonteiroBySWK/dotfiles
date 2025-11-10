import { Suspense, lazy, useEffect } from "react";
// Importe os componentes de roteamento
import { Routes, Route } from "react-router-dom";
import { initGsapControl } from "./utils/gsapControl";

// Seus imports com lazy loading continuam os mesmos
const NewProjects = lazy(() => import("./sections/NewProjects"));
const SectionsGuide = lazy(() => import("./components/SectionGuide"));
const Skills = lazy(() => import("./sections/Skills"));
const Services = lazy(() => import("./sections/Services"));
const Waves = lazy(() => import("./components/Waves"));
const Hero = lazy(() => import("./sections/Hero"));
const AboutMe = lazy(() => import("./sections/AboutMe"));
const Footer = lazy(() => import("./sections/Footer"));
const BlockTransition = lazy(() => import("./components/BlockTransition"));
const ContactMe = lazy(() => import("./sections/ContactMe"));
const BackgroundParticles = lazy(
  () => import("./components/BackgroundParticles")
);
const Emulador = lazy(() => import("./components/emulador/page"));

// Componente para a página principal (seu portfólio)
function PortfolioPage() {
  useEffect(() => {
    const dispose = initGsapControl();
    return () => dispose && dispose();
  }, []);

  return (
    <main className="w-full h-full font-mono px-2 md:px-0">
      <BlockTransition />
      <BackgroundParticles />
      <div className="relative h-screen">
        <Waves />
        <Hero />
        <SectionsGuide />
      </div>
      <AboutMe />
      <Services />
      <Skills />
      <NewProjects />
      <ContactMe />
      <Footer />
    </main>
  );
}

export default function App() {
  // A lógica de teste 'if (testComponent)' foi removida
  // e substituída pelo sistema de rotas.

  return (
    <Suspense fallback={<></>}>
      <Routes>
        {/* Rota para a página principal */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Rota para o emulador */}
        <Route
          path="/emulador"
          element={
            <main className="w-full h-screen font-mono">
              <Emulador />
            </main>
          }
        />
      </Routes>
    </Suspense>
  );
}