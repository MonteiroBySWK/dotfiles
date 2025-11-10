"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import FadeIn from "@/components/animations/fade-in"
import StaggerContainer from "@/components/animations/stagger-container"
import StaggerItem from "@/components/animations/stagger-item"

export default function DifferentialsSection() {
  const differentials = [
    "Equipe 100% formada por alunos de Engenharia da Computação.",
    "Metodologia ágil e documentação transparente de cada projeto.",
    "Rigor técnico: seguimos boas práticas de desenvolvimento e manutenção.",
    "Preços competitivos e foco em resultado para o cliente.",
  ]

  const cases = [
    {
      title: "Upgrade de Estação Laboratorial da UEMA",
      description: "Instalamos 15 PCs com SSD e nova placa-mãe, melhorando performance em 60%.",
      result: "Redução de 60% no tempo de inicialização",
    },
    {
      title: "Sistema de Gerência de Estoque para ONG",
      description: "Desenvolvemos aplicação web em Django + PostgreSQL, otimizando relatórios em tempo real.",
      result: "Otimização de relatórios em tempo real",
    },
  ]

  return (
    <section id="cases" className="py-16 sm:py-20 lg:py-24 bg-neutral-support">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Diferenciais */}
          <FadeIn direction="left" delay={0.2}>
            <div className="space-y-6 lg:space-y-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-brand-primary-dark font-montserrat">
                Por que escolher a Technos?
              </h2>

              <StaggerContainer className="space-y-4 sm:space-y-6" staggerDelay={0.1}>
                {differentials.map((differential, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="flex items-start space-x-3 sm:space-x-4"
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex-shrink-0 mt-1"
                      >
                        <div className="p-1 bg-brand-accent/10 rounded-full">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-brand-accent" strokeWidth={2} />
                        </div>
                      </motion.div>
                      <p className="text-sm sm:text-base lg:text-lg text-black-soft leading-relaxed">{differential}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>

          {/* Cases Breves */}
          <FadeIn direction="right" delay={0.4}>
            <div className="space-y-6 lg:space-y-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-brand-primary-dark font-montserrat">
                Cases Breves
              </h2>

              <StaggerContainer className="space-y-4 sm:space-y-6" staggerDelay={0.2}>
                {cases.map((caseItem, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-neutral-support/50"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-brand-primary-dark mb-3 font-montserrat">
                        {caseItem.title}
                      </h3>
                      <p className="text-sm sm:text-base text-black-soft mb-4 leading-relaxed">
                        {caseItem.description}
                      </p>
                      <motion.p
                        className="text-sm sm:text-base text-brand-primary-light font-semibold"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                      >
                        ✓ {caseItem.result}
                      </motion.p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
