'use client';

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import Config from "@/components/Config"
import MainDashboard from "@/components/dashboard/MainDashboard"
import MemberDashboard from "@/components/dashboard/MemberDashboard"
import Backlog from "@/components/projects/Backlog"
import Gantt from "@/components/projects/Gantt"
import Kanban from "@/components/projects/Kanban"
import ProjectRequirements from "@/components/projects/ProjectRequirements"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Tipos para navegação
type PageType = 
  | 'dashboard' 
  | 'dashboard/overview' 
  | 'dashboard/projects' 
  | 'dashboard/team' 
  | 'team/members'
  | 'projects/kanban'
  | 'projects/gantt'
  | 'projects/backlog'
  | 'projects/requirements'
  | 'settings'
  | 'settings/profile'
  | 'settings/notifications'
  | 'settings/security'
  | 'settings/system';

interface PageInfo {
  title: string;
  breadcrumb: { label: string; href?: string }[];
  component: React.ReactNode;
}

// Configuração das páginas
const pages: Record<PageType, PageInfo> = {
  'dashboard': {
    title: 'Dashboard Principal',
    breadcrumb: [
      { label: 'Dashboard' }
    ],
    component: <MainDashboard />
  },
  'dashboard/overview': {
    title: 'Visão Geral',
    breadcrumb: [
      { label: 'Dashboard', href: 'dashboard' },
      { label: 'Visão Geral' }
    ],
    component: <MainDashboard />
  },
  'dashboard/projects': {
    title: 'Projetos',
    breadcrumb: [
      { label: 'Dashboard', href: 'dashboard' },
      { label: 'Projetos' }
    ],
    component: <MainDashboard />
  },
  'dashboard/team': {
    title: 'Equipe',
    breadcrumb: [
      { label: 'Dashboard', href: 'dashboard' },
      { label: 'Equipe' }
    ],
    component: <MainDashboard />
  },
  'team/members': {
    title: 'Membros da Equipe',
    breadcrumb: [
      { label: 'Equipe', href: 'team' },
      { label: 'Membros' }
    ],
    component: <MemberDashboard />
  },
  'projects/kanban': {
    title: 'Quadro Kanban',
    breadcrumb: [
      { label: 'Projetos', href: 'projects' },
      { label: 'Kanban' }
    ],
    component: <Kanban />
  },
  'projects/gantt': {
    title: 'Diagrama de Gantt',
    breadcrumb: [
      { label: 'Projetos', href: 'projects' },
      { label: 'Gantt' }
    ],
    component: <Gantt />
  },
  'projects/backlog': {
    title: 'Backlog do Produto',
    breadcrumb: [
      { label: 'Projetos', href: 'projects' },
      { label: 'Backlog' }
    ],
    component: <Backlog />
  },
  'projects/requirements': {
    title: 'Requisitos do Projeto',
    breadcrumb: [
      { label: 'Projetos', href: 'projects' },
      { label: 'Requisitos' }
    ],
    component: <ProjectRequirements />
  },
  'settings': {
    title: 'Configurações',
    breadcrumb: [
      { label: 'Configurações' }
    ],
    component: <Config />
  },
  'settings/profile': {
    title: 'Perfil',
    breadcrumb: [
      { label: 'Configurações', href: 'settings' },
      { label: 'Perfil' }
    ],
    component: <Config />
  },
  'settings/notifications': {
    title: 'Notificações',
    breadcrumb: [
      { label: 'Configurações', href: 'settings' },
      { label: 'Notificações' }
    ],
    component: <Config />
  },
  'settings/security': {
    title: 'Segurança',
    breadcrumb: [
      { label: 'Configurações', href: 'settings' },
      { label: 'Segurança' }
    ],
    component: <Config />
  },
  'settings/system': {
    title: 'Sistema',
    breadcrumb: [
      { label: 'Configurações', href: 'settings' },
      { label: 'Sistema' }
    ],
    component: <Config />
  }
};

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  
  const pageInfo = pages[currentPage];

  // Função para navegar entre páginas
  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
  };

  // Disponibilizar a função de navegação globalmente
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).navigateToPage = navigateToPage;
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {pageInfo.breadcrumb.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="mx-2" />}
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToPage(item.href as PageType);
                          }}
                          className="cursor-pointer hover:text-primary"
                        >
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {pageInfo.component}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
