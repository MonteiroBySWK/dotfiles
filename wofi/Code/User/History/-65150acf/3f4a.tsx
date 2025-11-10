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
    name: "João Silva",
    email: "joao.silva@empresa.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Thera Sistemas",
      logo: Building2,
      plan: "Enterprise",
    },
    {
      name: "Desenvolvimento",
      logo: GalleryVerticalEnd,
      plan: "Team",
    },
    {
      name: "Design",
      logo: AudioWaveform,
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Visão Geral",
          url: "dashboard/overview",
        },
        {
          title: "Projetos",
          url: "dashboard/projects",
        },
        {
          title: "Equipe",
          url: "dashboard/team",
        },
        {
          title: "Relatórios",
          url: "dashboard/reports",
        },
      ],
    },
    {
      title: "Equipe",
      url: "team",
      icon: Users,
      items: [
        {
          title: "Membros",
          url: "team/members",
        },
        {
          title: "Departamentos",
          url: "team/departments",
        },
        {
          title: "Cargos",
          url: "team/roles",
        },
        {
          title: "Permissões",
          url: "team/permissions",
        },
      ],
    },
    {
      title: "Projetos",
      url: "projects",
      icon: FolderKanban,
      items: [
        {
          title: "Kanban",
          url: "projects/kanban",
        },
        {
          title: "Gantt",
          url: "projects/gantt",
        },
        {
          title: "Backlog",
          url: "projects/backlog",
        },
        {
          title: "Requisitos",
          url: "projects/requirements",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "reports",
      icon: BarChart3,
      items: [
        {
          title: "Performance",
          url: "reports/performance",
        },
        {
          title: "Produtividade",
          url: "reports/productivity",
        },
        {
          title: "Custos",
          url: "reports/costs",
        },
        {
          title: "Qualidade",
          url: "reports/quality",
        },
      ],
    },
    {
      title: "Configurações",
      url: "settings",
      icon: Settings,
      items: [
        {
          title: "Perfil",
          url: "settings/profile",
        },
        {
          title: "Notificações",
          url: "settings/notifications",
        },
        {
          title: "Segurança",
          url: "settings/security",
        },
        {
          title: "Sistema",
          url: "settings/system",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Sistema CRM",
      url: "projects/crm",
      icon: Users,
    },
    {
      name: "App Mobile",
      url: "projects/mobile",
      icon: FolderKanban,
    },
    {
      name: "Dashboard Analytics",
      url: "projects/analytics",
      icon: BarChart3,
    },
    {
      name: "API Gateway",
      url: "projects/gateway",
      icon: GitBranch,
    },
  ],
};

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
