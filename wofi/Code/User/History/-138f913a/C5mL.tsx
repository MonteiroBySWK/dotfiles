"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Activity, 
  Clock, 
  User, 
  FileText, 
  MessageSquare, 
  GitCommit,
  Plus,
  CheckCircle,
  AlertCircle,
  Calendar,
  Filter,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FadeIn, StaggeredList } from "@/components/custom/animations"

type ActivityItem = {
  id: string
  type: "project" | "task" | "comment" | "commit" | "meeting" | "file"
  title: string
  description: string
  user: {
    name: string
    avatar: string
    role: string
  }
  timestamp: string
  project?: string
  status?: "success" | "warning" | "info" | "error"
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "task",
    title: "Tarefa concluída",
    description: "Implementação do sistema de autenticação",
    user: {
      name: "João Silva",
      avatar: "/avatars/joao.jpg",
      role: "Desenvolvedor"
    },
    timestamp: "2024-01-20T10:30:00Z",
    project: "Website Redesign",
    status: "success"
  },
  {
    id: "2",
    type: "comment",
    title: "Novo comentário",
    description: "Adicionou feedback sobre o design da homepage",
    user: {
      name: "Maria Santos",
      avatar: "/avatars/maria.jpg",
      role: "Designer"
    },
    timestamp: "2024-01-20T09:15:00Z",
    project: "Mobile App",
    status: "info"
  },
  {
    id: "3",
    type: "project",
    title: "Projeto atualizado",
    description: "Status alterado para 'Em Revisão'",
    user: {
      name: "Carlos Oliveira",
      avatar: "/avatars/carlos.jpg",
      role: "Project Manager"
    },
    timestamp: "2024-01-20T08:45:00Z",
    project: "E-commerce Platform",
    status: "warning"
  },
  {
    id: "4",
    type: "commit",
    title: "Novo commit",
    description: "feat: adicionar validação de formulários",
    user: {
      name: "Ana Costa",
      avatar: "/avatars/ana.jpg",
      role: "Desenvolvedor Frontend"
    },
    timestamp: "2024-01-19T16:20:00Z",
    project: "Dashboard Analytics",
    status: "info"
  },
  {
    id: "5",
    type: "meeting",
    title: "Reunião agendada",
    description: "Daily standup - Equipe de desenvolvimento",
    user: {
      name: "Pedro Ferreira",
      avatar: "/avatars/pedro.jpg",
      role: "Scrum Master"
    },
    timestamp: "2024-01-19T14:00:00Z",
    status: "info"
  },
  {
    id: "6",
    type: "file",
    title: "Arquivo enviado",
    description: "Mockups finais da interface mobile",
    user: {
      name: "Maria Santos",
      avatar: "/avatars/maria.jpg",
      role: "Designer"
    },
    timestamp: "2024-01-19T11:30:00Z",
    project: "Mobile App",
    status: "success"
  }
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "task": return CheckCircle
    case "comment": return MessageSquare
    case "project": return FileText
    case "commit": return GitCommit
    case "meeting": return Calendar
    case "file": return FileText
    default: return Activity
  }
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case "success": return "text-green-600 bg-green-50"
    case "warning": return "text-yellow-600 bg-yellow-50"
    case "error": return "text-red-600 bg-red-50"
    default: return "text-blue-600 bg-blue-50"
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return "Agora há pouco"
  if (diffInHours < 24) return `${diffInHours}h atrás`
  if (diffInHours < 48) return "Ontem"
  return date.toLocaleDateString()
}

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || activity.type === filterType
    const matchesUser = filterUser === "all" || activity.user.name === filterUser
    return matchesSearch && matchesType && matchesUser
  })

  const uniqueUsers = Array.from(new Set(mockActivities.map(a => a.user.name)))

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Atividade Recente</h1>
            <p className="text-muted-foreground">
              Acompanhe todas as atividades e atualizações da equipe
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Atividade
          </Button>
        </div>
      </FadeIn>

      {/* Filtros */}
      <FadeIn delay={100}>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar atividades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="task">Tarefas</SelectItem>
              <SelectItem value="comment">Comentários</SelectItem>
              <SelectItem value="project">Projetos</SelectItem>
              <SelectItem value="commit">Commits</SelectItem>
              <SelectItem value="meeting">Reuniões</SelectItem>
              <SelectItem value="file">Arquivos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueUsers.map(user => (
                <SelectItem key={user} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </FadeIn>

      {/* Estatísticas */}
      <FadeIn delay={200}>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividades Hoje</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+12% vs ontem</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">de 12 membros</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">nas últimas 24h</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commits</CardTitle>
              <GitCommit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">esta semana</p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Lista de Atividades */}
      <FadeIn delay={300}>
        <Card>
          <CardHeader>
            <CardTitle>Timeline de Atividades</CardTitle>
            <CardDescription>
              Histórico detalhado de todas as ações da equipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StaggeredList className="space-y-4">
              {filteredActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          {activity.project && (
                            <Badge variant="outline" className="mt-1">
                              {activity.project}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {formatTimestamp(activity.timestamp)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                          <AvatarFallback>
                            {activity.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{activity.user.name}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{activity.user.role}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </StaggeredList>
            
            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhuma atividade encontrada</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros de busca
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
