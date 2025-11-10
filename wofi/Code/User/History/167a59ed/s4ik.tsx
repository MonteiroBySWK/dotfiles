"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { NotificationBell } from "@/components/custom/notifications";
import { MainContainer } from "@/components/layout/MainContainer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

// Mapeamento de rotas para breadcrumbs
const routeToBreadcrumb: Record<string, { label: string; href?: string }[]> = {
  "/dashboard": [{ label: "Dashboard" }],
  "/dashboard/team": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Equipe" },
  ],
  "/dashboard/projects": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projetos" },
  ],
  "/dashboard/settings": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Configurações" },
  ],
  "/dashboard/analytics": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Analytics" },
  ],
  "/dashboard/metrics": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Métricas" },
  ],
  "/dashboard/customizer": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Customizador" },
  ],
  "/dashboard/activity": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Atividade" },
  ],
  "/dashboard/tasks": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Tarefas" },
  ],
  "/dashboard/calendar": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Calendário" },
  ],
  "/dashboard/clients": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Clientes" },
  ],
  "/dashboard/financial": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Financeiro" },
  ],
  "/dashboard/reports": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Relatórios" },
  ],
  "/dashboard/messages": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Mensagens" },
  ],
  "/dashboard/notifications": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Notificações" },
  ],
};

// Função para gerar breadcrumbs dinâmicos
const generateBreadcrumbs = (
  pathname: string
): { label: string; href?: string }[] => {
  // Se existe um mapeamento específico, use-o
  if (routeToBreadcrumb[pathname]) {
    return routeToBreadcrumb[pathname];
  }

  // Para rotas de projetos dinâmicas
  if (pathname.startsWith("/dashboard/projects/")) {
    const segments = pathname.split("/");
    const breadcrumbs: { label: string; href?: string }[] = [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Projetos", href: "/dashboard/projects" },
    ];

    if (segments[3] && segments[3] !== "") {
      // É uma página de projeto específico
      const projectId = segments[3];
      const projectName =
        projectId.charAt(0).toUpperCase() + projectId.slice(1);
      breadcrumbs.push({
        label: `Projeto ${projectName}`,
        href: `/dashboard/projects/${projectId}`,
      });

      // Se há uma sub-página (kanban, gantt, etc)
      if (segments[4]) {
        const tool = segments[4].charAt(0).toUpperCase() + segments[4].slice(1);
        breadcrumbs.push({ label: tool });
      }
    }

    return breadcrumbs;
  }

  // Fallback para outras rotas - sempre incluir Dashboard como primeiro item
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 1) {
    const pageName = segments[segments.length - 1];
    const formattedName =
      pageName.charAt(0).toUpperCase() + pageName.slice(1).replace("-", " ");
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: formattedName },
    ];
  }

  return [{ label: "Dashboard" }];
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 fixed bg-card z-20 w-full">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="mx-2" />}
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink href={item.href}>
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
            <NotificationBell />
          </div>
        </header>

        <MainContainer>{children}</MainContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}
