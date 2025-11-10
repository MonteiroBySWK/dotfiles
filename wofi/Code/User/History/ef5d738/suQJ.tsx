import { Target, TrendingUp } from "lucide-react"
import FadeIn from "@/components/animations/fade-in"

export default function MissionVisionSection() {
  return (
    <section id="missao-visao" className="py-16 sm:py-20 lg:py-24 bg-background backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Visão */}
          <FadeIn direction="left" delay={0.2}>
            <div className="rounded-xl p-6 sm:p-8 hover:shadow-md transition-shadow duration-300 h-full">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-brand-accent/10 rounded-lg">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-brand-accent" strokeWidth={2} />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-brand-accent">Visão</h2>
              </div>

              <p className="text-base sm:text-lg lg:text-xl text-black-soft leading-relaxed">
                Ser referência regional no mercado de tecnologia, reconhecida pela excelência e inovação nos serviços de
                hardware e software, formando profissionais altamente qualificados e contribuindo para o desenvolvimento
                tecnológico da comunidade local.
              </p>
            </div>
          </FadeIn>

          {/* Missão */}
          <FadeIn direction="right" delay={0.4}>
            <div className="rounded-xl p-6 sm:p-8 hover:shadow-md transition-shadow duration-300 h-full">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-brand-accent/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-brand-accent" strokeWidth={2} />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-brand-accent">Missão</h2>
              </div>

              <p className="text-base sm:text-lg lg:text-xl text-black-soft leading-relaxed">
                Oferecer soluções tecnológicas em hardware e software, proporcionando serviços de montagem e manutenção
                de computadores, além do desenvolvimento de programas e sistemas computacionais.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
