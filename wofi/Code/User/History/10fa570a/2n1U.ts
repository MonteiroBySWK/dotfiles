export type dataProject = {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  status: "FINISHED" | "IN_PROGRESS" | "MODELING";
};

export const dataProjectArr: dataProject[] = [
  {
    name: "Web Emulator NES",
    description: "Emulador de NES feito em Rust",
    technologies: ["Rust", "WASM", "HTML", "CSS", "JavaScript"],
    url: "https://github.com/MonteiroBySWK/web-nes-emulator",
    status: "IN_PROGRESS",
  },
  {
    name: "Mandelbrot Fractal Renderer",
    description: "É alguma coisa aí",
    technologies: ["Rust", "WASM", "HTML", "CSS", "JavaScript"],
    url: "https://github.com/MonteiroBySWK/mandelbrot-fractal-renderer",
    status: "MODELING",
  },
  {
    name: "TheraNews",
    description: "Aplicativo de Noticias feito em React Native",
    technologies: ["React Native", "Nativewind/TailwindCSS", "Axios"],
    url: "https://github.com/MonteiroBySWK/TheraNews",
    status: "FINISHED",
  },
  {
    name: "Sistema ERP",
    description:
      "Sistema de ERP para a Empresa Júnior de Engenharia de Computação da Uema em uma Trabalho de Iniciação Cientifica como Voluntário",
    technologies: ["Django", "DRF", "HTML", "CSS", "JavaScript"],
    url: "https://github.com/MonteiroBySWK/TheraNews",
    status: "FINISHED",
  },
];
