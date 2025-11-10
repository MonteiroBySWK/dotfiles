import BashOriginal from "devicons-react/lib/icons/BashOriginal";
import CplusplusPlain from "devicons-react/lib/icons/CplusplusPlain";
import DjangoPlain from "devicons-react/lib/icons/DjangoPlain";
import DockerOriginal from "devicons-react/lib/icons/DockerOriginal";
import FlaskOriginal from "devicons-react/lib/icons/FlaskOriginal";
import GsapOriginal from "devicons-react/lib/icons/GsapOriginal";
import GithubOriginal from "devicons-react/lib/icons/GithubOriginal";
import GitlabOriginal from "devicons-react/lib/icons/GitlabOriginal";
import GitOriginal from "devicons-react/lib/icons/GitOriginal";
import JavaOriginal from "devicons-react/lib/icons/JavaOriginal";
import JavaPlain from "devicons-react/lib/icons/JavaPlain";
import JavascriptOriginal from "devicons-react/lib/icons/JavascriptOriginal";
import KubernetesLine from "devicons-react/lib/icons/KubernetesLine";
import LinuxOriginal from "devicons-react/lib/icons/LinuxOriginal";
import LuaOriginal from "devicons-react/lib/icons/LuaOriginal";
import MongodbOriginal from "devicons-react/lib/icons/MongodbOriginal";
import MysqlOriginal from "devicons-react/lib/icons/MysqlOriginal";
import NextjsOriginal from "devicons-react/lib/icons/NextjsOriginal";
import NodejsOriginal from "devicons-react/lib/icons/NodejsOriginal";
import PostgresqlOriginal from "devicons-react/lib/icons/PostgresqlOriginal";
import PythonOriginal from "devicons-react/lib/icons/PythonOriginal";
import ReactnavigationOriginal from "devicons-react/lib/icons/ReactnavigationOriginal";
import ReactOriginal from "devicons-react/lib/icons/ReactOriginal";
import RustOriginal from "devicons-react/lib/icons/RustOriginal";
import SpringOriginal from "devicons-react/lib/icons/SpringOriginal";
import SqlalchemyOriginal from "devicons-react/lib/icons/SqlalchemyOriginal";
import TailwindcssOriginal from "devicons-react/lib/icons/TailwindcssOriginal";
import { Kanban, Network } from "lucide-react";
import { DiScrum } from "react-icons/di";
import type { DataSkillType } from "./types/skillsTypes";

const SIZE_ICONS = 50;

export const dataSkills: DataSkillType = {
  Languages: [
    { name: "Java", icon: <JavaOriginal size={SIZE_ICONS} /> },
    { name: "JavaScript", icon: <JavascriptOriginal size={SIZE_ICONS} /> },
    { name: "C/C++", icon: <CplusplusPlain size={SIZE_ICONS} /> },
    { name: "Python", icon: <PythonOriginal size={SIZE_ICONS} /> },
    { name: "Rust", icon: <RustOriginal size={SIZE_ICONS} /> },
    { name: "Lua", icon: <LuaOriginal size={SIZE_ICONS} /> },
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
    {
      name: "Framer Motion/GSAP",
      icon: <GsapOriginal size={SIZE_ICONS} />,
    },
  ],
};