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
      url: "#",
      icon: BarChart3,
      isActive: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: () => (window as any).navigateToPage?.('dashboard'),
      items: [
        {
          title: "Visão Geral",
          url: "#",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick: () => (window as any).navigateToPage?.('dashboard/overview'),
        },
        {
          title: "Projetos",
          url: "#", 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick: () => (window as any).navigateToPage?.('dashboard/projects'),
        },
        {
          title: "Equipe",
          url: "#",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick: () => (window as any).navigateToPage?.('projects/kanban'),
        },
        {
          title: "Gantt",
          url: "#",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick: () => (window as any).navigateToPage?.('projects/gantt'),
        },
        {
          title: "Backlog",
          url: "#",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick: () => (window as any).navigateToPage?.('projects/backlog'),
        },
        {
          title: "Requisitos",
          url: "#",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick: () => (window as any).navigateToPage?.('settings/profile'),
        },
        {
          title: "Notificações",
          url: "#",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick: () => (window as any).navigateToPage?.('settings/notifications'),
        },
        {
          title: "Segurança",
          url: "#",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick: () => (window as any).navigateToPage?.('settings/security'),
        },
        {
          title: "Sistema",
          url: "#",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
