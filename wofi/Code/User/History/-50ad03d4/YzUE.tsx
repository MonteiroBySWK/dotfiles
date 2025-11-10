import { Suspense, lazy } from "react";
const NewProjects = lazy(() => import("./sections/NewProjects"));
const SectionsGuide = lazy(() => import("./components/SectionGuide"));
const SkillsN8N = lazy(() => import("./sections/SkillsN8N"));
const Services = lazy(() => import("./sections/Services"));
const MyHistory = lazy(() => import("./sections/MyHistory"));
const Waves = lazy(() => import("./components/Waves"));
const Hero = lazy(() => import("./sections/Hero"));
const AboutMe = lazy(() => import("./sections/AboutMe"));
const Footer = lazy(() => import("./sections/Footer"));
const BlockTransition = lazy(() => import("./components/BlockTransition"));
const ContactMe = lazy(() => import("./sections/ContactMe"));
const BackgroundParticles = lazy(
  () => import("./components/BackgroundParticles")
);

export default function App() {
  const testComponent = false;
  if (testComponent) {
    return (
      <main className="w-full h-screen font-mono">
        <Suspense fallback={<></>}>
          <SkillsN8N />
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
        <MyHistory />
        <Services />
        <SkillsN8N />

        <NewProjects />
        <ContactMe />
        <Footer />
      </Suspense>
    </main>
  );
}
