"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Import new reusable components
import { StatCard, StatsGrid } from "@/components/common"

// Dados mock para relatórios
const performanceData = {
  projects: {
    total: 15,
    completed: 8,
    inProgress: 5,
    delayed: 2,
    completionRate: 85,
    avgDuration: 45, // dias
    onTimeDelivery: 92
  },
  team: {
    totalMembers: 12,
    activeMembers: 11,
    productivity: 87,
    utilization: 78,
    satisfaction: 94,
    avgHoursPerWeek: 42
  },
  clients: {
    total: 8,
    active: 6,
    satisfied: 95, // NPS
    retention: 88,
    newClients: 3,
    churnRate: 5
  },
  financial: {
    revenue: 450000,
    profit: 135000,
    margin: 30,
    growth: 15,
    invoiced: 380000,
    pending: 70000
  }
}

const recentReports = [
  {
    id: 1,
    name: "Relatório Mensal - Janeiro 2024",
    type: "monthly",
    date: "2024-01-31",
    status: "completed",
    format: "PDF",
    size: "2.5 MB"
  },
  {
    id: 2,
    name: "Performance da Equipe - Q4 2023",
    type: "quarterly",
    date: "2024-01-15",
    status: "completed",
    format: "Excel",
    size: "1.8 MB"
  },
  {
    id: 3,
    name: "Análise Financeira - Dezembro",
    type: "financial",
    date: "2024-01-05",
    status: "completed",
    format: "PDF",
    size: "3.2 MB"
  },
  {
    id: 4,
    name: "Produtividade por Projeto",
    type: "productivity",
    date: "2024-01-20",
    status: "generating",
    format: "PDF",
    size: "-"
  }
]

const chartData = {
  projectsStatus: [
    { name: "Concluídos", value: 8, color: "#22c55e" },
    { name: "Em Andamento", value: 5, color: "#3b82f6" },
    { name: "Atrasados", value: 2, color: "#ef4444" }
  ],
  monthlyRevenue: [
    { month: "Set", revenue: 350000, target: 400000 },
    { month: "Out", revenue: 420000, target: 400000 },
    { month: "Nov", revenue: 380000, target: 400000 },
    { month: "Dez", revenue: 450000, target: 400000 },
    { month: "Jan", revenue: 520000, target: 500000 }
  ]
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")
  const [reportType, setReportType] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simular geração de relatório
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "generating": return "bg-blue-100 text-blue-800"
      case "error": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Concluído"
      case "generating": return "Gerando"
      case "error": return "Erro"
      default: return "Pendente"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises detalhadas de performance e métricas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
              <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
              <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
              <SelectItem value="last-year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {performanceData.financial.revenue.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{performanceData.financial.growth}% vs mês anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.projects.inProgress}</div>
                <div className="text-xs text-muted-foreground">
                  {performanceData.projects.completionRate}% taxa de conclusão
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipe Ativa</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.team.activeMembers}</div>
                <div className="text-xs text-muted-foreground">
                  {performanceData.team.productivity}% produtividade média
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.clients.satisfied}%</div>
                <div className="text-xs text-muted-foreground">
                  NPS dos clientes
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Projetos</CardTitle>
                <CardDescription>Distribuição atual dos projetos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.projectsStatus.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                        <Progress 
                          value={(item.value / performanceData.projects.total) * 100} 
                          className="h-2 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
                <CardDescription>Performance vs Meta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.monthlyRevenue.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.month}</span>
                        <span className="font-medium">
                          R$ {(item.revenue / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Progress 
                          value={(item.revenue / item.target) * 100} 
                          className="h-2 flex-1"
                        />
                        <div className="text-xs text-muted-foreground w-12">
                          {Math.round((item.revenue / item.target) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projetos */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Taxa de Conclusão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {performanceData.projects.completionRate}%
                </div>
                <Progress value={performanceData.projects.completionRate} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {performanceData.projects.completed} de {performanceData.projects.total} projetos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Entrega no Prazo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {performanceData.projects.onTimeDelivery}%
                </div>
                <Progress value={performanceData.projects.onTimeDelivery} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Projetos entregues no prazo
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Duração Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {performanceData.projects.avgDuration} dias
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Tempo médio de conclusão
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Projetos por Status</CardTitle>
              <CardDescription>Análise detalhada dos projetos atuais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="font-medium">Projetos Concluídos</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{performanceData.projects.completed}</div>
                    <div className="text-sm text-muted-foreground">53% do total</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="font-medium">Em Andamento</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{performanceData.projects.inProgress}</div>
                    <div className="text-sm text-muted-foreground">33% do total</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="font-medium">Atrasados</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{performanceData.projects.delayed}</div>
                    <div className="text-sm text-muted-foreground">13% do total</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipe */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Produtividade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {performanceData.team.productivity}%
                </div>
                <Progress value={performanceData.team.productivity} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Média da equipe
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Utilização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {performanceData.team.utilization}%
                </div>
                <Progress value={performanceData.team.utilization} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Horas produtivas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Satisfação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {performanceData.team.satisfaction}%
                </div>
                <Progress value={performanceData.team.satisfaction} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  NPS da equipe
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Carga Horária</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {performanceData.team.avgHoursPerWeek}h
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Média semanal
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financeiro */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  R$ {(performanceData.financial.revenue / 1000).toFixed(0)}k
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{performanceData.financial.growth}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lucro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  R$ {(performanceData.financial.profit / 1000).toFixed(0)}k
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {performanceData.financial.margin}% margem
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Faturado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  R$ {(performanceData.financial.invoiced / 1000).toFixed(0)}k
                </div>
                <Progress 
                  value={(performanceData.financial.invoiced / performanceData.financial.revenue) * 100} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pendente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  R$ {(performanceData.financial.pending / 1000).toFixed(0)}k
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  A receber
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Relatórios Recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Relatórios Recentes</CardTitle>
              <CardDescription>Histórico de relatórios gerados</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Data: {new Date(report.date).toLocaleDateString('pt-BR')}</span>
                      <span>Formato: {report.format}</span>
                      <span>Tamanho: {report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(report.status)}>
                    {getStatusLabel(report.status)}
                  </Badge>
                  {report.status === 'completed' && (
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
