import TitleSection from "../components/ui/TitleSection";
import logo from "../assets/logo.svg";
import { Download } from "lucide-react";
import TextWriting from "../components/animation/TextWriting";
import FadeIn from "../components/animation/FadeIn";

const DownloadButton = () => (
  <a
    href="/port.pdf"
    download="port.pdf"
    className="px-4 py-2 bg-primary transition-transform duration-300 hover:scale-110 flex items-center gap-2 w-fit mt-4"
  >
    <span>Currículo</span>
    <Download size={20} />
  </a>
);

const AboutMeText = () => (
  <div className="space-y-4">
    <p className="text-base leading-relaxed">
      <TextWriting
        text="Sou desenvolvedor com foco em back-end, infraestrutura e segurança
        de aplicações. Estudo Engenharia da Computação e atuo como
        coordenador técnico em um laboratório de desenvolvimento, onde
        lidero equipes, gerencio projetos e mantenho sistemas no ar com foco
        em performance e boas práticas."
        size="3"
      />
    </p>
    <p className="text-base leading-relaxed">
      Também sou fundador de uma startup de software sob demanda, desenvolvendo
      soluções para empresas, organizações públicas e projetos educacionais. Já
      entregamos sistemas completos com áreas administrativas, APIs,
      autenticação segura, controle financeiro e dashboards.
    </p>
    <p className="text-base leading-relaxed">
      Sou movido por desafios e aprendizado constante — de microsserviços a
      ciência de dados, passando por computação gráfica, emulação e automação.
      Gosto de transformar ideias em soluções que funcionam na prática.
    </p>
    <DownloadButton />
  </div>
);

export default function AboutMe() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col justify-center items-center text-white max-w-7xl mx-auto px-4"
    >
      <TitleSection>Sobre Mim</TitleSection>

      <div className="flex flex-col md:flex-row items-start justify-center gap-8 mt-8 w-full">
        {/* Texto */}
        <article className="order-2 md:order-1 w-full md:w-7/10 mx-auto">
          <AboutMeText />
        </article>

        {/* Logo */}
        <FadeIn>
          <figure className="order-1 md:order-2 w-3/4 md:w-1/4 bg-primary/10 flex items-center justify-center mx-auto p-6 rounded-lg">
            <img src={logo} alt="Logo" className="w-3/4 h-3/4 object-contain" />
          </figure>
        </FadeIn>
      </div>
    </section>
  );
}
