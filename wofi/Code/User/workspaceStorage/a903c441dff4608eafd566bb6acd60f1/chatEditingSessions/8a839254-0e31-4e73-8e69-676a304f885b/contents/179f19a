import TitleSection from "../components/ui/TitleSection";
import logo from "../assets/logo.svg";
import { Download } from "lucide-react";

export default function AboutMe() {
  return (
    <section
      id="about"
      className="h-screen flex flex-col justify-center items-center text-white max-w-7xl mx-auto"
    >
      <TitleSection>Sobre Mim</TitleSection>
      <div className="flex flex-col-reverse md:flex-row max-w-7xl items-start mb-16">
        <div className="mx-auto px-4 text-white md:w-7/10">
          <p className="text-base leading-relaxed mb-4">
            Sou desenvolvedor com foco em back-end, infraestrutura e segurança
            de aplicações. Estudo Engenharia da Computação e atuo como
            coordenador técnico em um laboratório de desenvolvimento, onde
            lidero equipes, gerencio projetos e mantenho sistemas no ar com foco
            em performance e boas práticas.
          </p>

          <p className="text-base leading-relaxed mb-4">
            Também sou fundador de uma startup de software sob demanda,
            desenvolvendo soluções para empresas, organizações públicas e
            projetos educacionais. Já entregamos sistemas completos com áreas
            administrativas, APIs, autenticação segura, controle financeiro e
            dashboards.
          </p>
          <p className="text-base leading-relaxed">
            Sou movido por desafios e aprendizado constante — de microsserviços
            a ciência de dados, passando por computação gráfica, emulação e
            automação. Gosto de transformar ideias em soluções que funcionam na
            prática.
          </p>
          <a href="/port.pdf" download="port.pdf" className="px-4 py-2 bg-primary transition-all duration-300 hover:scale-110 flex gap-5 items-center justify-center w-fit">
            <span>Curriculo</span> <Download size={20} />
          </a>
        </div>
        <div className="size-76 bg-primary/10 flex w-full items-center justify-center">
          <img src={logo} alt="logo" className="size-65" />
        </div>
      </div>
    </section>
  );
}
