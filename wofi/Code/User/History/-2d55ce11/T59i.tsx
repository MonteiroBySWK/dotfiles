"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar,
  Clock,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  Star,
  Search,
  Filter,
  CalendarDays,
  Zap,
  TrendingUp,
  Users
} from "lucide-react"
import { FadeIn, StaggeredList } from "@/components/custom/animations"
import { StatCard } from "@/components/common"
import { useAuthStore } from "@/stores/authStore"
import { useToast } from "@/components/custom/feedback"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimelineEvent {
  id: string
  type: 'task_created' | 'task_started' | 'task_completed' | 'task_updated' | 'comment_added' | 'file_uploaded' | 'milestone_reached'
  title: string
  description: string
  timestamp: string
  user: {
    name: string
    avatar?: string
    id: string
  }
  task?: {
    id: string
    title: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    project: string
  }
  metadata?: {
    oldStatus?: string
    newStatus?: string
    changes?: string[]
    fileName?: string
    milestone?: string
  }
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "task_completed",
    title: "Tarefa concluída: Sistema de autenticação",
    description: "Implementação completa do sistema de login e registro com Firebase Auth",
    timestamp: "2025-09-23T14:30:00Z",
    user: { name: "João Silva", avatar: "/avatars/joao.jpg", id: "1" },
    task: {
      id: "task-1",
      title: "Sistema de autenticação",
      priority: "high",
      project: "Dashboard Core"
    }
  },
  {
    id: "2",
    type: "comment_added",
    title: "Novo comentário adicionado",
    description: "Revisão do código concluída. Algumas sugestões de melhorias foram adicionadas.",
    timestamp: "2025-09-23T13:45:00Z",
    user: { name: "Maria Santos", avatar: "/avatars/maria.jpg", id: "2" },
    task: {
      id: "task-2",
      title: "Code review: Componentes UI",
      priority: "medium",
      project: "UI Components"
    }
  },
  {
    id: "3",
    type: "task_started",
    title: "Tarefa iniciada: Otimização de performance",
    description: "Começou a trabalhar na otimização das queries do dashboard",
    timestamp: "2025-09-23T12:15:00Z",
    user: { name: "Carlos Lima", avatar: "/avatars/carlos.jpg", id: "3" },
    task: {
      id: "task-3",
      title: "Otimização de queries",
      priority: "high",
      project: "Performance"
    }
  },
  {
    id: "4",
    type: "file_uploaded",
    title: "Arquivo enviado",
    description: "Mockups finais da interface mobile foram enviados para revisão",
    timestamp: "2025-09-23T11:30:00Z",
    user: { name: "Ana Costa", avatar: "/avatars/ana.jpg", id: "4" },
    task: {
      id: "task-4",
      title: "Design mobile interface",
      priority: "medium",
      project: "Mobile App"
    },
    metadata: {
      fileName: "mobile-mockups-final.fig"
    }
  },
  {
    id: "5",
    type: "milestone_reached",
    title: "Marco alcançado: MVP Beta",
    description: "Primeira versão beta do MVP foi completada com sucesso",
    timestamp: "2025-09-23T10:00:00Z",
    user: { name: "Pedro Santos", avatar: "/avatars/pedro.jpg", id: "5" },
    metadata: {
      milestone: "MVP Beta Release"
    }
  },
  {
    id: "6",
    type: "task_updated",
    title: "Tarefa atualizada: Status alterado",
    description: "Status da tarefa foi alterado de 'Em Progresso' para 'Em Revisão'",
    timestamp: "2025-09-23T09:20:00Z",
    user: { name: "Lucas Ferreira", avatar: "/avatars/lucas.jpg", id: "6" },
    task: {
      id: "task-5",
      title: "Implementar sistema de tags",
      priority: "medium",
      project: "Core Features"
    },
    metadata: {
      oldStatus: "Em Progresso",
      newStatus: "Em Revisão"
    }
  },
  {
    id: "7",
    type: "task_created",
    title: "Nova tarefa criada: Testes automatizados",
    description: "Criada nova tarefa para implementar suite completa de testes automatizados",
    timestamp: "2025-09-23T08:45:00Z",
    user: { name: "Roberto Tech", avatar: "/avatars/roberto.jpg", id: "7" },
    task: {
      id: "task-6",
      title: "Suite de testes automatizados",
      priority: "high",
      project: "Quality Assurance"
    }
  },
  {
    id: "8",
    type: "task_completed",
    title: "Tarefa concluída: Setup CI/CD",
    description: "Pipeline de CI/CD configurado com GitHub Actions e deploy automático",
    timestamp: "2025-09-22T16:30:00Z",
    user: { name: "Fernanda Ops", avatar: "/avatars/fernanda.jpg", id: "8" },
    task: {
      id: "task-7",
      title: "Configurar CI/CD pipeline",
      priority: "urgent",
      project: "DevOps"
    }
  }
]

const getEventIcon = (type: string) => {
  switch (type) {
    case 'task_created': return PlayCircle
    case 'task_started': return Clock
    case 'task_completed': return CheckCircle2
    case 'task_updated': return AlertCircle
    case 'comment_added': return Star
    case 'file_uploaded': return Calendar
    case 'milestone_reached': return TrendingUp
    default: return Clock
  }
}

const getEventColor = (type: string) => {
  switch (type) {
    case 'task_created': return 'bg-blue-100 border-blue-200 text-blue-700'
    case 'task_started': return 'bg-yellow-100 border-yellow-200 text-yellow-700'
    case 'task_completed': return 'bg-green-100 border-green-200 text-green-700'
    case 'task_updated': return 'bg-purple-100 border-purple-200 text-purple-700'
    case 'comment_added': return 'bg-indigo-100 border-indigo-200 text-indigo-700'
    case 'file_uploaded': return 'bg-cyan-100 border-cyan-200 text-cyan-700'
    case 'milestone_reached': return 'bg-rose-100 border-rose-200 text-rose-700'
    default: return 'bg-gray-100 border-gray-200 text-gray-700'
  }
}

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case 'task_created': return 'Tarefa Criada'
    case 'task_started': return 'Tarefa Iniciada'
    case 'task_completed': return 'Tarefa Concluída'
    case 'task_updated': return 'Tarefa Atualizada'
    case 'comment_added': return 'Comentário'
    case 'file_uploaded': return 'Arquivo Enviado'
    case 'milestone_reached': return 'Marco Alcançado'
    default: return 'Evento'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return "Agora há pouco"
  if (diffInHours < 24) return `${diffInHours}h atrás`
  if (diffInHours < 48) return "Ontem"
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function TimelinePage() {
  const { user } = useAuthStore()
  const { addNotification } = useToast()
  const [events, setEvents] = useState<TimelineEvent[]>(mockTimelineEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  // Filtrar eventos
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || event.type === typeFilter
    const matchesUser = userFilter === "all" || event.user.id === userFilter
    
    let matchesDate = true
    if (dateRange !== "all") {
      const eventDate = new Date(event.timestamp)
      const now = new Date()
      const diffInDays = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (dateRange) {
        case "today":
          matchesDate = diffInDays === 0
          break
        case "week":
          matchesDate = diffInDays <= 7
          break
        case "month":
          matchesDate = diffInDays <= 30
          break
      }
    }
    
    return matchesSearch && matchesType && matchesUser && matchesDate
  })

  // Calcular estatísticas
  const stats = {
    totalEvents: events.length,
    todayEvents: events.filter(e => {
      const eventDate = new Date(e.timestamp)
      const today = new Date()
      return eventDate.toDateString() === today.toDateString()
    }).length,
    completedTasks: events.filter(e => e.type === 'task_completed').length,
    activeUsers: new Set(events.map(e => e.user.id)).size,
    milestonesReached: events.filter(e => e.type === 'milestone_reached').length
  }

  const uniqueUsers = Array.from(new Set(events.map(e => e.user.name)))

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Timeline de Atividades</h1>
            <p className="text-muted-foreground">
              Acompanhe todas as atividades e eventos do projeto em tempo real
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Exportar Timeline
            </Button>
            <Button>
              <CalendarDays className="mr-2 h-4 w-4" />
              Ver Calendário
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Estatísticas */}
      <FadeIn delay={100}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Eventos Hoje"
            value={stats.todayEvents}
            description="Atividades registradas"
            icon={Zap}
            iconColor="text-blue-600"
          />
          
          <StatCard
            title="Total de Eventos"
            value={stats.totalEvents}
            description="Histórico completo"
            icon={Calendar}
            iconColor="text-purple-600"
          />

          <StatCard
            title="Tarefas Concluídas"
            value={stats.completedTasks}
            description="Neste período"
            icon={CheckCircle2}
            iconColor="text-green-600"
          />

          <StatCard
            title="Usuários Ativos"
            value={stats.activeUsers}
            description="Contribuindo hoje"
            icon={Users}
            iconColor="text-orange-600"
          />

          <StatCard
            title="Marcos Alcançados"
            value={stats.milestonesReached}
            description="Objetivos cumpridos"
            icon={TrendingUp}
            iconColor="text-rose-600"
          />
        </div>
      </FadeIn>

      {/* Filtros */}
      <FadeIn delay={200}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar atividades, usuários ou tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="task_created">Tarefa criada</SelectItem>
                <SelectItem value="task_started">Tarefa iniciada</SelectItem>
                <SelectItem value="task_completed">Tarefa concluída</SelectItem>
                <SelectItem value="task_updated">Tarefa atualizada</SelectItem>
                <SelectItem value="comment_added">Comentário</SelectItem>
                <SelectItem value="file_uploaded">Arquivo enviado</SelectItem>
                <SelectItem value="milestone_reached">Marco alcançado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos usuários</SelectItem>
                {uniqueUsers.map(userName => (
                  <SelectItem key={userName} value={events.find(e => e.user.name === userName)?.user.id || userName}>
                    {userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo período</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FadeIn>

      {/* Timeline */}
      <FadeIn delay={300}>
        <div className="relative">
          {/* Linha vertical da timeline */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          <StaggeredList className="space-y-6">
            {filteredEvents.map((event, index) => {
              const IconComponent = getEventIcon(event.type)
              
              return (
                <div key={event.id} className="relative flex items-start space-x-6">
                  {/* Ícone do evento */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 bg-background flex items-center justify-center z-10 ${getEventColor(event.type)}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>

                  {/* Conteúdo do evento */}
                  <Card className="flex-1 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Header do evento */}
                          <div className="flex items-center space-x-3">
                            <Badge className={getEventColor(event.type)}>
                              {getEventTypeLabel(event.type)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatTimestamp(event.timestamp)}
                            </span>
                          </div>

                          {/* Título e descrição */}
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                            <p className="text-muted-foreground">{event.description}</p>
                          </div>

                          {/* Informações da tarefa (se aplicável) */}
                          {event.task && (
                            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-md">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getPriorityColor(event.task.priority)}`} />
                                <span className="font-medium">{event.task.title}</span>
                              </div>
                              <Badge variant="outline">{event.task.project}</Badge>
                            </div>
                          )}

                          {/* Metadata adicional */}
                          {event.metadata && (
                            <div className="text-sm text-muted-foreground space-y-1">
                              {event.metadata.fileName && (
                                <div>Arquivo: <span className="font-medium">{event.metadata.fileName}</span></div>
                              )}
                              {event.metadata.milestone && (
                                <div>Marco: <span className="font-medium">{event.metadata.milestone}</span></div>
                              )}
                              {event.metadata.oldStatus && event.metadata.newStatus && (
                                <div>
                                  Status: <span className="font-medium">{event.metadata.oldStatus}</span> → <span className="font-medium">{event.metadata.newStatus}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Usuário responsável */}
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={event.user.avatar} alt={event.user.name} />
                              <AvatarFallback className="text-xs">
                                {event.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{event.user.name}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </StaggeredList>

          {/* Mensagem quando não há eventos */}
          {filteredEvents.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
                <p className="text-muted-foreground text-center">
                  {searchQuery || typeFilter !== "all" || userFilter !== "all" || dateRange !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : "Não há eventos registrados no momento"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </FadeIn>

      {/* Resumo no rodapé */}
      <FadeIn delay={400}>
        <div className="border-t pt-4 mt-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-6">
              <span>Mostrando {filteredEvents.length} de {events.length} eventos</span>
              <span>Período: {dateRange === "all" ? "Todo histórico" : dateRange === "today" ? "Hoje" : dateRange === "week" ? "Esta semana" : "Este mês"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}