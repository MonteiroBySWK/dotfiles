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