"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wrench, Code, Users, Plus } from "lucide-react"
import FadeIn from "@/components/animations/fade-in"

export default function ServicesSection() {
  const services = [
    {
      icon: Wrench,
      title: "Montagem e Manutenção",
      subtitle: "Hardware Especializado",
      description:
        "Montamos, fazemos upgrades e mantemos desktops e notebooks, garantindo desempenho e durabilidade para sua empresa.",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Montagem completa", "Upgrades de hardware", "Manutenção preventiva"],
    },
    {
      icon: Code,
      title: "Desenvolvimento",
      subtitle: "Software Sob Medida",
      description:
        "Criamos aplicativos web, automações e sistemas internos personalizados para otimizar seus processos de negócio.",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Aplicações web", "Sistemas internos", "Automações"],
    },
    {
      icon: Users,
      title: "Consultoria",
      subtitle: "Tecnologia Estratégica",
      description:
        "Análise completa de infraestrutura, recomendações de segurança e otimização de processos tecnológicos.",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Análise de infraestrutura", "Segurança digital", "Otimização de TI"],
    },
    {
      icon: Plus,
      title: "Serviços Extras",
      subtitle: "Suporte Completo",
      description: "Treinamentos especializados, suporte remoto, implantação de servidores e soluções personalizadas.",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Treinamentos", "Suporte remoto", "Servidores"],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  return (
    <section id="servicos" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-brand-primary-dark mb-4">
            Nossos Serviços
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-brand-primary-light max-w-2xl mx-auto">
            Soluções completas em tecnologia para impulsionar seu negócio
          </p>
        </FadeIn>

        {/* Responsive Grid: 1x4 (mobile) -> 2x2 (tablet) -> 4x1 (desktop) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants} className="group">
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-support/50 h-full flex flex-col"
                whileHover={{
                  y: -4,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.2 },
                }}
              >
                {/* Image Section */}
                <div className="relative h-48 lg:h-52 overflow-hidden">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="w-full h-full">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    />
                  </motion.div>

                  {/* Icon Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                      <service.icon className="w-5 h-5 text-brand-primary-dark" strokeWidth={2} />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg lg:text-xl font-semibold text-brand-primary-dark font-montserrat mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-brand-accent font-medium">{service.subtitle}</p>
                  </div>

                  <p className="text-sm lg:text-base text-black-soft leading-relaxed mb-4 flex-1">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="mb-6">
                    <ul className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="text-xs lg:text-sm text-brand-primary-light flex items-center"
                        >
                          <div className="w-1 h-1 bg-brand-accent rounded-full mr-2 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-auto">
                    <Button
                      size="sm"
                      className="w-full bg-brand-accent hover:bg-brand-primary-dark text-white font-medium transition-colors duration-200 focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2"
                    >
                      Saiba Mais
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-brand-primary-light mb-6 max-w-2xl mx-auto">
            Precisa de uma solução personalizada? Nossa equipe está pronta para desenvolver a tecnologia ideal para seu
            negócio.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="bg-brand-primary-dark hover:bg-brand-accent text-white font-semibold px-8 py-3 rounded-lg shadow-sm transition-colors duration-200"
              onClick={() => {
                const element = document.querySelector("#contato")
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Solicitar Orçamento Personalizado
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
