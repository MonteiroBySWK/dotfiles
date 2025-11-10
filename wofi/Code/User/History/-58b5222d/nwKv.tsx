"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Dados mock de eventos
const events = [
  {
    id: 1,
    title: "Reunião de Kickoff - Projeto TechCorp",
    date: "2024-01-22",
    time: "09:00",
    duration: "2 horas",
    type: "meeting",
    attendees: ["Maria Silva", "João Santos", "Ana Costa"],
    location: "Sala de Reuniões 1",
    description: "Reunião inicial para alinhamento do projeto TechCorp",
    status: "confirmed",
    isOnline: false
  },
  {
    id: 2,
    title: "Entrega Sprint 3 - Mobile App",
    date: "2024-01-23",
    time: "17:00",
    duration: "1 hora",
    type: "deadline",
    project: "Mobile App",
    description: "Deadline para entrega das funcionalidades da Sprint 3",
    status: "pending",
    priority: "high"
  },
  {
    id: 3,
    title: "Daily Standup",
    date: "2024-01-24",
    time: "09:30",
    duration: "30 min",
    type: "meeting",
    attendees: ["Equipe Desenvolvimento"],
    isOnline: true,
    recurring: "daily",
    description: "Daily standup da equipe de desenvolvimento",
    status: "confirmed"
  },
  {
    id: 4,
    title: "Review de Código",
    date: "2024-01-24",
    time: "14:00",
    duration: "1 hora",
    type: "review",
    attendees: ["Carlos Oliveira", "Tech Lead"],
    description: "Review do código desenvolvido na última sprint",
    status: "confirmed"
  },
  {
    id: 5,
    title: "Apresentação para Cliente",
    date: "2024-01-25",
    time: "15:00",
    duration: "1.5 horas",
    type: "presentation",
    attendees: ["Cliente StartupXYZ", "Gerente de Projeto"],
    location: "Videoconferência",
    isOnline: true,
    description: "Apresentação do progresso do projeto para o cliente",
    status: "confirmed"
  },
  {
    id: 6,
    title: "Planning da Próxima Sprint",
    date: "2024-01-26",
    time: "10:00",
    duration: "3 horas",
    type: "planning",
    attendees: ["Toda a Equipe"],
    description: "Planejamento das atividades da próxima sprint",
    status: "tentative"
  }
]

const eventTypes = {
  meeting: { label: "Reunião", color: "bg-blue-500", icon: Users },
  deadline: { label: "Prazo", color: "bg-red-500", icon: Clock },
  review: { label: "Review", color: "bg-purple-500", icon: CalendarIcon },
  presentation: { label: "Apresentação", color: "bg-green-500", icon: Video },
  planning: { label: "Planejamento", color: "bg-orange-500", icon: CalendarIcon }
}

const statusMap = {
  confirmed: { label: "Confirmado", color: "bg-green-100 text-green-800" },
  tentative: { label: "Tentativo", color: "bg-yellow-100 text-yellow-800" },
  pending: { label: "Pendente", color: "bg-gray-100 text-gray-800" }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)

  // Função para gerar dias do mês
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date)
  }

  const getTodayEvents = () => {
    const today = formatDate(new Date())
    return events.filter(event => event.date === today)
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    return events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
          <p className="text-muted-foreground">
            Gerencie seus eventos, reuniões e prazos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Dia</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Evento</DialogTitle>
                <DialogDescription>
                  Adicione um novo evento ao seu calendário
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" placeholder="Nome do evento" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="time">Horário</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Reunião</SelectItem>
                      <SelectItem value="deadline">Prazo</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="presentation">Apresentação</SelectItem>
                      <SelectItem value="planning">Planejamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" placeholder="Detalhes do evento" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsCreateEventOpen(false)}>
                    Criar Evento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendário Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dateStr = formatDate(day)
                  const dayEvents = getEventsForDate(dateStr)
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                  const isToday = dateStr === formatDate(new Date())
                  const isSelected = dateStr === selectedDate

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-24 p-1 border rounded-lg cursor-pointer transition-colors
                        ${isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                        ${isToday ? 'ring-2 ring-primary' : ''}
                        ${isSelected ? 'bg-primary/10' : ''}
                        hover:bg-muted/50
                      `}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      <div className={`text-sm font-medium ${isCurrentMonth ? '' : 'text-muted-foreground'}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => {
                          const eventType = eventTypes[event.type as keyof typeof eventTypes]
                          return (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded text-white truncate ${eventType.color}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          )
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Eventos */}
        <div className="space-y-4">
          {/* Eventos de Hoje */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hoje</CardTitle>
              <CardDescription>
                {getTodayEvents().length} eventos agendados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {getTodayEvents().length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum evento hoje</p>
              ) : (
                getTodayEvents().map(event => {
                  const eventType = eventTypes[event.type as keyof typeof eventTypes]
                  const Icon = eventType.icon
                  return (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className={`p-2 rounded-full ${eventType.color}`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {event.time} ({event.duration})
                        </div>
                        {event.isOnline && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <Video className="h-3 w-3" />
                            Online
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Próximos Eventos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getUpcomingEvents().map(event => {
                const eventType = eventTypes[event.type as keyof typeof eventTypes]
                const status = statusMap[event.status as keyof typeof statusMap]
                return (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className={`w-2 h-2 rounded-full mt-2 ${eventType.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <Badge variant="outline" className={`text-xs mt-1 ${status.color}`}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Eventos esta semana</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reuniões pendentes</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Prazos próximos</span>
                <span className="font-medium text-red-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taxa de comparecimento</span>
                <span className="font-medium text-green-600">98%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
