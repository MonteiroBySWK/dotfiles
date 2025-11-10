"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock,
  ChevronRight,
  Settings,
  Plus,
  Star,
  Activity,
  Target,
  MessageSquare
} from "lucide-react"

interface Widget {
  id: string
  title: string
  type: "metric" | "chart" | "list" | "activity"
  size: "small" | "medium" | "large"
  data?: any
}

const defaultWidgets: Widget[] = [
  {
    id: "projects-overview",
    title: "Visão Geral dos Projetos",
    type: "metric",
    size: "medium"
  },
  {
    id: "team-performance", 
    title: "Performance da Equipe",
    type: "chart",
    size: "large"
  },
  {
    id: "recent-activity",
    title: "Atividades Recentes",
    type: "activity", 
    size: "medium"
  },
  {
    id: "financial-summary",
    title: "Resumo Financeiro",
    type: "metric",
    size: "small"
  }
]

export default function PersonalizedDashboard() {
  const { projects } = useProjectStore()
  const { members } = useMemberStore()
  const { addNotification } = useToast()
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets)
  
  const activeProjects = projects.filter(p => p.status === 'in-progress')
  const completedProjects = projects.filter(p => p.status === 'completed')
  const activeMembers = members.filter(m => m.status === 'active')

  const MetricWidget = ({ widget }: { widget: Widget }) => {
    if (widget.id === "projects-overview") {
      return (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedProjects.length} projetos finalizados
            </p>
            <div className="mt-4 space-y-2">
              {activeProjects.slice(0, 3).map(project => (
                <div key={project.id} className="flex items-center space-x-2">
                  <Progress value={75} className="flex-1" />
                  <span className="text-xs">{project.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    }

    if (widget.id === "financial-summary") {
      return (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Crescimento constante</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  const ActivityWidget = ({ widget }: { widget: Widget }) => {
    const activities = [
      {
        id: "1",
        user: "Ana Silva",
        action: "completou o projeto",
        target: "Website E-commerce",
        time: "2 horas atrás",
        avatar: "/avatars/ana.jpg"
      },
      {
        id: "2", 
        user: "Carlos Oliveira",
        action: "criou nova tarefa",
        target: "API de Pagamentos",
        time: "4 horas atrás",
        avatar: "/avatars/carlos.jpg"
      },
      {
        id: "3",
        user: "Marina Costa",
        action: "enviou mensagem",
        target: "Chat da Equipe",
        time: "6 horas atrás",
        avatar: "/avatars/marina.jpg"
      }
    ]

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Atividades Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            Ver todas atividades
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  const ChartWidget = ({ widget }: { widget: Widget }) => {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Performance da Equipe</span>
          </CardTitle>
          <CardDescription>Métricas de produtividade semanal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.slice(0, 5).map(member => (
              <div key={member.id} className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{member.name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs">4.8</span>
                    </div>
                  </div>
                  <Progress value={Math.random() * 40 + 60} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "metric":
        return <MetricWidget widget={widget} />
      case "activity":
        return <ActivityWidget widget={widget} />
      case "chart":
        return <ChartWidget widget={widget} />
      default:
        return null
    }
  }

  const getGridCols = (size: string) => {
    switch (size) {
      case "small": return "col-span-1"
      case "medium": return "col-span-2"
      case "large": return "col-span-3"
      default: return "col-span-1"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Personalizado</h1>
            <p className="text-muted-foreground">
              Visão geral customizada dos seus projetos e equipe
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => addNotification({
              type: "info",
              message: "Configurações de widgets abertas",
              duration: 3000
            })}>
              <Settings className="mr-2 h-4 w-4" />
              Personalizar
            </Button>
            <Button onClick={() => addNotification({
              type: "success",
              message: "Novo widget adicionado ao dashboard",
              duration: 3000
            })}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Widget
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Quick Stats */}
      <FadeIn delay={200}>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeProjects.length} em andamento
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membros da Equipe</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeMembers.length} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prazo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4 sem</div>
              <p className="text-xs text-muted-foreground">
                Entrega de projetos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-muted-foreground">
                Avaliação dos clientes
              </p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Widget Grid */}
      <FadeIn delay={400}>
        <div className="grid gap-6 md:grid-cols-3">
          <StaggeredList delay={100}>
            {widgets.map(widget => (
              <div key={widget.id} className={getGridCols(widget.size)}>
                {renderWidget(widget)}
              </div>
            ))}
          </StaggeredList>
        </div>
      </FadeIn>
    </div>
  )
}
