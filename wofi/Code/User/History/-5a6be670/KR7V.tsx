import dynamic from "next/dynamic"

// Dynamic imports to prevent hydration issues
const Navbar = dynamic(() => import("@/components/navbar"), { ssr: false })
const HeroSection = dynamic(() => import("@/components/hero-section"), { ssr: true })
const AboutSection = dynamic(() => import("@/components/about-section"), { ssr: true })
const MissionVisionSection = dynamic(() => import("@/components/mission-vision-section"), { ssr: true })
const ValuesSection = dynamic(() => import("@/components/values-section"), { ssr: true })
const ServicesSection = dynamic(() => import("@/components/services-section"), { ssr: true })
const DifferentialsSection = dynamic(() => import("@/components/differentials-section"), { ssr: true })
const TestimonialsSection = dynamic(() => import("@/components/testimonials-section"), { ssr: true })
const CTASection = dynamic(() => import("@/components/cta-section"), { ssr: true })
const ContactSection = dynamic(() => import("@/components/contact-section"), { ssr: true })

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
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
    </main>
  )
}
