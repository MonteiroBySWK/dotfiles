"use client"

import { useState, useEffect } from "react"
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
import { LoadingOverlay } from "@/components/custom/loading"

// Firebase stores
import { 
  useDashboardStore, 
  useProjectStore, 
  useTaskStore, 
  useUserStore,
  useNotificationStore
} from "@/stores"

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

  // Firebase stores
  const { 
    loading: dashboardLoading, 
    initializeDashboard
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
    users,
    loading: userLoading,
    fetchUsers
  } = useUserStore()

  const {
    notifications,
    loading: notifyLoading,
    fetchNotifications
  } = useNotificationStore()

  const isLoading = dashboardLoading || projectLoading || taskLoading || userLoading || notifyLoading

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          initializeDashboard(),
          fetchProjects(),
          fetchTasks(),
          fetchUsers(),
          fetchNotifications()
        ])
      } catch (error) {
        console.error('Failed to load activity data:', error)
      }
    }
    
    loadData()
  }, [initializeDashboard, fetchProjects, fetchTasks, fetchUsers, fetchNotifications])

  // Generate activities from real Firebase data
  const generateActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = []
    
    // Add project activities
    projects.forEach(project => {
      const user = users.find(u => u.id === project.managerId) || {
        name: "Usuário Desconhecido",
        email: "",
        avatar: "/avatars/default.jpg",
        role: "manager"
      }
      
      activities.push({
        id: `project-${project.id}`,
        type: "project",
        title: `Projeto ${project.status === 'completed' ? 'concluído' : 'atualizado'}`,
        description: project.name,
        user: {
          name: user.name,
          avatar: user.avatar || "/avatars/default.jpg",
          role: user.role
        },
        timestamp: project.updatedAt.toISOString(),
        project: project.name,
        status: project.status === 'completed' ? 'success' : 
                project.status === 'active' ? 'info' : 
                project.status === 'on-hold' ? 'warning' : 'info'
      })
    })

    // Add task activities
    tasks.forEach(task => {
      const user = users.find(u => u.id === task.assigneeId) || {
        name: "Usuário Desconhecido",
        email: "",
        avatar: "/avatars/default.jpg",
        role: "developer"
      }
      
      const project = projects.find(p => p.id === task.projectId)
      
      activities.push({
        id: `task-${task.id}`,
        type: "task",
        title: task.status === 'completed' ? 'Tarefa concluída' : 'Tarefa atualizada',
        description: task.title,
        user: {
          name: user.name,
          avatar: user.avatar || "/avatars/default.jpg",
          role: user.role
        },
        timestamp: task.updatedAt.toISOString(),
        project: project?.name,
        status: task.status === 'completed' ? 'success' : 
                task.status === 'in-progress' ? 'info' : 
                task.priority === 'urgent' ? 'warning' : 'info'
      })
    })

    // Add notification activities  
    notifications.forEach(notification => {
      const user = users.find(u => u.id === notification.userId) || {
        name: "Sistema",
        email: "",
        avatar: "/avatars/default.jpg",
        role: "system"
      }
      
      activities.push({
        id: `notification-${notification.id}`,
        type: "comment",
        title: notification.title,
        description: notification.message,
        user: {
          name: user.name,
          avatar: user.avatar || "/avatars/default.jpg",
          role: user.role
        },
        timestamp: notification.createdAt.toISOString(),
        status: notification.type === 'error' ? 'error' : 
                notification.type === 'warning' ? 'warning' : 
                notification.type === 'success' ? 'success' : 'info'
      })
    })

    // Sort by timestamp (most recent first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const allActivities = generateActivities()

  const filteredActivities = allActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || activity.type === filterType
    const matchesUser = filterUser === "all" || activity.user.name === filterUser
    return matchesSearch && matchesType && matchesUser
  })

  const uniqueUsers = Array.from(new Set(allActivities.map(a => a.user.name)))

  return (
    <LoadingOverlay isLoading={isLoading} message="Carregando atividades...">
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
              <div className="text-2xl font-bold">{allActivities.length}</div>
              <p className="text-xs text-muted-foreground">total de atividades</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">de {users.length} membros</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'completed').length}</div>
              <p className="text-xs text-muted-foreground">de {tasks.length} tarefas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <GitCommit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">de {projects.length} projetos</p>
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
