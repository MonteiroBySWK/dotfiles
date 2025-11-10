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
      url: "/dashboard/team",
      icon: Users,
      items: [
        {
          title: "Membros",
          url: "/dashboard/team",
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
          url: "/dashboard/projects/kanban",
        },
        {
          title: "Gantt",
          url: "/dashboard/projects/gantt",
        },
        {
          title: "Backlog",
          url: "/dashboard/projects/backlog",
        },
        {
          title: "Requisitos",
          url: "/dashboard/projects/requirements",
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
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Perfil",
          url: "/dashboard/settings",
        },
        {
          title: "Notificações",
          url: "/dashboard/settings",
        },
        {
          title: "Segurança",
          url: "/dashboard/settings",
        },
        {
          title: "Sistema",
          url: "/dashboard/settings",
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
