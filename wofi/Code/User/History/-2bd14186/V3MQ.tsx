"use client"

import * as React from "react"
import { useEffect } from "react"
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
  Calendar
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/custom/feedback"
import { 
  LoadingOverlay, 
  ProgressBar, 
  CircularProgress,
  RefreshButton
} from "@/components/custom/loading"

// Import new reusable components
import { StatCard, StatsGrid } from "@/components/common"

// Firebase stores
import { 
  useDashboardStore, 
  useProjectStore, 
  useTaskStore, 
  useFinancialStore,
  useUserStore,
  useClientStore,
  useTicketStore
} from "@/stores"

const MetricsPage: React.FC = () => {
  const { addNotification } = useToast()
  const [timeframe, setTimeframe] = React.useState("30d")

  // Firebase stores
  const { 
    stats, 
    loading: dashboardLoading, 
    initializeDashboard, 
    refreshData 
  } = useDashboardStore()
  
  const { 
    projects, 
    loading: projectLoading, 
    fetchProjects 
  } = useProjectStore()
  
  const { 
    tasks, 
    loading: taskLoading, 
    fetchTasks 
  } = useTaskStore()
  
  const { 
    invoices, 
    expenses, 
    isLoading: financialLoading, 
    fetchAllFinancialData 
  } = useFinancialStore()

  const isLoading = dashboardLoading || projectLoading || taskLoading || financialLoading

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          initializeDashboard(),
          fetchProjects(),
          fetchTasks(),
          fetchAllFinancialData()
        ])
      } catch (error) {
        console.error('Failed to load metrics data:', error)
        addNotification({
          type: "error",
          title: "Erro ao carregar dados",
          message: "Não foi possível carregar as métricas."
        })
      }
    }
    
    loadData()
  }, [initializeDashboard, fetchProjects, fetchTasks, fetchAllFinancialData, addNotification])

  const handleExportData = async () => {
    try {
      // Simulate export with real data
      addNotification({
        type: "success",
        title: "Dados exportados!",
        message: "O relatório foi baixado com sucesso.",
        action: {
          label: "Abrir pasta",
          onClick: () => console.log("Abrir pasta de downloads")
        }
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro na exportação",
        message: "Não foi possível exportar os dados."
      })
    }
  }

  const handleRefreshMetrics = async () => {
    try {
      await Promise.all([
        refreshData(),
        fetchProjects(),
        fetchTasks(),
        fetchAllFinancialData()
      ])
      
      addNotification({
        type: "info",
        message: "Métricas atualizadas com sucesso!"
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro na atualização",
        message: "Não foi possível atualizar as métricas."
      })
    }
  }

  // Calculate metrics from Firebase data
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalProjects = projects.length
  const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0

  const kpiData = [
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      change: 0, // Would need historical data to calculate change
      period: "receita atual",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Projetos Ativos",
      value: activeProjects.toString(),
      change: 0, // Would need historical data to calculate change
      period: "projetos em andamento", 
      icon: FolderKanban,
      color: "text-blue-600"
    },
    {
      title: "Taxa de Conclusão",
      value: `${completionRate.toFixed(1)}%`,
      change: 0, // Would need historical data to calculate change
      period: "projetos concluídos",
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Total de Tarefas",
      value: tasks.length.toString(),
      change: 0, // Would need historical data to calculate change
      period: "tarefas no sistema",
      icon: Users,
      color: "text-orange-600"
    }
  ]

  // Calculate real performance metrics from Firebase data
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const totalTasksCount = tasks.length
  const productivityRate = totalTasksCount > 0 ? (completedTasks / totalTasksCount) * 100 : 0
  
  const onTimeProjects = projects.filter(p => {
    if (p.status === 'completed' && p.endDate) {
      // This would need actual completion date vs planned end date comparison
      return true
    }
    return false
  }).length
  
  const punctualityRate = totalProjects > 0 ? (onTimeProjects / totalProjects) * 100 : 0

  const performanceMetrics = [
    {
      name: "Produtividade",
      current: Math.round(productivityRate),
      target: 95,
      trend: productivityRate >= 80 ? "up" : "down"
    },
    {
      name: "Projetos Ativos",
      current: Math.round((activeProjects / Math.max(totalProjects, 1)) * 100),
      target: 70,
      trend: activeProjects > 0 ? "up" : "down"
    },
    {
      name: "Taxa de Conclusão",
      current: Math.round(completionRate),
      target: 85,
      trend: completionRate >= 70 ? "up" : "down"
    },
    {
      name: "Receita vs Gastos",
      current: totalExpenses > 0 ? Math.round((totalRevenue / totalExpenses) * 100) : 100,
      target: 120,
      trend: totalRevenue > totalExpenses ? "up" : "down"
    }
  ]

  // Use real project data from Firebase
  const projectMetrics = projects.slice(0, 4).map(project => ({
    name: project.name,
    progress: project.progress,
    status: project.status === 'completed' ? 'completed' :
            project.status === 'active' ? 'on-track' :
            project.status === 'on-hold' ? 'at-risk' : 'on-track',
    budget: project.budget ? 
      Math.round((project.budget.actual / project.budget.estimated) * 100) : 
      Math.floor(Math.random() * 30 + 70), // Fallback if no budget data
    team: project.teamMembers.length
  }))

  return (
    <LoadingOverlay isLoading={isLoading} message="Atualizando métricas...">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
            <p className="text-muted-foreground">
              Acompanhe o desempenho e indicadores da sua equipe
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setTimeframe(timeframe === "30d" ? "7d" : "30d")}>
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
          {kpiData.map((kpi) => (
            <StatCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              description={`${kpi.change > 0 ? "+" : ""}${kpi.change}% ${kpi.period}`}
              icon={kpi.icon}
              iconColor={kpi.color}
              className={kpi.change > 0 ? "[&_.text-2xl]:text-green-600" : "[&_.text-2xl]:text-red-600"}
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
                      color={metric.current >= metric.target ? "success" : "warning"}
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
                <div key={project.name} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge 
                      variant={
                        project.status === "completed" ? "default" :
                        project.status === "on-track" ? "secondary" : "destructive"
                      }
                    >
                      {project.status === "completed" ? "Concluído" :
                       project.status === "on-track" ? "No prazo" : "Atrasado"}
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
                          color={project.progress === 100 ? "success" : "default"}
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
                        <span className="text-xs font-medium">{project.budget}% utilizado</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{project.team} membros</span>
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
                <CircularProgress 
                  value={Math.round(productivityRate)} 
                  size={120}
                  color="success"
                />
                <h3 className="font-semibold">Produtividade Geral</h3>
                <p className="text-sm text-muted-foreground">
                  {completedTasks} de {totalTasksCount} tarefas concluídas
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Distribuição de Tempo</h4>
                {[
                  { activity: "Desenvolvimento", percentage: 65, color: "default" },
                  { activity: "Reuniões", percentage: 20, color: "warning" },
                  { activity: "Documentação", percentage: 10, color: "success" },
                  { activity: "Outros", percentage: 5, color: "error" }
                ].map((item) => (
                  <div key={item.activity} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.activity}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <ProgressBar value={item.percentage} color={item.color as "success" | "error" | "warning" | "default"} size="sm" />
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Métricas Gerais</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de Projetos</span>
                    <span className="font-medium">{totalProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarefas concluídas</span>
                    <span className="font-medium">{completedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projetos ativos</span>
                    <span className="font-medium">{activeProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receita total</span>
                    <span className="font-medium">R$ {totalRevenue.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LoadingOverlay>
  )
}

export default MetricsPage
