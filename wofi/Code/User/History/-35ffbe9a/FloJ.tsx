"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  Card,
  CardContent,
  CardDescription,
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

// Tipos básicos para segurança
type FirestoreTimestamp = { toDate: () => Date };

type ProjectDoc = {
  name?: string;
  description?: string;
  status?: "planning" | "in-progress" | "completed" | "paused" | string;
  priority?: "low" | "medium" | "high" | "critical" | string;
  progress?: number | string;
  team?: number;
  teamMembers?: Array<unknown>;
  deadline?: Date | string | FirestoreTimestamp;
  createdAt?: Date | string | FirestoreTimestamp;
  updatedAt?: Date | string | FirestoreTimestamp;
  budget?: number | string;
  client?: string | { name?: string };
  clientName?: string;
};

const statusColors = {
  planning: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  paused: "bg-gray-100 text-gray-800",
} as const;

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
} as const;

function toDateSafe(v: ProjectDoc["createdAt"]): Date | null {
  if (!v) return null;
  if (typeof v === "string") {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  if (v instanceof Date) return v;
  if (
    typeof v === "object" &&
    "toDate" in v &&
    typeof v.toDate === "function"
  ) {
    try {
      return v.toDate();
    } catch {
      return null;
    }
  }
  return null;
}

function toNumberSafe(n: unknown, fallback = 0): number {
  if (typeof n === "number") return n;
  if (typeof n === "string") {
    const parsed = Number(n);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

export default function ProjectPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = useMemo(() => {
    const raw = params?.projectId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<
    null | (Required<ProjectDoc> & { id: string })
  >(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!projectId) return;
      setLoading(true);
      setError(null);
      try {
        const ref = doc(db, "projects", projectId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          if (mounted) {
            setProject(null);
            setError("Projeto não encontrado");
          }
          return;
        }
        const data = snap.data() as ProjectDoc;

        const createdAt = toDateSafe(data.createdAt) ?? new Date();
        const deadline = toDateSafe(data.deadline);
        const status = (data.status ?? "planning") as ProjectDoc["status"];
        const priority = (data.priority ?? "medium") as ProjectDoc["priority"];
        const progress = Math.max(
          0,
          Math.min(100, toNumberSafe(data.progress, 0))
        );
        const team =
          typeof data.team === "number"
            ? data.team
            : Array.isArray(data.teamMembers)
            ? data.teamMembers.length
            : 0;

        // Orçamento: deixa como string se vier formatado, senão formata número básico em BRL
        const budget =
          typeof data.budget === "string"
            ? data.budget
            : typeof data.budget === "number"
            ? data.budget.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : "—";

        const client =
          typeof data.client === "string"
            ? data.client
            : typeof data.client === "object"
            ? data.client?.name ?? "—"
            : data.clientName ?? "—";

        if (mounted) {
          setProject({
            id: snap.id,
            name: data.name ?? "Projeto sem nome",
            description: data.description ?? "",
            status,
            priority,
            progress,
            team,
            deadline: deadline ?? null,
            createdAt,
            updatedAt: toDateSafe(data.updatedAt) ?? createdAt,
            budget,
            client,
          } as Required<ProjectDoc> & { id: string });
        }
      } catch (e) {
        console.error(e);
        if (mounted) setError("Falha ao carregar projeto");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Carregando projeto...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">
          Projeto não encontrado
        </h1>
        <p className="text-gray-600 mt-2">
          {error ?? "O projeto solicitado não existe ou foi removido."}
        </p>
        <Link href="/dashboard/projects">
          <Button className="mt-4">Voltar para Projetos</Button>
        </Link>
      </div>
    );
  }

  const createdAtLabel =
    toDateSafe(project.createdAt)?.toLocaleDateString("pt-BR") ?? "—";
  const deadlineLabel = project.deadline
    ? toDateSafe(project.deadline)?.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }) ?? "—"
    : "—";

  return (
    <div className="space-y-6">
      {/* Header do Projeto */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <Badge
              className={
                statusColors[project.status as keyof typeof statusColors] ??
                "bg-gray-100 text-gray-800"
              }
            >
              {project.status}
            </Badge>
            <Badge
              className={
                priorityColors[
                  project.priority as keyof typeof priorityColors
                ] ?? "bg-gray-100 text-gray-800"
              }
            >
              {project.priority}
            </Badge>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/projects/${projectId}`}>
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Projeto
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

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Progresso"
          value={`${project.progress}%`}
          icon={BarChart3}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Equipe"
          value={project.team.toString()}
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
          value={
            typeof project.budget === "string"
              ? project.budget
              : String(project.budget)
          }
          description="total aprovado"
          icon={BarChart3}
          iconColor="text-purple-600"
        />
      </div>

      {/* Navegação por Ferramentas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href={`/dashboard/projects/${project.id}/kanban`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Kanban className="h-8 w-8 mx-auto text-blue-600" />
              <CardTitle className="text-lg">Kanban</CardTitle>
              <CardDescription>Gerencie tarefas em quadros</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/dashboard/projects/${project.id}/gantt`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <GanttChart className="h-8 w-8 mx-auto text-green-600" />
              <CardTitle className="text-lg">Gantt</CardTitle>
              <CardDescription>Timeline do projeto</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/dashboard/projects/${project.id}/backlog`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <GitBranch className="h-8 w-8 mx-auto text-purple-600" />
              <CardTitle className="text-lg">Backlog</CardTitle>
              <CardDescription>Gerencie sprints e itens</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/dashboard/projects/${project.id}/requirements`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <FileText className="h-8 w-8 mx-auto text-orange-600" />
              <CardTitle className="text-lg">Requisitos</CardTitle>
              <CardDescription>Documentação e specs</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Informações Detalhadas */}
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
                  <span>{project.client && "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Criado em:</span>
                  <span>{createdAtLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    className={
                      statusColors[
                        project.status as keyof typeof statusColors
                      ] ?? "bg-gray-100 text-gray-800"
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
                  <span>{project.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Membros:</span>
                  <span>{project.team} pessoas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prioridade:</span>
                  <Badge
                    className={
                      priorityColors[
                        project.priority as keyof typeof priorityColors
                      ] ?? "bg-gray-100 text-gray-800"
                    }
                  >
                    {project.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
