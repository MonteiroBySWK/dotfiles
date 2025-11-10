"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FolderKanban,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Download,
  Filter,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/custom/feedback";
import {
  LoadingOverlay,
  ProgressBar,
  CircularProgress,
  RefreshButton,
} from "@/components/custom/loading";

// Import new reusable components
import { StatCard, StatsGrid } from "@/components/common";

const MetricsPage: React.FC = () => {
  const { addNotification } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [timeframe, setTimeframe] = React.useState("30d");

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Simular export
      await new Promise((resolve) => setTimeout(resolve, 2000));

      addNotification({
        type: "success",
        title: "Dados exportados!",
        message: "O relatório foi baixado com sucesso.",
        action: {
          label: "Abrir pasta",
          onClick: () => console.log("Abrir pasta de downloads"),
        },
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro na exportação",
        message: "Não foi possível exportar os dados.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshMetrics = async () => {
    setIsLoading(true);
    try {
      // Simular atualização de métricas
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addNotification({
        type: "info",
        message: "Métricas atualizadas com sucesso!",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro na atualização",
        message: "Não foi possível atualizar as métricas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingOverlay isLoading={isLoading} message="Atualizando métricas...">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
            <p className="text-muted-foreground">
              Acompanhe o desempenho e indicadores da sua equipe
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setTimeframe(timeframe === "30d" ? "7d" : "30d")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {timeframe === "30d" ? "30 dias" : "7 dias"}
            </Button>
            <RefreshButton onRefresh={handleRefreshMetrics} />
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </div>

        {/* KPIs - Using new StatCard component with responsive grid */}
        <StatsGrid>
          {false && [].map((kpi) => (
            <StatCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              description={`${kpi.change > 0 ? "+" : ""}${kpi.change}% ${
                kpi.period
              }`}
              icon={kpi.icon}
              iconColor={kpi.color}
              className={
                kpi.change > 0
                  ? "[&_.text-2xl]:text-green-600"
                  : "[&_.text-2xl]:text-red-600"
              }
            />
          ))}
        </StatsGrid>

        {/* Performance e Projetos */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Métricas de Performance</span>
              </CardTitle>
              <CardDescription>
                Indicadores de desempenho da equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {performanceMetrics.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {metric.current}% / {metric.target}%
                      </span>
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <ProgressBar
                      value={metric.current}
                      color={
                        metric.current >= metric.target ? "success" : "warning"
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Atual: {metric.current}%</span>
                      <span>Meta: {metric.target}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Project Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Status dos Projetos</span>
              </CardTitle>
              <CardDescription>
                Progresso e status dos projetos ativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectMetrics.map((project) => (
                <div
                  key={project.name}
                  className="space-y-3 p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge
                      variant={
                        project.status === "completed"
                          ? "default"
                          : project.status === "on-track"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {project.status === "completed"
                        ? "Concluído"
                        : project.status === "on-track"
                        ? "No prazo"
                        : "Atrasado"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Progresso</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <CircularProgress
                          value={project.progress}
                          size={40}
                          strokeWidth={4}
                          color={
                            project.progress === 100 ? "success" : "default"
                          }
                        />
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Orçamento</span>
                      <div className="mt-1">
                        <ProgressBar
                          value={project.budget}
                          color={project.budget > 90 ? "error" : "default"}
                          size="sm"
                        />
                        <span className="text-xs font-medium">
                          {project.budget}% utilizado
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {project.team} membros
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Activity className="h-3 w-3 mr-1" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Team Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Eficiência da Equipe</span>
            </CardTitle>
            <CardDescription>
              Análise de produtividade e distribuição de tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center space-y-2">
                <CircularProgress value={87} size={120} color="success" />
                <h3 className="font-semibold">Produtividade Geral</h3>
                <p className="text-sm text-muted-foreground">
                  +5% vs semana anterior
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Distribuição de Tempo</h4>
                {[
                  {
                    activity: "Desenvolvimento",
                    percentage: 65,
                    color: "default",
                  },
                  { activity: "Reuniões", percentage: 20, color: "warning" },
                  {
                    activity: "Documentação",
                    percentage: 10,
                    color: "success",
                  },
                  { activity: "Outros", percentage: 5, color: "error" },
                ].map((item) => (
                  <div key={item.activity} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.activity}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <ProgressBar
                      value={item.percentage}
                      color={
                        item.color as
                          | "success"
                          | "error"
                          | "warning"
                          | "default"
                      }
                      size="sm"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Métricas da Semana</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Horas trabalhadas
                    </span>
                    <span className="font-medium">312h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tarefas concluídas
                    </span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Bugs corrigidos
                    </span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Reviews feitas
                    </span>
                    <span className="font-medium">15</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LoadingOverlay>
  );
};

export default MetricsPage;
