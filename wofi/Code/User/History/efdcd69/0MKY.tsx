"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import ParallaxElement from "@/components/animations/parallax-element"

export default function HeroSection() {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Subtle Background Pattern */}
      <ParallaxElement speed={0.2} className="absolute inset-0 opacity-5">
        <motion.svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 3, delay: 1 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10,0 L10,100 M0,10 L100,10 M50,0 L50,100 M0,50 L100,50" stroke="#E2E2E2" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="1" fill="#E2E2E2" />
              <circle cx="50" cy="50" r="1" fill="#E2E2E2" />
              <circle cx="90" cy="90" r="1" fill="#E2E2E2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </motion.svg>
      </ParallaxElement>

      {/* Subtle Accent Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-1/4 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-brand-accent/5 transform rotate-45"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 bg-brand-primary-dark/5 transform rotate-45"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20 sm:py-24 lg:py-32">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}
        >
          <span className="block text-brand-primary-light sm:inline">Technos Jr</span>
          <br className="hidden sm:block" />
          <span className="block sm:inline bg-clip-text text-transparent bg-gradient-to-r from-brand-primary-dark to-brand-primary-light">
            Empresa Júnior de Engenharia de Computação
          </span>
        </motion.h1>

        <motion.h2
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-brand-accent mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          Soluções em Hardware & Software para a Comunidade Local
        </motion.h2>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
            transition={{ duration: 0.15 }}
          >
            <Button
              size="lg"
              onClick={() => handleNavClick("#servicos")}
              className="w-full sm:w-auto bg-brand-primary-dark hover:bg-brand-accent text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-200 text-base sm:text-lg focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 focus:ring-offset-black-soft"
            >
              Conheça Nossos Serviços
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
            transition={{ duration: 0.15 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNavClick("#contato")}
              className="w-full sm:w-auto border-2 border-brand-accent text-white hover:bg-brand-accent hover:text-black-soft font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-200 text-base sm:text-lg focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 focus:ring-offset-black-soft"
            >
              Solicite Orçamento
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
