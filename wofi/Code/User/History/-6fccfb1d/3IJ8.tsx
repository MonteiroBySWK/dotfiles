"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { 
  CalendarDays,
  CheckCircle2,
  Clock,
  Flag,
  Plus,
  Star,
  Filter,
  Search,
} from "lucide-react"
import { FadeIn, StaggeredList } from "@/components/custom/animations"
import { StatCard } from "@/components/common"
import { useToast } from "@/components/custom/feedback"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTasks } from "@/hooks/useTasks"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { LoadingSpinner } from "@/components/custom/loading"
import { useProjects } from "@/hooks/useProjects"

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'text-red-600 bg-red-50'
    case 'high': return 'text-orange-600 bg-orange-50'
    case 'medium': return 'text-yellow-600 bg-yellow-50'
    case 'low': return 'text-green-600 bg-green-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50'
    case 'in-progress': return 'text-blue-600 bg-blue-50'
    case 'review': return 'text-purple-600 bg-purple-50'
    case 'todo': return 'text-gray-600 bg-gray-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Concluída'
    case 'in-progress': return 'Em Progresso'
    case 'review': return 'Em Revisão'
    case 'todo': return 'A Fazer'
    default: return status
  }
}

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'Urgente'
    case 'high': return 'Alta'
    case 'medium': return 'Média'
    case 'low': return 'Baixa'
    default: return priority
  }
}

export default function MyTasksPage() {
  const { user } = useFirebaseAuth()
  const { tasks: allTasks, isLoading, updateTask } = useTasks()
  const { projects } = useProjects()
  const { addNotification } = useToast()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showStarredOnly, setShowStarredOnly] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()

  const tasks = allTasks.filter(task => task.assigneeId === user?.uid)

  // Filtrar tarefas baseado nos filtros ativos
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesStarred = !showStarredOnly || (task as any).starred
    const matchesDate = !selectedDate || new Date(task.dueDate).toDateString() === selectedDate.toDateString()
    
    return matchesSearch && matchesStatus && matchesPriority && matchesStarred && matchesDate
  })

  // Calcular estatísticas
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    starred: tasks.filter(t => (t as any).starred).length,
    todayTasks: tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length
  }

  const toggleStarred = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      updateTask(taskId, { ...task, starred: !(task as any).starred } as any)
    }
  }

  const markAsCompleted = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed'
      updateTask(taskId, { 
        ...task, 
        status: newStatus,
        completedHours: newStatus === 'completed' ? task.estimatedHours : task.completedHours
      })
      
      addNotification({
        type: "success",
        message: "Status da tarefa atualizado!",
        duration: 3000
      })
    }
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name || "Projeto não encontrado"
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
              <AvatarFallback>
                {user?.displayName?.split(" ").map((n: string) => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Minhas Tarefas</h1>
              <p className="text-muted-foreground">
                Olá, {user?.displayName || "Usuário"}! Aqui estão suas tarefas pessoais
              </p>
            </div>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </FadeIn>

      {/* Estatísticas Pessoais */}
      <FadeIn delay={100}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <StatCard
            title="Total"
            value={stats.total}
            description="Tarefas atribuídas"
            icon={CheckCircle2}
          />
          
          <StatCard
            title="Concluídas"
            value={stats.completed}
            description={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% completo` : '0% completo'}
            icon={CheckCircle2}
            iconColor="text-green-600"
          />

          <StatCard
            title="Em Progresso"
            value={stats.inProgress}
            description="Ativas no momento"
            icon={Clock}
            iconColor="text-blue-600"
          />

          <StatCard
            title="Atrasadas"
            value={stats.overdue}
            description="Requerem atenção"
            icon={Flag}
            iconColor="text-red-600"
          />

          <StatCard
            title="Favoritas"
            value={stats.starred}
            description="Marcadas com estrela"
            icon={Star}
            iconColor="text-yellow-600"
          />

          <StatCard
            title="Para Hoje"
            value={stats.todayTasks}
            description="Prazo hoje"
            icon={CalendarDays}
            iconColor="text-purple-600"
          />
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filtros e Busca */}
        <div className="lg:col-span-3 space-y-4">
          <FadeIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Busca */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar suas tarefas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros */}
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="todo">A Fazer</SelectItem>
                    <SelectItem value="in-progress">Em Progresso</SelectItem>
                    <SelectItem value="review">Em Revisão</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={showStarredOnly ? "default" : "outline"}
                  size="icon"
                  onClick={() => setShowStarredOnly(!showStarredOnly)}
                  title="Mostrar apenas favoritas"
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Lista de Tarefas */}
          <FadeIn delay={300}>
            <StaggeredList className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsCompleted(task.id)}
                          className={`rounded-full ${task.status === 'completed' ? 'text-green-600 bg-green-50' : ''}`}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </Button>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleStarred(task.id)}
                              className="h-8 w-8"
                            >
                              <Star className={`h-4 w-4 ${(task as any).starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                            </Button>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>

                          <div className="flex items-center space-x-4 text-sm">
                            <Badge className={getStatusColor(task.status)}>
                              {getStatusLabel(task.status)}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {getPriorityLabel(task.priority)}
                            </Badge>
                            <span className="text-muted-foreground">{getProjectName(task.projectId)}</span>
                            <span className="text-muted-foreground flex items-center">
                              <CalendarDays className="mr-1 h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          </div>

                          {task.estimatedHours && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {task.completedHours || 0}h de {task.estimatedHours}h estimadas
                              </span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${((task.completedHours || 0) / task.estimatedHours) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1">
                            {task.tags?.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </StaggeredList>

            {filteredTasks.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa encontrada</h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery || statusFilter !== "all" || priorityFilter !== "all" 
                      ? "Tente ajustar os filtros de busca" 
                      : "Você não tem tarefas atribuídas no momento"}
                  </p>
                </CardContent>
              </Card>
            )}
          </FadeIn>
        </div>

        {/* Sidebar com Calendário */}
        <div className="space-y-6">
          <FadeIn delay={400}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendário</CardTitle>
                <CardDescription>Clique em uma data para filtrar</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0"
                />
                {selectedDate && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedDate(undefined)}
                    className="w-full mt-2"
                  >
                    Limpar filtro de data
                  </Button>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={500}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Produtividade</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  
                  <div className="flex justify-between text-sm mt-4">
                    <span>Horas trabalhadas</span>
                    <span className="font-medium">32h / 40h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
