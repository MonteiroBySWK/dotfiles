"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/provider/AuthProvider";

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
  Search,
  MessageSquare,
  DollarSign,
  Banknote,
  Receipt,
  CreditCard,
  FileText,
  PlusCircle,
  Activity,
  Clock,
  UserCheck,
  Target,
  Briefcase,
  HeadphonesIcon,
  Mail,
  Phone,
  Video,
  HelpCircle,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { NotificationBell } from "@/components/custom/notifications";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {data} from "@/constants/sidebarItems" 

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  // const { companies, loadCompanies } = useTeamStore();

  // TODO: Implementar carregamento de empresas via API ou hook
  const companies: Array<{ name: string; subscription: { plan: string } }> = [];

  // Load companies on mount
  // useEffect(() => {
  //   loadCompanies();
  // }, [loadCompanies]);

  // Dados padrão caso o usuário não esteja carregado
  const userData = user ? {
    name: user.displayName || "Usuário",
    email: user.email || "",
    avatar: user.photoURL || "/avatars/default.jpg",
  } : {
    name: "Admin User",
    email: "admin@empresa.com", 
    avatar: "/avatars/admin.jpg",
  };

  // Convert companies to teams format for TeamSwitcher
  const teamsData = companies.length > 0 ? companies.map(company => ({
    name: company.name,
    logo: GalleryVerticalEnd,
    plan: company.subscription.plan === 'free' ? 'Gratuito' : 
          company.subscription.plan === 'starter' ? 'Iniciante' :
          company.subscription.plan === 'professional' ? 'Profissional' : 'Enterprise'
  })) : data.teams;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* Header expandido - com TeamSwitcher e NotificationBell lado a lado */}
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between p-2">
            <TeamSwitcher teams={teamsData} />
          </div>
        </div>

        {/* Header minimizado - elementos empilhados verticalmente */}
        <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center space-y-2 py-2">
          <TeamSwitcher teams={teamsData} />
        </div>

        {/* Campo de busca - oculto quando sidebar está minimizado */}
        <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>

        {/* Ícone de busca quando sidebar está minimizado */}
        <div className="hidden group-data-[collapsible=icon]:flex justify-center py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      </SidebarHeader>

      <SidebarContent className="">
        {/* Dashboard Principal */}
        <NavMain items={data.navMain} groupLabel="Dashboard" />

        <SidebarSeparator className="my-2" />

        {/* Gestão de Projetos */}
        <NavMain items={data.projectManagement} groupLabel="Projetos" />

        <SidebarSeparator className="my-2" />

        {/* Gestão de Equipe */}
        <NavMain items={data.teamManagement} groupLabel="Equipe" />

        <SidebarSeparator className="my-2" />

        {/* Área do Cliente */}
        <NavMain items={data.clientArea} groupLabel="Clientes" />

        <SidebarSeparator className="my-2" />

        {/* Financeiro */}
        <NavMain items={data.financial} groupLabel="Financeiro" />

        <SidebarSeparator className="my-2" />

        {/* Comunicação */}
        <NavMain items={data.communication} groupLabel="Comunicação" />

        <SidebarSeparator className="my-2" />

        {/* Projetos em Destaque */}
        <NavProjects projects={data.projects} />

        <SidebarSeparator className="my-2" />

        {/* Configurações */}
        <NavMain items={data.settings} groupLabel="Configurações" />

        {/* Ações Rápidas */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Ações Rápidas</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/projects/new" className="truncate">
                  <PlusCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Novo Projeto</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/tasks/new" className="truncate">
                  <CheckSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Nova Tarefa</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/clients/new" className="truncate">
                  <Briefcase className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Novo Cliente</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Status do Sistema */}
        <SidebarGroup>
          <SidebarGroupLabel>Status</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="truncate">
                <Activity className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="truncate">Sistema Online</span>
                <Badge variant="secondary" className="ml-auto flex-shrink-0">
                  99.9%
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="truncate">
                <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="truncate">Backup Automático</span>
                <Badge variant="outline" className="ml-auto flex-shrink-0">
                  2h
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
