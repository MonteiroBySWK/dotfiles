import technoserp from "../assets/projetcs/technos.webp";
import fractal from "../assets/projetcs/fractal.webp";
import repoppp from "../assets/projetcs/repositorioppp.webp";
import webnes from "../assets/projetcs/webnes.webp";
import theranews from "../assets/projetcs/theranews.webp";

export type dataProject = {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  status: "FINISHED" | "IN_PROGRESS" | "MODELING";
  image: string;
};

export const dataProjectArr: dataProject[] = [
  {
    name: "Web Emulator NES",
    description:
      "Emulador do console NES desenvolvido em Rust, com implementação do processador 6502 e suporte via WebAssembly.",
    technologies: ["Rust", "WASM", "HTML", "CSS", "JavaScript"],
   // url: "https://github.com/MonteiroBySWK/web-nes-emulator",
    status: "IN_PROGRESS",
    image: webnes,
  },
  {
    name: "Mandelbrot Fractal Renderer",
    description:
      "Renderizador interativo do Conjunto de Mandelbrot, compilado para WebAssembly como projeto acadêmico em Computação Gráfica.",
    technologies: ["Rust", "Rayol", "WASM", "HTML", "CSS", "JavaScript"],
    url: "https://github.com/MonteiroBySWK/mandelbrot-fractal-renderer",
    status: "MODELING",
    image: fractal,
  },
  {
    name: "TheraNews",
    description:
      "Aplicativo de notícias em React Native, integrado à API do New York Times, com interface responsiva e navegação otimizada.",
    technologies: ["React Native", "Expo", "Nativewind/TailwindCSS", "Axios"],
    url: "https://github.com/MonteiroBySWK/TheraNews",
    status: "FINISHED",
    image: theranews,
  },
  {
    name: "ERP - TechnosJr",
    description:
      "Sistema ERP desenvolvido para a empresa júnior de Engenharia de Computação da UEMA, implementado como projeto de Iniciação Científica e implantado em servidores internos.",
    technologies: [
      "Python",
      "Django",
      "DRF",
      "PostgreSQL",
      "Docker",
      "NGINX",
      "HTML",
      "CSS",
      "JavaScript",
    ],
    url: "null",
    status: "FINISHED",
    image: technoserp,
  },
  {
    name: "Repositório Digital PPP",
    description:
      "Plataforma web para organização de links e recursos voltados à construção de Projetos Político-Pedagógicos, desenvolvida em parceria com pesquisa de mestrado em Educação.",
    technologies: ["NextJS", "React", "TailwindCSS", "Firebase"],
    url: "https://www.repositoriodigitalppp.com.br",
    status: "FINISHED",
    image: repoppp,
  },
];
