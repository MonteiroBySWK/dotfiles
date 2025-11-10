"use client"

import { 
  Clock, 
  Code, 
  Users, 
  TrendingUp, 
  DollarSign, 
  GitBranch, 
  Bug, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  Target,
  Plus
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function MainDashboard() {
  const { projects, tasks } = useProjectStore();
  const { user } = useAuthStore();
  const router = useRouter();

  // Calcular métricas
  const activeProjects = projects.filter(p => p.status === "in-progress").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const planningProjects = projects.filter(p => p.status === "planning").length;
  const pausedProjects = projects.filter(p => p.status === "paused").length;

  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(t => t.status === "todo").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
  const doneTasks = tasks.filter(t => t.status === "done").length;

  // Tarefas com prazo próximo (próximos 7 dias)
  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const taskDate = new Date(task.dueDate);
    return taskDate <= nextWeek && taskDate >= today;
  });

  const criticalTasks = tasks.filter(t => t.priority === "critical").length;
  const highPriorityTasks = tasks.filter(t => t.priority === "high").length;

  return (
    <div className="flex flex-1 flex-col gap-6 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Geral</h1>
          <p className="text-muted-foreground">
            Visão geral dos projetos e métricas da sua empresa
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/projects/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Ativos
            </CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {projects.length} projetos totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Concluídos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              {projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tarefas Pendentes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks} tarefas totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {doneTasks} de {totalTasks} tarefas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cartões de Detalhes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Status dos Projetos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Em Desenvolvimento</span>
              <span className="text-sm font-medium">{activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Planejamento</span>
              <span className="text-sm font-medium">{planningProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Concluídos</span>
              <span className="text-sm font-medium">{completedProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pausados</span>
              <span className="text-sm font-medium">{pausedProjects}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Status das Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Para Fazer</span>
              <span className="text-sm font-medium">{todoTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Em Progresso</span>
              <span className="text-sm font-medium">{inProgressTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Concluídas</span>
              <span className="text-sm font-medium">{doneTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Prioridade Alta</span>
              <span className="text-sm font-medium text-red-600">{criticalTasks + highPriorityTasks}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Prazos e Entregas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tarefas com prazo</span>
              <span className="text-sm font-medium">
                {tasks.filter(t => t.dueDate).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Próximos 7 dias</span>
              <span className="text-sm font-medium text-yellow-600">
                {upcomingTasks.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Críticas</span>
              <span className="text-sm font-medium text-red-600">{criticalTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Taxa de conclusão</span>
              <span className="text-sm font-medium text-green-600">
                {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalTasks > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <Bug className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{criticalTasks} tarefas críticas</p>
                  <p className="text-xs text-muted-foreground">
                    Requerem atenção imediata
                  </p>
                </div>
              </div>
            )}
            {upcomingTasks.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Calendar className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{upcomingTasks.length} tarefas próximas</p>
                  <p className="text-xs text-muted-foreground">
                    Prazos nos próximos 7 dias
                  </p>
                </div>
              </div>
            )}
            {projects.length === 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Code className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Bem-vindo!</p>
                  <p className="text-xs text-muted-foreground">
                    Comece criando seu primeiro projeto
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Resumo da Atividade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Projetos ativos</span>
              <span className="text-sm font-medium text-green-600">{activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tarefas concluídas</span>
              <span className="text-sm font-medium text-green-600">{doneTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Progresso geral</span>
              <span className="text-sm font-medium">
                {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Usuário ativo</span>
              <span className="text-sm font-medium text-green-600">
                {user?.displayName || user?.email || "Anônimo"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
