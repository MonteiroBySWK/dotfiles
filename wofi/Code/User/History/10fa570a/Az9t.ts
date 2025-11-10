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
    description:
      "Aplicação interativa para geração e renderização de fractais, desenvolvida em Rust e compilada para WebAssembly, garantindo alto desempenho diretamente no navegador. O projeto explora algoritmos matemáticos avançados para criar padrões complexos como o conjunto de Mandelbrot, com suporte a zoom em tempo real e cores dinâmicas. Une performance de código nativo com a acessibilidade da web, proporcionando uma experiência visual rica e educativa sobre matemática e computação gráfica.",
    technologies: ["Rust", "WASM"],
    url: "https://github.com/MonteiroBySWK/mandelbrot-fractal-renderer",
    status: "MODELING",
  },
  {
    name: "Leitor de Notícias do New York Times",
    description:
      "Aplicativo mobile multiplataforma desenvolvido em React Native, integrado à API oficial do New York Times para exibir notícias em tempo real. A aplicação oferece navegação fluida, interface responsiva e categorização de conteúdos, permitindo ao usuário explorar manchetes, artigos completos e imagens diretamente no celular. O projeto destaca integração com APIs REST, manipulação de dados JSON e boas práticas de desenvolvimento mobile.",
    technologies: ["React Native", "Nativewind/TailwindCSS", "Axios"],
    url: "https://github.com/MonteiroBySWK/TheraNews",
    status: "FINISHED",
  },
];
