import TitleSection from "../components/ui/TitleSection";
import { Download } from "lucide-react";
import TextWriting from "../components/animation/TextWriting";
import FadeIn from "../components/animation/FadeIn";
import AnimatedSVG2 from "../components/animation/AnimatedSVG2";
import MyHistory from "./MyHistory";

export default function AboutMe() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col justify-center items-center text-white max-w-7xl mx-auto static"
    >
      <TitleSection>Sobre Mim</TitleSection>
      <div className="flex flex-col-reverse md:flex-row max-w-7xl md:items-start items-center justify-center mb-16 px-4">
        <div className="mx-auto text-white md:w-7/10">
          <FadeIn>
            <p className="text-sm sm:text-base leading-relaxed mb-4">
              Sou desenvolvedor com foco em back-end, infraestrutura e segurança
              de aplicações. Estudo Engenharia da Computação e atuo como
              coordenador técnico em um laboratório de desenvolvimento, onde
              lidero equipes, gerencio projetos e mantenho sistemas no ar com
              foco em performance e boas práticas.
            </p>
          </FadeIn>

          <FadeIn>
            <p className="text-sm sm:text-base leading-relaxed mb-4">
              Também sou fundador de uma startup de software sob demanda,
              desenvolvendo soluções para empresas, organizações públicas e
              projetos educacionais. Já entregamos sistemas completos com áreas
              administrativas, APIs, autenticação segura, controle financeiro e
              dashboards.
            </p>
          </FadeIn>

          <FadeIn>
<p className="text-sm sm:text-base leading-relaxed mb-4">
            Sou movido por desafios e aprendizado constante — de microsserviços
            a ciência de dados, passando por computação gráfica, emulação e
            automação. Gosto de transformar ideias em soluções que funcionam na
            prática.
          </p>
          </FadeIn>

          
          <a
            href="/port.pdf"
            download="port.pdf"
            className="px-4 py-2 bg-primary transition-all duration-300 hover:scale-110 flex gap-5 items-center justify-center w-fit mt-6"
          >
            <span>Curriculo</span> <Download size={20} />
          </a>
        </div>

        <FadeIn>
          <div className="size-60 sm:size-72 md:size-76 bg-primary/10 flex items-center justify-center mx-auto mb-8 md:mb-0">
            <AnimatedSVG2 className="size-48 sm:size-60 md:size-65" />
          </div>
        </FadeIn>
      </div>

      <MyHistory />
    </section>
  );
}
