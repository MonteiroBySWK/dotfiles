import { Trophy, Lightbulb, MessageCircle, BarChart3 } from "lucide-react"
import FadeIn from "@/components/animations/fade-in"
import StaggerContainer from "@/components/animations/stagger-container"
import StaggerItem from "@/components/animations/stagger-item"

export default function ValuesSection() {
  const values = [
    {
      icon: Trophy,
      title: "Excelência na Área de Atuação",
      description: "Buscamos sempre a melhor performance em cada projeto, seguindo padrões de qualidade técnica.",
    },
    {
      icon: Lightbulb,
      title: "Inovação para o Mercado",
      description: "Estamos sempre atentos às tendências tecnológicas e implementamos soluções criativas.",
    },
    {
      icon: MessageCircle,
      title: "Colaboração Comunicativa",
      description: "Valorizamos a troca de conhecimento e a comunicação clara entre equipe e cliente.",
    },
    {
      icon: BarChart3,
      title: "Desenvolvimento Profissional",
      description: "Investimos no crescimento técnico e pessoal de cada membro da Technos.",
    },
  ]

  return (
    <section id="valores" className="py-16 sm:py-20 lg:py-24 bg-neutral-support">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12 sm:mb-16" duration={0.6}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-brand-primary-dark mb-4">
            Nossos Valores & Premissas
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-brand-primary-light max-w-2xl mx-auto">
            Os princípios que nos guiam no dia a dia.
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto"
          staggerDelay={0.1}
        >
          {values.map((value, index) => (
            <StaggerItem key={index}>
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-support/50 shadow-sm hover:shadow-md hover:border-brand-accent/30 transition-all duration-300 group h-full">
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="flex justify-center">
                    <div className="p-3 sm:p-4 bg-brand-accent/10 rounded-full group-hover:bg-brand-accent/15 transition-colors duration-300">
                      <value.icon
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-brand-accent transition-colors duration-300"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-brand-primary-dark font-montserrat">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-black-soft leading-relaxed">{value.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
