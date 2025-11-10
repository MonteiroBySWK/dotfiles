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
    description:
      "Projeto em desenvolvimento focado na implementação de uma CPU 6502 do zero, utilizando Rust para alta performance e WebAssembly para execução no navegador. O objetivo é recriar o funcionamento interno do processador, instrução por instrução, possibilitando a execução de programas clássicos diretamente na web, explorando conceitos de arquitetura de computadores, baixo nível e otimização.",
    technologies: ["Rust", "WASM", "HTML", "CSS", "JS"],
    url: "https://github.com/MonteiroBySWK/nes-web-emulator",
    status: "IN_PROGRESS",
  },
  {
    name: "Mandelbrot Fractal Renderer",
    description: "",
    technologies: ["Rust", "WASM"],
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
];
