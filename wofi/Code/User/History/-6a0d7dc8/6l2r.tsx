import { Kanban, Network } from "lucide-react";
import { DiScrum } from "react-icons/di";
import type { DataSkillType } from "./types/skillsTypes";
import JavaIcon from "./assets/logos/langs/JavaIcon";
import JavaScriptIcon from "./assets/logos/langs/JavaScriptIcon";
import CppIcon from "./assets/logos/langs/CppIcon";
import PythonIcon from "./assets/logos/langs/PythonIcon";
import RustIcon from "./assets/logos/langs/RustIcon";
import LuaIcon from "./assets/logos/langs/LuaIcon";
import ElixirIcon from "./assets/logos/langs/ElixirIcon";

const SIZE_ICONS = 50;

export const dataSkills: DataSkillType = {
  Languages: [
    { name: "Java", icon: <JavaIcon /> },
    { name: "JavaScript", icon: <JavaScriptIcon /> },
    { name: "C/C++", icon: <CppIcon /> },
    { name: "Python", icon: <PythonIcon /> },
    { name: "Rust", icon: <RustIcon /> },
    { name: "Lua", icon: <LuaIcon /> },
    {name: "Elixir", icon: <ElixirIcon />}
  ],
  Backend: [
    { name: "Spring", icon: <SpringOriginal size={SIZE_ICONS} /> },
    { name: "Django", icon: <DjangoPlain size={SIZE_ICONS} /> },
    { name: "Flask", icon: <FlaskOriginal size={SIZE_ICONS} /> },
    { name: "NodeJS", icon: <NodejsOriginal size={SIZE_ICONS} /> },
    { name: "PostgreSQL", icon: <PostgresqlOriginal size={SIZE_ICONS} /> },
    { name: "MySQL", icon: <MysqlOriginal size={SIZE_ICONS} /> },
    { name: "MongoDB", icon: <MongodbOriginal size={SIZE_ICONS} /> },
    { name: "Spring JPA", icon: <JavaPlain size={SIZE_ICONS} /> },
    { name: "PeeWee", icon: <PythonOriginal size={SIZE_ICONS} /> },
    { name: "SQLAlchemy", icon: <SqlalchemyOriginal size={SIZE_ICONS} /> },
  ],
  DevOps: [
    { name: "Docker", icon: <DockerOriginal size={SIZE_ICONS} /> },
    { name: "Kubernetes", icon: <KubernetesLine size={SIZE_ICONS} /> },
    { name: "Git", icon: <GitOriginal size={SIZE_ICONS} /> },
    { name: "GitHub", icon: <GithubOriginal size={SIZE_ICONS} /> },
    { name: "GitLab", icon: <GitlabOriginal size={SIZE_ICONS} /> },
    { name: "Bash Script", icon: <BashOriginal size={SIZE_ICONS} /> },
    { name: "Scrum", icon: <DiScrum size={SIZE_ICONS} /> },
    { name: "Kanban", icon: <Kanban size={SIZE_ICONS} /> },
    { name: "Redes", icon: <Network size={SIZE_ICONS} /> },
    { name: "Linux", icon: <LinuxOriginal size={SIZE_ICONS} /> },
  ],
  Frontend: [
    { name: "ReactJS", icon: <ReactOriginal size={SIZE_ICONS} /> },
    {
      name: "React Native/Expo",
      icon: <ReactnavigationOriginal size={SIZE_ICONS} />,
    },
    { name: "Next.js", icon: <NextjsOriginal size={SIZE_ICONS} /> },
    { name: "TailwindCSS", icon: <TailwindcssOriginal size={SIZE_ICONS} /> },
  ],
};
