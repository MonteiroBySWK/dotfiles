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
import TypeScriptIcon from "./assets/logos/langs/TypeScriptIcon";
import SpringIcon from "./assets/logos/backend/SpringIcon";
import DjangoIcon from "./assets/logos/backend/DjangoIcon";
import FlaskIcon from "./assets/logos/backend/FlaskIcon";
import NodeIcon from "./assets/logos/backend/NodeIcon";
import PostgreSQLIcon from "./assets/logos/backend/PostgreSQLIcon";
import MongoDBIcon from "./assets/logos/backend/MongoDBIcon";
import SQLAlchemyIcon from "./assets/logos/backend/SQLAlchemyIcon";
import QtIcon from "./assets/logos/backend/QtIcon";
import ExpressIcon from "./assets/logos/backend/ExpressIcon";
import FirebaseIcon from "./assets/logos/backend/FirebaseIcon";
import SupabaseIcon from "./assets/logos/backend/SupabaseIcon";
import PrismaIcon from "./assets/logos/backend/PrismaIcon";
import DockerIcon from "./assets/logos/devops/DockerIcon";
import KubernetesIcon from "./assets/logos/devops/KubernetesIcon";
import GitIcon from "./assets/logos/devops/GitIcon";
import GithubIcon from "./assets/logos/devops/GithubIcon";
import BashIcon from "./assets/logos/devops/BashIcon";
import ArchLinuxIcon from "./assets/logos/devops/ArchLinuxIcon";
import NginxIcon from "./assets/logos/devops/NginxIcon";
import ReactIcon from "./assets/logos/frontend/ReactIcon";
import ExpoIcon from "./assets/logos/frontend/ExpoIcon";
import NextJSIcon from "./assets/logos/frontend/NextJSIcon";
import TailwindCSSIcon from "./assets/logos/frontend/TailwindCSSIcon";
import WebAssemblyIcon from "./assets/logos/frontend/WebAssembly";
import HtmlIcon from "./assets/logos/frontend/HtmlIcon";
import CssIcon from "./assets/logos/frontend/CssIcon";

const SIZE_ICONS = 50;

export const dataSkills: DataSkillType = {
  Languages: [
    { name: "Java", icon: <JavaIcon /> },
    { name: "JavaScript", icon: <JavaScriptIcon /> },
    {name: "TypeScript", icon: <TypeScriptIcon />},
    { name: "C/C++", icon: <CppIcon /> },
    { name: "Python", icon: <PythonIcon /> },
    { name: "Rust", icon: <RustIcon /> },
    { name: "Lua", icon: <LuaIcon /> },
    {name: "Elixir", icon: <ElixirIcon />}
  ],
  Backend: [
    { name: "Spring", icon: <SpringIcon /> },
    { name: "Django", icon: <DjangoIcon /> },
    { name: "Flask", icon: <FlaskIcon /> },
    { name: "NodeJS", icon: <NodeIcon /> },
    {name: "ExpressJS", icon: <ExpressIcon />},
    { name: "PostgreSQL", icon: <PostgreSQLIcon /> },
    { name: "MongoDB", icon: <MongoDBIcon /> },
    {name: "PrismaORM", icon: <PrismaIcon />},
    {name: "Firebase", icon: <FirebaseIcon />},
    {name: "Supabase", icon: <SupabaseIcon />},
    { name: "SQLAlchemy", icon: <SQLAlchemyIcon /> },
    {name: "Qt", icon: <QtIcon />}
  ],
  DevOps: [
    { name: "Docker", icon: <DockerIcon /> },
    { name: "Kubernetes", icon: <KubernetesIcon /> },
    {name: "Nginx", icon: <NginxIcon />},
    { name: "Git", icon: <GitIcon/> },
    { name: "GitHub", icon: <GithubIcon /> },
    { name: "Bash Script", icon: <BashIcon /> },
    { name: "Scrum", icon: <DiScrum size={SIZE_ICONS} /> },
    { name: "Kanban", icon: <Kanban size={SIZE_ICONS} /> },
    { name: "Redes", icon: <Network size={SIZE_ICONS} /> },
    { name: "Arch Linux", icon: <ArchLinuxIcon /> },
  ],
  Frontend: [
    {name: "HTML", icon: <HtmlIcon />},
    {name: "CSS", icon: <CssIcon />},
    { name: "ReactJS", icon: <ReactIcon /> },
    {
      name: "React Native/Expo",
      icon: <ExpoIcon />,
    },
    { name: "Next.js", icon: <NextJSIcon /> },
    { name: "TailwindCSS", icon: <TailwindCSSIcon /> },
    {name: "WebAssembly", icon: <WebAssemblyIcon />}
  ],
};
