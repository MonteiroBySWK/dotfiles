import technoserp from "../assets/projetcs/technos.png";

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
      "Emulador de NES feito em Rust com implementação completa do chip 6502",
    technologies: ["Rust", "WASM", "HTML", "CSS", "JavaScript"],
    url: "https://github.com/MonteiroBySWK/web-nes-emulator",
    status: "IN_PROGRESS",
  },
  {
    name: "Mandelbrot Fractal Renderer",
    description:
      "Renderizador de Fractais de Mandelbrot na web via compilação para WebAssembly para trabalho do curso de Computação Gráfica",
    technologies: ["Rust", "Rayol", "WASM", "HTML", "CSS", "JavaScript"],
    url: "https://github.com/MonteiroBySWK/mandelbrot-fractal-renderer",
    status: "MODELING",
  },
  {
    name: "TheraNews",
    description:
      "Aplicativo de Noticias feito em React Native que consome a API do New York Times",
    technologies: ["React Native", "Nativewind/TailwindCSS", "Axios"],
    url: "https://github.com/MonteiroBySWK/TheraNews",
    status: "FINISHED",
  },
  {
    name: "Sistema ERP - TechnosJr",
    description:
      "Sistema de ERP para a Empresa Júnior de Engenharia de Computação da Uema em uma Trabalho de Iniciação Cientifica como Voluntário com deploy em servidores internos",
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
  },
  {
    name: "Repositório Digital PPP",
    description:
      "Repositorio de Links voltado para a construção de Projetos Politicos Pedagogicos para um trabalho de mestrado de pedagogia.",
    technologies: ["NextJS", "React", "TailwindCSS", "Firebase"],
    url: "https://www.repositoriodigitalppp.com.br",
    status: "FINISHED",
  },
];
