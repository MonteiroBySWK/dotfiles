"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  Clock,
  Target,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Filter
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FadeIn } from "@/components/custom/animations"

export default function MetricsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [category, setCategory] = useState("all")

  const metrics = {
    productivity: {
      current: 87,
      previous: 82,
      trend: "up"
    },
    teamEfficiency: {
      current: 94,
      previous: 91,
      trend: "up"
    },
    clientSatisfaction: {
      current: 4.6,
      previous: 4.4,
      trend: "up"
    },
    projectCompletion: {
      current: 78,
      previous: 85,
      trend: "down"
    }
  }

  const kpiData = [
    {
      title: "Receita Mensal",
      value: "R$ 245.000",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Projetos Ativos",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Equipe Produtiva",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Tempo Médio",
      value: "32h",
      change: "-4h",
      trend: "down",
      icon: Clock,
      color: "text-orange-600"
    }
  ]

  const projectMetrics = [
    { name: "Website Redesign", completion: 85, status: "on-track", budget: 95 },
    { name: "Mobile App", completion: 60, status: "at-risk", budget: 110 },
    { name: "E-commerce Platform", completion: 92, status: "ahead", budget: 88 },
    { name: "Dashboard Analytics", completion: 45, status: "on-track", budget: 102 }
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
            <p className="text-muted-foreground">
              Análise detalhada de performance e indicadores chave
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
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
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* KPIs Principais */}
      <FadeIn delay={100}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={kpi.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {kpi.change}
                  </span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>

      {/* Métricas de Performance */}
      <FadeIn delay={200}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance da Equipe
              </CardTitle>
              <CardDescription>
                Indicadores de produtividade e eficiência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Produtividade</span>
                  <span className="font-medium">{metrics.productivity.current}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.productivity.current}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Eficiência</span>
                  <span className="font-medium">{metrics.teamEfficiency.current}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.teamEfficiency.current}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Satisfação do Cliente</span>
                  <span className="font-medium">{metrics.clientSatisfaction.current}/5.0</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(metrics.clientSatisfaction.current / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conclusão de Projetos</span>
                  <span className="font-medium">{metrics.projectCompletion.current}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.projectCompletion.current}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Status dos Projetos
              </CardTitle>
              <CardDescription>
                Acompanhamento de progresso e orçamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectMetrics.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{project.name}</span>
                    <Badge 
                      variant={
                        project.status === "ahead" ? "default" :
                        project.status === "on-track" ? "secondary" : "destructive"
                      }
                    >
                      {project.status === "ahead" ? "Adiantado" :
                       project.status === "on-track" ? "No Prazo" : "Em Risco"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progresso: {project.completion}%</span>
                      <span>Orçamento: {project.budget}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          project.status === "ahead" ? "bg-green-500" :
                          project.status === "on-track" ? "bg-blue-500" : "bg-red-500"
                        }`}
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Gráficos de Tendência */}
      <FadeIn delay={300}>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LineChart className="h-4 w-4" />
                Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">+23%</div>
                  <div className="text-xs text-muted-foreground">vs período anterior</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-4 w-4" />
                Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-t from-green-50 to-transparent rounded-lg flex items-end justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-xs text-muted-foreground">taxa de sucesso</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="h-4 w-4" />
                Qualidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-t from-purple-50 to-transparent rounded-lg flex items-end justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                  <div className="text-xs text-muted-foreground">satisfação média</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  )
}
