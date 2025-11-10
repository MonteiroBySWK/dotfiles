import FadeIn from "@/components/animations/fade-in"

export default function AboutSection() {
  return (
    <section id="sobre" className="py-16 sm:py-20 lg:py-24 bg-neutral-support">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Image Column */}
          <FadeIn direction="left" delay={0.2} className="order-2 lg:order-1">
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Estudantes trabalhando com hardware no laboratório"
                  className="object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
                <div className="absolute inset-0 bg-neutral-support/20 hover:bg-transparent transition-all duration-500"></div>
              </div>
            </div>
          </FadeIn>

          {/* Content Column */}
          <FadeIn direction="right" delay={0.4} className="order-1 lg:order-2">
            <div className="space-y-6 lg:pl-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-brand-primary-dark">Quem Somos</h2>

              <div className="space-y-4">
                <p className="text-base sm:text-lg lg:text-xl text-black-soft leading-relaxed">
                  A Technos é a Empresa Júnior de Engenharia da Computação da UEMA (Campus Paulo VI). Somos uma
                  associação sem fins lucrativos, formada e gerida por alunos entusiasmados, que desenvolvem soluções de
                  hardware e software para clientes da comunidade local.
                </p>

                <p className="text-base sm:text-lg lg:text-xl text-black-soft leading-relaxed">
                  Nossa proposta é proporcionar experiência prática aos membros enquanto entregamos serviços de
                  excelência em montagem, manutenção e desenvolvimento de sistemas.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
