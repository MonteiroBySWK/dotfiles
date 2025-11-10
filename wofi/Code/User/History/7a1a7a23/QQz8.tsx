"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import FadeIn from "@/components/animations/fade-in"

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Diretora de TI",
      company: "Empresa ABC",
      avatar: "/placeholder.svg?height=48&width=48",
      text: "A Technos superou nossas expectativas. O sistema desenvolvido otimizou nossos processos e a equipe demonstrou grande profissionalismo.",
    },
    {
      name: "João Santos",
      role: "Coordenador",
      company: "ONG Esperança",
      avatar: "/placeholder.svg?height=48&width=48",
      text: "Excelente trabalho na manutenção dos nossos computadores. Agora temos equipamentos funcionando perfeitamente e com melhor desempenho.",
    },
    {
      name: "Ana Costa",
      role: "Professora",
      company: "UEMA",
      avatar: "/placeholder.svg?height=48&width=48",
      text: "O upgrade do laboratório foi fundamental para nossas aulas. Os alunos da Technos foram muito competentes e dedicados.",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (!mounted) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-neutral-support">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-brand-primary-dark">
              O que nossos clientes dizem
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-neutral-support rounded w-3/4"></div>
                <div className="h-4 bg-neutral-support rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="depoimentos" className="py-16 sm:py-20 lg:py-24 bg-neutral-support">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12 sm:mb-16" duration={0.6}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-brand-primary-dark">
            O que nossos clientes dizem
          </h2>
        </FadeIn>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-sm border border-neutral-support/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-brand-accent w-12 h-12 sm:w-16 sm:h-16"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-brand-primary-dark font-montserrat">
                    {testimonials[currentTestimonial].name}
                  </h3>
                  <p className="text-sm sm:text-base text-brand-primary-light">
                    {testimonials[currentTestimonial].role} - {testimonials[currentTestimonial].company}
                  </p>
                </div>
              </div>

              <blockquote className="text-base sm:text-lg lg:text-xl text-black-soft italic leading-relaxed text-center sm:text-left">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <motion.button
              onClick={prevTestimonial}
              className="p-2 sm:p-3 rounded-full bg-white hover:bg-brand-accent hover:text-white transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 ${
                    index === currentTestimonial ? "bg-brand-accent" : "bg-neutral-support"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="p-2 sm:p-3 rounded-full bg-white hover:bg-brand-accent hover:text-white transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
