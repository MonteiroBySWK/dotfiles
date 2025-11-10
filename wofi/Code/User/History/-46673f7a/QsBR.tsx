import { Link2Icon } from "lucide-react";
import TitleSection from "../components/ui/TitleSection";
import image_project from "../assets/image_project.webp";
import { type dataProject, dataProjectArr } from "../constants/ProjectData";

const checkColorStatus = (status: "FINISHED" | "IN_PROGRESS" | "MODELING") => {
  if (status === "FINISHED") {
    return "text-green-800 bg-green-200 border-green-700";
  }

  if (status === "IN_PROGRESS") {
    return "text-blue-800 bg-blue-200 border-blue-700";
  }

  if (status === "MODELING") {
    return "text-purple-800 bg-purple-200 border-purple-700";
  }
};

const ProjectItem = ({ data }: { data: dataProject }) => {
  return (
    <div className="bg-card/50 border border-border border-dashed p-2 text-white w-full max-w-sm mx-auto space-y-2 flex flex-col">
      <div className="w-full h-48 overflow-hidden relative">
        <img
          src={data.image}
          alt="project-image"
          className="object-cover w-full h-full"
        />
        {/* Dá pra aqui ser uma carrossel */}
        <span
          className={`px-2 py-0.5 absolute top-0 right-0 text-xs sm:text-sm ${checkColorStatus(
            data.status
          )}`}
        >
          {data.status}
        </span>
      </div>

      <div className="font-semibold text-primary text-lg sm:text-xl">{data.name}</div>

      <div className="text-sm sm:text-base flex-grow">{data.description}</div>

      <div className="flex gap-2 flex-wrap">
        {data.technologies.map((e, i) => (
          <span key={i} className="px-2 sm:px-3 py-0.5 bg-card text-xs sm:text-sm">
            {e}
          </span>
        ))}
      </div>
      <div className="relative mt-auto">
        <a
          href={data.url}
          className="flex w-full justify-center items-center gap-x-1 bg-primary py-1 px-3 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
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
    <section
      id="projects"
      className="min-h-screen flex flex-col justify-center items-center py-16"
    >
      <TitleSection>Projetos</TitleSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {dataProjectArr.map((e, i) => (
          <ProjectItem data={e} key={i} />
        ))}
      </div>
    </section>
  );
}
