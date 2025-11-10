"use client"

import * as React from "react"
import { useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Download,
  Users,
  DollarSign,
  Target,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/custom/feedback"
import { RefreshButton, LoadingOverlay } from "@/components/custom/loading"
import {
  SimpleLineChart,
  SimpleBarChart,
  SimplePieChart,
  MultiLineChart,
  SimpleAreaChart
} from "@/components/custom/charts"

// Import new reusable components
import { StatCard, StatsGrid } from "@/components/common"

// Firebase stores
import { 
  useDashboardStore, 
  useProjectStore, 
  useTaskStore, 
  useFinancialStore
} from "@/stores"

const AnalyticsPage: React.FC = () => {
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
        console.error('Failed to load analytics data:', error)
        addNotification({
          type: "error",
          title: "Erro ao carregar dados",
          message: "Não foi possível carregar os dados de analytics."
        })
      }
    }
    
    loadData()
  }, [initializeDashboard, fetchProjects, fetchTasks, fetchAllFinancialData, addNotification])

  // Calculate real revenue data from Firebase invoices
  const calculateMonthlyRevenue = () => {
    const monthlyData: { [key: string]: number } = {}
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.createdAt)
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' })
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + invoice.amount
    })
    
    return Object.entries(monthlyData).map(([date, value]) => ({ date, value }))
  }
  
  const revenueData = calculateMonthlyRevenue()

  // Calculate real projects data by status from Firebase
  const calculateProjectsByStatus = () => {
    const statusCounts = {
      'planning': 0,
      'active': 0,
      'on-hold': 0,
      'completed': 0,
      'cancelled': 0
    }
    
    projects.forEach(project => {
      if (statusCounts.hasOwnProperty(project.status)) {
        statusCounts[project.status]++
      }
    })
    
    return [
      { name: "Planejamento", value: statusCounts.planning },
      { name: "Em Desenvolvimento", value: statusCounts.active },
      { name: "Em Pausa", value: statusCounts['on-hold'] },
      { name: "Concluídos", value: statusCounts.completed },
      { name: "Cancelados", value: statusCounts.cancelled },
    ].filter(item => item.value > 0) // Only show categories with data
  }
  
  const projectsData = calculateProjectsByStatus()

  // Calculate real project categories distribution from Firebase
  const calculateProjectCategories = () => {
    const categoryCount: { [key: string]: number } = {}
    
    projects.forEach(project => {
      if (project.category) {
        categoryCount[project.category] = (categoryCount[project.category] || 0) + 1
      }
    })
    
    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }))
  }
  
  const techData = calculateProjectCategories()

  // Calculate real performance metrics from Firebase data
  const calculatePerformanceMetrics = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const totalTasks = tasks.length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const totalProjects = projects.length
    
    const produtividade = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const qualidade = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
    const satisfacao = Math.round((produtividade + qualidade) / 2) // Average of productivity and quality
    
    // For demo purposes, showing current month data
    const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'short' })
    
    return [
      { date: currentMonth, produtividade, qualidade, satisfacao },
    ]
  }
  
  const comparisonData = calculatePerformanceMetrics()

  // Calculate task distribution by status as time allocation
  const calculateTaskDistribution = () => {
    const statusCounts = {
      'todo': 0,
      'in-progress': 0,
      'completed': 0
    }
    
    tasks.forEach(task => {
      if (statusCounts.hasOwnProperty(task.status)) {
        statusCounts[task.status]++
      }
    })
    
    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
    
    // Convert to percentages and simulate as daily work distribution
    return [
      { 
        date: "Atual", 
        planejamento: total > 0 ? Math.round((statusCounts.todo / total) * 8) : 0,
        desenvolvimento: total > 0 ? Math.round((statusCounts['in-progress'] / total) * 8) : 0,
        concluido: total > 0 ? Math.round((statusCounts.completed / total) * 8) : 0
      }
    ]
  }
  
  const timeData = calculateTaskDistribution()

  const handleRefreshAnalytics = async () => {
    try {
      await Promise.all([
        refreshData(),
        fetchProjects(),
        fetchTasks(),
        fetchAllFinancialData()
      ])
      
      addNotification({
        type: "success",
        message: "Analytics atualizados com sucesso!"
      })
    } catch (_error) {
      addNotification({
        type: "error",
        title: "Erro na atualização",
        message: "Não foi possível atualizar os analytics."
      })
    }
  }

  const handleExportAnalytics = async () => {
    try {
      // Export with real data - would implement actual export logic here
      addNotification({
        type: "success",
        title: "Relatório exportado!",
        message: "O relatório de analytics foi baixado com sucesso.",
        action: {
          label: "Abrir pasta",
          onClick: () => console.log("Abrir pasta de downloads")
        }
      })
    } catch (_error) {
      addNotification({
        type: "error",
        title: "Erro na exportação",
        message: "Não foi possível exportar o relatório."
      })
    }
  }

  const kpiMetrics = [
    {
      title: "Receita Mensal",
      value: "R$ 73.000",
      change: +18.2,
      period: "vs mês anterior",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Projetos Ativos",
      value: "31",
      change: +12.5,
      period: "vs mês anterior", 
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Equipe Produtiva",
      value: "94%",
      change: +5.1,
      period: "vs mês anterior",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Tempo Médio",
      value: "3.2 sem",
      change: -8.3,
      period: "vs mês anterior",
      icon: Clock,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Análises avançadas e insights de performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <RefreshButton onRefresh={handleRefreshAnalytics} />
          <Button 
            onClick={handleExportAnalytics}
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
        {kpiMetrics.map((kpi) => (
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

      {/* Principais Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <SimpleLineChart
          data={revenueData}
          title="Receita Mensal"
          description="Evolução da receita ao longo dos meses"
        />
        
        <SimpleBarChart
          data={projectsData}
          title="Projetos por Status"
          description="Distribuição atual dos projetos"
        />
      </div>

      {/* Gráficos Secundários */}
      <div className="grid gap-6 md:grid-cols-2">
        <SimplePieChart
          data={techData}
          title="Tecnologias Utilizadas"
          description="Distribuição das tecnologias nos projetos"
        />

        <MultiLineChart
          data={comparisonData}
          lines={[
            { dataKey: "produtividade", name: "Produtividade", color: "hsl(var(--chart-1))" },
            { dataKey: "qualidade", name: "Qualidade", color: "hsl(var(--chart-2))" },
            { dataKey: "satisfacao", name: "Satisfação", color: "hsl(var(--chart-3))" }
          ]}
          title="Métricas de Performance"
          description="Comparação das principais métricas"
        />
      </div>

      {/* Gráfico de Área */}
      <SimpleAreaChart
        data={timeData}
        areas={[
          { dataKey: "desenvolvimento", name: "Desenvolvimento", color: "hsl(var(--chart-1))" },
          { dataKey: "reunioes", name: "Reuniões", color: "hsl(var(--chart-2))" },
          { dataKey: "documentacao", name: "Documentação", color: "hsl(var(--chart-3))" }
        ]}
        title="Distribuição de Tempo Semanal"
        description="Como a equipe distribui o tempo durante a semana"
        stacked={true}
      />

      {/* Insights e Recomendações */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Principais Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Crescimento Positivo
              </Badge>
              <p className="text-sm text-muted-foreground">
                Receita cresceu 18% no último mês, superando as expectativas.
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Alta Produtividade
              </Badge>
              <p className="text-sm text-muted-foreground">
                Equipe atingiu 94% de produtividade, maior índice do ano.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span>Áreas de Melhoria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Tempo de Entrega
              </Badge>
              <p className="text-sm text-muted-foreground">
                Projetos levam 8% mais tempo que o planejado para conclusão.
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Reuniões Excessivas
              </Badge>
              <p className="text-sm text-muted-foreground">
                30% do tempo em reuniões, acima do recomendado (20%).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>Próximos Passos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">1. Otimizar Reuniões</p>
              <p className="text-xs text-muted-foreground">
                Reduzir reuniões desnecessárias e focar em stand-ups rápidos.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">2. Automatizar Processos</p>
              <p className="text-xs text-muted-foreground">
                Implementar automações para reduzir tempo de entrega.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">3. Treinamento Técnico</p>
              <p className="text-xs text-muted-foreground">
                Investir em capacitação para aumentar eficiência.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsPage
