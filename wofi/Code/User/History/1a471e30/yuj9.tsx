"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useTeamStore } from "@/stores/teamStore";
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
  // Navegação Principal - Dashboard & Visão Geral
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      badge: null,
      items: [
        {
          title: "Visão Geral",
          url: "/dashboard",
        },
        {
          title: "Métricas",
          url: "/dashboard/metrics",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Customizador",
          url: "/dashboard/customizer",
        },
        {
          title: "Atividade Recente",
          url: "/dashboard/activity",
        },
      ],
    },
  ],
  // Gestão de Projetos
  projectManagement: [
    {
      title: "Projetos",
      url: "/dashboard/projects",
      icon: FolderKanban,
      badge: "8",
      items: [
        {
          title: "Todos os Projetos",
          url: "/dashboard/projects",
        },
        {
          title: "Em Andamento",
          url: "/dashboard/projects?status=active",
        },
        {
          title: "Concluídos",
          url: "/dashboard/projects?status=completed",
        },
        {
          title: "Pausados",
          url: "/dashboard/projects?status=paused",
        },
      ],
    },
    {
      title: "Tarefas",
      url: "/dashboard/tasks",
      icon: CheckSquare,
      badge: "23",
      items: [
        {
          title: "Minhas Tarefas",
          url: "/dashboard/tasks/my",
        },
        {
          title: "Kanban",
          url: "/dashboard/tasks/kanban",
        },
        {
          title: "Timeline",
          url: "/dashboard/tasks/timeline",
        },
      ],
    },
    {
      title: "Cronograma",
      url: "/dashboard/calendar",
      icon: Calendar,
      badge: null,
      items: [
        {
          title: "Calendário",
          url: "/dashboard/calendar",
        },
        {
          title: "Prazos",
          url: "/dashboard/deadlines",
        },
        {
          title: "Reuniões",
          url: "/dashboard/meetings",
        },
      ],
    },
  ],
  // Gestão de Equipe
  teamManagement: [
    {
      title: "Equipe",
      url: "/dashboard/team",
      icon: Users,
      badge: null,
      items: [
        {
          title: "Membros",
          url: "/dashboard/team",
        },
        {
          title: "Cargos",
          url: "/dashboard/team/roles",
        },
        {
          title: "Avaliações",
          url: "/dashboard/team/reviews",
        },
        {
          title: "Timesheet",
          url: "/dashboard/team/timesheet",
        },
      ],
    },
    {
      title: "Recursos Humanos",
      url: "/dashboard/hr",
      icon: UserCheck,
      badge: null,
      items: [
        {
          title: "Recrutamento",
          url: "/dashboard/hr/recruitment",
        },
        {
          title: "Onboarding",
          url: "/dashboard/hr/onboarding",
        },
        {
          title: "Performance",
          url: "/dashboard/hr/performance",
        },
      ],
    },
  ],
  // Área do Cliente
  clientArea: [
    {
      title: "Clientes",
      url: "/dashboard/clients",
      icon: Briefcase,
      badge: "5",
      items: [
        {
          title: "Lista de Clientes",
          url: "/dashboard/clients",
        },
        {
          title: "Portal do Cliente",
          url: "/dashboard/clients/portal",
        },
        {
          title: "Feedback",
          url: "/dashboard/clients/feedback",
        },
        {
          title: "Tickets",
          url: "/dashboard/clients/tickets",
        },
      ],
    },
  ],
  // Financeiro
  financial: [
    {
      title: "Financeiro",
      url: "/dashboard/financial",
      icon: DollarSign,
      badge: null,
      items: [
        {
          title: "Resumo",
          url: "/dashboard/financial",
        },
        {
          title: "Orçamentos",
          url: "/dashboard/financial/budgets",
        },
        {
          title: "Faturamento",
          url: "/dashboard/financial/invoicing",
        },
        {
          title: "Pagamentos",
          url: "/dashboard/financial/payments",
        },
        {
          title: "Contratos",
          url: "/dashboard/financial/contracts",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "/dashboard/reports",
      icon: TrendingUp,
      badge: null,
      items: [
        {
          title: "Performance",
          url: "/dashboard/reports/performance",
        },
        {
          title: "Produtividade",
          url: "/dashboard/reports/productivity",
        },
        {
          title: "Financeiro",
          url: "/dashboard/reports/financial",
        },
        {
          title: "Projetos",
          url: "/dashboard/reports/projects",
        },
      ],
    },
  ],
  // Comunicação
  communication: [
    {
      title: "Mensagens",
      url: "/dashboard/messages",
      icon: MessageSquare,
      badge: "3",
      items: [
        {
          title: "Chat Interno",
          url: "/dashboard/messages/chat",
        },
        {
          title: "E-mail",
          url: "/dashboard/messages/email",
        },
        {
          title: "Notificações",
          url: "/dashboard/notifications",
        },
      ],
    },
    {
      title: "Suporte",
      url: "/dashboard/support",
      icon: HelpCircle,
      badge: null,
      items: [
        {
          title: "Central de Ajuda",
          url: "/dashboard/support/help",
        },
        {
          title: "Documentação",
          url: "/dashboard/support/docs",
        },
        {
          title: "Contato",
          url: "/dashboard/support/contact",
        },
      ],
    },
  ],
  // Configurações
  settings: [
    {
      title: "Configurações",
      url: "/dashboard/settings",
      icon: Settings2,
      badge: null,
      items: [
        {
          title: "Perfil",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Conta",
          url: "/dashboard/settings/account",
        },
        {
          title: "Notificações",
          url: "/dashboard/settings/notifications",
        },
        {
          title: "Segurança",
          url: "/dashboard/settings/security",
        },
        {
          title: "Sistema",
          url: "/dashboard/settings/system",
        },
      ],
    },
  ],
  // Projetos em destaque
  projects: [
    {
      name: "Website Redesign",
      url: "/dashboard/projects/website-redesign",
      icon: Frame,
      status: "active",
      progress: 75,
    },
    {
      name: "Mobile App",
      url: "/dashboard/projects/mobile-app",
      icon: PieChart,
      status: "active",
      progress: 45,
    },
    {
      name: "E-commerce Platform",
      url: "/dashboard/projects/ecommerce",
      icon: Map,
      status: "paused",
      progress: 30,
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();
  const { companies, loadCompanies } = useTeamStore();

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Dados padrão caso o usuário não esteja carregado
  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: user.avatar || "/avatars/default.jpg",
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
