"use client";

import * as React from "react";
import {
  Home,
  Users,
  FolderKanban,
  Calendar,
  BarChart3,
  CheckSquare,
  GitBranch,
  Settings,
  Building2,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
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
      url: "#",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Visão Geral",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('dashboard/overview'),
        },
        {
          title: "Projetos",
          url: "#", 
          onClick: () => (window as any).navigateToPage?.('dashboard/projects'),
        },
        {
          title: "Equipe",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('dashboard/team'),
        },
      ],
    },
    {
      title: "Equipe",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Membros",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('team/members'),
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
          url: "#",
          onClick: () => (window as any).navigateToPage?.('projects/kanban'),
        },
        {
          title: "Gantt",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('projects/gantt'),
        },
        {
          title: "Backlog",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('projects/backlog'),
        },
        {
          title: "Requisitos",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('projects/requirements'),
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
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Perfil",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('settings/profile'),
        },
        {
          title: "Notificações",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('settings/notifications'),
        },
        {
          title: "Segurança",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('settings/security'),
        },
        {
          title: "Sistema",
          url: "#",
          onClick: () => (window as any).navigateToPage?.('settings/system'),
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
