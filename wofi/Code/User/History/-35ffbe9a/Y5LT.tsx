"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useProject, useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Calendar,
  GitBranch,
  Kanban,
  GanttChart,
  FileText,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { StatCard } from "@/components/common";
import { LoadingSpinner } from "@/components/custom/loading";

const statusColors: { [key: string]: string } = {
  planning: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  paused: "bg-gray-100 text-gray-800",
  "on-hold": "bg-gray-100 text-gray-800",
};

const priorityColors: { [key: string]: string } = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export default function ProjectPage() {
  const params = useParams<{ projectId: string }>();
  
  const projectId = useMemo(() => {
    const raw = params?.projectId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);
  
  const { project, loading, error } = useProject(projectId);
  const { users, loading: usersLoading } = useUsers();

  
  const teamMembers = useMemo(() => {
    if (!project || !project.teamMembers || users.length === 0) return [];
    const teamMemberIds = project.teamMembers.map(m => m.userId);
    return users.filter(user => teamMemberIds.includes(user.id));
  }, [project, users]);

  const toDateSafe = (v: Date | string | undefined): Date | null => {
    if (!v) return null;
    if (v instanceof Date) return v;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  const createdAtLabel = useMemo(() => 
    project ? (toDateSafe(project.createdAt)?.toLocaleDateString("pt-BR") ?? "—") : "—",
    [project]
  );

  const deadlineLabel = useMemo(() => 
    project && project.deadline
    ? (toDateSafe(project.deadline)?.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }) ?? "—")
    : "—",
    [project]
  );
    
  const budgetLabel = useMemo(() => {
    if (!project) return "—";
    if (typeof project.budget === 'number') {
      return project.budget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
    if (typeof project.budget === 'object' && project.budget !== null) {
      const budget = project.budget as { estimated?: number; actual?: number };
      if (budget.actual) {
        return budget.actual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      }
      if (budget.estimated) {
        return budget.estimated.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      }
    }
    return "—";
  }, [project]);

  if (projectsLoading || usersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">
          Projeto não encontrado
        </h1>
        <p className="text-gray-600 mt-2">
          O projeto solicitado não existe ou foi removido.
        </p>
        <Link href="/dashboard/projects">
          <Button className="mt-4">Voltar para Projetos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <Badge
              className={
                statusColors[project.status] ?? "bg-gray-100 text-gray-800"
              }
            >
              {project.status}
            </Badge>
            <Badge
              className={
                priorityColors[project.priority] ?? "bg-gray-100 text-gray-800"
              }
            >
              {project.priority}
            </Badge>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/projects">
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <Link href={`/dashboard/projects/${projectId}/config`}>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Progresso"
          value={`${project.progress || 0}%`}
          icon={BarChart3}
          iconColor="text-blue-600"
          progress={project.progress || 0}
        />
        <StatCard
          title="Equipe"
          value={String(teamMembers.length)}
          description="membros ativos"
          icon={Users}
          iconColor="text-green-600"
        />
        <StatCard
          title="Prazo"
          value={deadlineLabel}
          description="deadline"
          icon={Calendar}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Orçamento"
          value={budgetLabel}
          description="total aprovado"
          icon={BarChart3}
          iconColor="text-purple-600"
        />
      </div>
      
      {/* Tool Navigation */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href={`/dashboard/projects/${project.id}/kanban`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Kanban className="h-8 w-8 mx-auto text-blue-600" />
              <CardTitle className="text-lg">Kanban</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/dashboard/projects/${project.id}/gantt`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <GanttChart className="h-8 w-8 mx-auto text-green-600" />
              <CardTitle className="text-lg">Gantt</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/dashboard/projects/${project.id}/backlog`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <GitBranch className="h-8 w-8 mx-auto text-purple-600" />
              <CardTitle className="text-lg">Backlog</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/dashboard/projects/${project.id}/requirements`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <FileText className="h-8 w-8 mx-auto text-orange-600" />
              <CardTitle className="text-lg">Requisitos</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>


      {/* Detailed Info */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span>{project.clientName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Criado em:</span>
                  <span>{createdAtLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    className={
                      statusColors[project.status] ?? "bg-gray-100 text-gray-800"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progresso:</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Membros:</span>
                  <span>{teamMembers.length} pessoas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prioridade:</span>
                  <Badge
                    className={
                      priorityColors[project.priority] ?? "bg-gray-100 text-gray-800"
                    }
                  >
                    {project.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="team">
            <Card>
                <CardHeader>
                    <CardTitle>Membros da Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {teamMembers.map(member => (
                            <li key={member.id} className="flex items-center justify-between">
                                <span>{member.name} ({member.role})</span>
                                <Link href={`/dashboard/team/${member.id}`}>
                                    <Button variant="outline" size="sm">Ver Perfil</Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
