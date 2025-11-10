import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import MissionVisionSection from "@/components/mission-vision-section"
import ValuesSection from "@/components/values-section"
import ServicesSection from "@/components/services-section"
import DifferentialsSection from "@/components/differentials-section"
import TestimonialsSection from "@/components/testimonials-section"
import CTASection from "@/components/cta-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
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
