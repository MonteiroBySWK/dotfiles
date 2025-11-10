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
      "Desenvolvimento de um emulador da icônica CPU MOS 6502, criado inteiramente em Rust e compilado para WebAssembly para rodar diretamente no navegador, com alto desempenho e compatibilidade multiplataforma. O projeto combina engenharia de baixo nível com tecnologias modernas da web, explorando conceitos de arquitetura de processadores, instruções assembly e otimização de execução. Essa base abre caminho para futuras integrações, como a emulação de consoles clássicos (NES, Commodore 64) e execução de ROMs históricas online.",
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
