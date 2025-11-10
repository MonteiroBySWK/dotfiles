import { Suspense, lazy, useEffect } from "react";
import { initGsapControl } from "./utils/gsapControl";

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

export default function App() {
  useEffect(() => {
    const dispose = initGsapControl();
    return () => dispose && dispose();
  }, []);
  const testComponent = true;
  if (testComponent) {
    return (
      <main className="w-full h-screen font-mono">
        <Suspense fallback={<></>}>
          <Emulador />
        </Suspense>
      </main>
    );
  }

  return (
    <main className="w-full h-full font-mono px-2 md:px-0">
      <Suspense fallback={<></>}>
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
      </Suspense>
    </main>
  );
}
