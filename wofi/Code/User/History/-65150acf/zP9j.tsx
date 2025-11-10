"use client";

import * as React from "react";
import Link from "next/link";
import {
  Home,
  Users,
  FolderKanban,
  Calendar,
  BarChart3,
  CheckSquare,
  GitBranch,
  Settings,
  Settings2,
  Building2,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  Frame,
  PieChart,
  Map,
  TrendingUp,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Dados do dashboard
const data = {
  user: {
    name: "Admin User",
    email: "admin@empresa.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Minha Empresa",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Projeto Alpha",
      logo: AudioWaveform,
      plan: "Projeto",
    },
    {
      name: "Startup Beta",
      logo: Command,
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Visão Geral",
          url: "/dashboard",
        },
        {
          title: "Projetos",
          url: "/dashboard", 
        },
        {
          title: "Equipe",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Equipe",
      url: "/team",
      icon: Users,
      items: [
        {
          title: "Membros",
          url: "/team",
        },
        {
          title: "Cargos",
          url: "#",
        },
        {
          title: "Avaliações",
          url: "#",
        },
      ],
    },
    {
      title: "Projetos",
      url: "#",
      icon: FolderKanban,
      items: [
        {
          title: "Kanban",
          url: "/projects/kanban",
        },
        {
          title: "Gantt",
          url: "/projects/gantt",
        },
        {
          title: "Backlog",
          url: "/projects/backlog",
        },
        {
          title: "Requisitos",
          url: "/projects/requirements",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "#",
      icon: TrendingUp,
      items: [
        {
          title: "Performance",
          url: "#",
        },
        {
          title: "Produtividade",
          url: "#",
        },
        {
          title: "Financeiro",
          url: "#",
        },
      ],
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Perfil",
          url: "/settings",
        },
        {
          title: "Notificações",
          url: "/settings",
        },
        {
          title: "Segurança",
          url: "/settings",
        },
        {
          title: "Sistema",
          url: "/settings",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Website Redesign",
      url: "#",
      icon: Frame,
    },
    {
      name: "Mobile App",
      url: "#",
      icon: PieChart,
    },
    {
      name: "E-commerce Platform",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
