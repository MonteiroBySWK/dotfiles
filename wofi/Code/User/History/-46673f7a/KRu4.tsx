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
    <div className="bg-card/50 border border-border border-dashed p-2 text-white max-w-md space-y-2">
      <div className="w-full overflow-hidden relative bg-[url('../assets/image_project.webp')]">
        <img
          src={image_project}
          alt="project-image"
          className="object-cover w-full h-50"
        />

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
        {data.technologies.map((e, i) => (
          <span key={i} className="px-3 py-0.5 bg-card">
            {e}
          </span>
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
    <section
      id="projects"
      className="h-screen flex flex-col justify-center items-center px-2 max-w-7xl mx-auto"
    >
      <TitleSection>Projetos</TitleSection>
      <div className="grid grid-cols-3 gap-10">
        {dataProjectArr.map((e, i) => (
          <ProjectItem data={e} key={i} />
        ))}
      </div>
    </section>
  );
}
