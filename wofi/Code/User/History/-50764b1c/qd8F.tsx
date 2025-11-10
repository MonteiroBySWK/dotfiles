"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Clock,
  Calendar,
  Play,
  Pause,
  StopCircle,
  Plus,
  Search,
  Download,
  Filter,
  Timer
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"

// Dados mockados de timesheet
const timesheetEntries = [
  {
    id: "1",
    employee: {
      name: "Ana Silva",
      role: "Product Manager",
      avatar: "/avatars/ana.jpg"
    },
    date: "2024-09-22",
    entries: [
      {
        id: "1-1",
        project: "Projeto Alpha",
        task: "Definição de requisitos",
        startTime: "09:00",
        endTime: "11:30",
        duration: 150, // em minutos
        status: "completed",
        description: "Reunião com stakeholders para definir escopo"
      },
      {
        id: "1-2",
        project: "Projeto Beta",
        task: "Planejamento de sprint",
        startTime: "14:00",
        endTime: "16:00",
        duration: 120,
        status: "completed",
        description: "Refinamento do backlog"
      },
      {
        id: "1-3",
        project: "Projeto Alpha",
        task: "Documentação",
        startTime: "16:30",
        endTime: null,
        duration: 45,
        status: "in_progress",
        description: "Criação de especificações técnicas"
      }
    ],
    totalHours: 5.25,
    targetHours: 8
  },
  {
    id: "2",
    employee: {
      name: "Carlos Santos",
      role: "Tech Lead",
      avatar: "/avatars/carlos.jpg"
    },
    date: "2024-09-22",
    entries: [
      {
        id: "2-1",
        project: "Projeto Alpha",
        task: "Desenvolvimento backend",
        startTime: "08:30",
        endTime: "12:00",
        duration: 210,
        status: "completed",
        description: "Implementação de APIs REST"
      },
      {
        id: "2-2",
        project: "Infraestrutura",
        task: "Code review",
        startTime: "13:00",
        endTime: "14:30",
        duration: 90,
        status: "completed",
        description: "Revisão de PRs da equipe"
      },
      {
        id: "2-3",
        project: "Projeto Beta",
        task: "Arquitetura",
        startTime: "15:00",
        endTime: "17:30",
        duration: 150,
        status: "completed",
        description: "Definição de arquitetura microserviços"
      }
    ],
    totalHours: 7.5,
    targetHours: 8
  },
  {
    id: "3",
    employee: {
      name: "Maria Oliveira",
      role: "Frontend Developer",
      avatar: "/avatars/maria.jpg"
    },
    date: "2024-09-22",
    entries: [
      {
        id: "3-1",
        project: "Projeto Alpha",
        task: "Desenvolvimento frontend",
        startTime: "09:00",
        endTime: "12:30",
        duration: 210,
        status: "completed",
        description: "Implementação de componentes React"
      },
      {
        id: "3-2",
        project: "Design System",
        task: "Componentes UI",
        startTime: "13:30",
        endTime: "16:00",
        duration: 150,
        status: "completed",
        description: "Criação de novos componentes"
      },
      {
        id: "3-3",
        project: "Projeto Beta",
        task: "Testes frontend",
        startTime: "16:15",
        endTime: "18:00",
        duration: 105,
        status: "completed",
        description: "Testes unitários e integração"
      }
    ],
    totalHours: 7.75,
    targetHours: 8
  }
]

const projects = [
  "Projeto Alpha",
  "Projeto Beta",
  "Design System",
  "Infraestrutura",
  "Treinamento",
  "Reuniões"
]

export default function TimesheetPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("today")
  const [projectFilter, setProjectFilter] = useState("all")
  const [employeeFilter, setEmployeeFilter] = useState("all")

  const filteredEntries = timesheetEntries.filter(entry => {
    const matchesSearch = entry.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.entries.some(e => 
                           e.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           e.task.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesProject = projectFilter === "all" || 
                          entry.entries.some(e => e.project === projectFilter)
    const matchesEmployee = employeeFilter === "all" || entry.employee.name === employeeFilter
    
    return matchesSearch && matchesProject && matchesEmployee
  })

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (hours === 0) return `${remainingMinutes}min`
    if (remainingMinutes === 0) return `${hours}h`
    return `${hours}h ${remainingMinutes}min`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "secondary"
      case "in_progress":
        return "default"
      case "paused":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "in_progress":
        return "Em andamento"
      case "paused":
        return "Pausado"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return StopCircle
      case "in_progress":
        return Play
      case "paused":
        return Pause
      default:
        return Clock
    }
  }

  const totalHoursToday = timesheetEntries.reduce((total, entry) => total + entry.totalHours, 0)
  const averageHours = totalHoursToday / timesheetEntries.length

  return (
    <>
      <PageHeader
        title="Timesheet da Equipe"
        description="Acompanhe o tempo trabalhado e produtividade da equipe"
        actions={[
          {
            label: "Exportar",
            icon: Download,
            onClick: () => console.log("Exportar timesheet")
          },
          {
            label: "Nova Entrada",
            icon: Plus,
            onClick: () => console.log("Nova entrada de tempo")
          }
        ]}
        badge={{
          label: `${totalHoursToday.toFixed(1)}h hoje`,
          variant: "secondary"
        }}
      />

      {/* Métricas Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Total Hoje</div>
            </div>
            <div className="text-2xl font-bold">{totalHoursToday.toFixed(1)}h</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Média por Pessoa</div>
            </div>
            <div className="text-2xl font-bold">{averageHours.toFixed(1)}h</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-green-600" />
              <div className="text-sm text-muted-foreground">Em Andamento</div>
            </div>
            <div className="text-2xl font-bold">
              {timesheetEntries.reduce((count, entry) => 
                count + entry.entries.filter(e => e.status === "in_progress").length, 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <StopCircle className="h-4 w-4 text-blue-600" />
              <div className="text-sm text-muted-foreground">Concluídas</div>
            </div>
            <div className="text-2xl font-bold">
              {timesheetEntries.reduce((count, entry) => 
                count + entry.entries.filter(e => e.status === "completed").length, 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar entradas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {projects.map(project => (
                <SelectItem key={project} value={project}>{project}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Funcionário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {timesheetEntries.map(entry => (
                <SelectItem key={entry.employee.name} value={entry.employee.name}>
                  {entry.employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Timesheet */}
      <div className="space-y-6">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.employee.avatar} />
                    <AvatarFallback>
                      {entry.employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{entry.employee.name}</CardTitle>
                    <CardDescription>
                      {entry.employee.role} • {new Date(entry.date).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">{entry.totalHours.toFixed(1)}h</div>
                  <div className="text-sm text-muted-foreground">
                    Meta: {entry.targetHours}h ({Math.round((entry.totalHours / entry.targetHours) * 100)}%)
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {entry.entries.map((timeEntry) => {
                  const StatusIcon = getStatusIcon(timeEntry.status)
                  
                  return (
                    <div key={timeEntry.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <StatusIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">{timeEntry.project}</div>
                          <Badge variant={getStatusColor(timeEntry.status)}>
                            {getStatusLabel(timeEntry.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {timeEntry.task}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {timeEntry.description}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="font-medium">
                          {formatDuration(timeEntry.duration)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {timeEntry.startTime} - {timeEntry.endTime || "..."}
                        </div>
                        {timeEntry.status === "in_progress" && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Button variant="outline" size="sm">
                              <Pause className="h-3 w-3 mr-1" />
                              Pausar
                            </Button>
                            <Button size="sm">
                              <StopCircle className="h-3 w-3 mr-1" />
                              Parar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Resumo do Dia */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {entry.entries.length} entrada{entry.entries.length !== 1 ? 's' : ''} registrada{entry.entries.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span>
                      Produtividade: <span className="font-medium">
                        {Math.round((entry.totalHours / entry.targetHours) * 100)}%
                      </span>
                    </span>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhuma entrada encontrada</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || projectFilter !== "all" || employeeFilter !== "all"
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Comece registrando o primeiro timesheet."}
          </p>
        </div>
      )}
    </>
  )
}
