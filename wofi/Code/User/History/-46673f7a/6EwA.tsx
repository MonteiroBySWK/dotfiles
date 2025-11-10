import { Link2Icon } from "lucide-react";
import TitleSection from "../components/TitleSection";
import image_project from "../assets/image_project.png";

type dataProject = {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  status: "FINISHED" | "IN_PROGRESS" | "MODELING";
};

const checkColorStatus = (status: "FINISHED" | "IN_PROGRESS" | "MODELING") => {
  if (status == "FINISHED") {
    return "text-green-500 bg-green-100 border-green-500";
  }

  if (status == "IN_PROGRESS") {
    return "text-blue-500 bg-blue-100 border-blue-500";
  }

  if (status == "MODELING") {
    return "text-purple-500 bg-purple-100 border-purple-500";
  }
};

const dataProjectArr: dataProject[] = [
  {
    name: "Web Emulator NES",
    description: "Emulador de NES feito em Rust",
    technologies: ["Rust", "WASM", "HTML", "CSS", "JS"],
    url: "https://monteirobyswk.vercel.app/web-nes-emulator",
    status: "IN_PROGRESS",
  },
  {
    name: "Mandelbrot Fractal Renderer",
    description: "É alguma coisa aí",
    technologies: ["Rust", "WASM"],
    url: "https://monteirobyswk.vercel.app/mandelbrot-fractal-renderer",
    status: "MODELING",
  },
  {
    name: "TheraNews",
    description: "Aplicativo de Noticias feito em React Native",
    technologies: ["React Native", "Nativewind/TailwindCSS", "Axios"],
    url: "https://github.com/MonteiroBySWK/TheraNews",
    status: "MODELING",
  },
];

const ProjectItem = ({ data }: { data: dataProject }) => {
  return (
    <div className="bg-card/50 border border-border border-dashed p-2 text-white max-w-md space-y-4">
      <div className="w-full h-1/2 overflow-hidden relative">
        <img src={image_project} className="object-cover" />{" "}
        {/* Dá pra aqui ser uma carrossel */}
        <span
          className={`px-2 py-0.5 absolute top-0 right-0 ${checkColorStatus(
            data.status
          )}`}
        >
          {data.status}
        </span>
      </div>

      <div className="font-semibold text-primary text-xl">{data.name}</div>

      <div>{data.description}</div>

      <div className="flex gap-2 flex-wrap">
        {data.technologies.map((e) => (
          <span className="px-3 py-0.5 bg-card">{e}</span>
        ))}
      </div>
      <div className="relative">
        <a
          href={data.url}
          className="flex w-full justify-center items-center gap-x-1 bg-primary py-0.5 px-3 transition-all duration-200 hover:scale-105"
        >
          <span>Acessar</span>
          <Link2Icon size={18} />
        </a>
      </div>
    </div>
  );
};

export default function Projects() {
  return (
    <div
      id="projects"
      className="h-screen flex flex-col justify-center items-center px-2"
    >
      <TitleSection>Projetos</TitleSection>
      <div className="grid grid-cols-3 gap-2">
        {dataProjectArr.map((e) => (
          <ProjectItem data={e} />
        ))}
      </div>
    </div>
  );
}
