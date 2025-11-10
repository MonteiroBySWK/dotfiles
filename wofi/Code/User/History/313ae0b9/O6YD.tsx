"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  Plus,
  Search,
  Phone
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

// Dados mockados de reuniões
const meetings = [
  {
    id: "1",
    title: "Daily Standup - Equipe Dev",
    description: "Reunião diária de acompanhamento do desenvolvimento",
    date: "2025-09-22",
    time: "09:00",
    duration: 30,
    type: "recurring",
    location: "Sala de Reuniões 1",
    isOnline: false,
    status: "scheduled",
    attendees: [
      { name: "Ana Silva", avatar: "/avatars/ana.jpg" },
      { name: "Carlos Santos", avatar: "/avatars/carlos.jpg" },
      { name: "Maria Oliveira", avatar: "/avatars/maria.jpg" }
    ],
    organizer: "João Manager"
  },
  {
    id: "2",
    title: "Review de Sprint",
    description: "Apresentação dos resultados da sprint atual",
    date: "2025-09-23",
    time: "14:00",
    duration: 60,
    type: "meeting",
    location: "Google Meet",
    isOnline: true,
    status: "scheduled",
    attendees: [
      { name: "Ana Silva", avatar: "/avatars/ana.jpg" },
      { name: "Carlos Santos", avatar: "/avatars/carlos.jpg" },
      { name: "Cliente Beta", avatar: "/avatars/cliente.jpg" }
    ],
    organizer: "Ana Silva"
  },
  {
    id: "3",
    title: "Planejamento Q4",
    description: "Definição de metas e objetivos para Q4",
    date: "2025-09-25",
    time: "10:00",
    duration: 120,
    type: "meeting",
    location: "Auditório Principal",
    isOnline: false,
    status: "scheduled",
    attendees: [
      { name: "João Manager", avatar: "/avatars/joao.jpg" },
      { name: "Ana Silva", avatar: "/avatars/ana.jpg" },
      { name: "Carlos Santos", avatar: "/avatars/carlos.jpg" },
      { name: "Maria Oliveira", avatar: "/avatars/maria.jpg" }
    ],
    organizer: "João Manager"
  },
  {
    id: "4",
    title: "1:1 com Ana",
    description: "Reunião individual de feedback e desenvolvimento",
    date: "2025-09-21",
    time: "15:30",
    duration: 45,
    type: "one-on-one",
    location: "Sala do Manager",
    isOnline: false,
    status: "completed",
    attendees: [
      { name: "Ana Silva", avatar: "/avatars/ana.jpg" }
    ],
    organizer: "João Manager"
  }
]

export default function MeetingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || meeting.type === typeFilter
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recurring":
        return "default"
      case "meeting":
        return "secondary"
      case "one-on-one":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "recurring":
        return "Recorrente"
      case "meeting":
        return "Reunião"
      case "one-on-one":
        return "1:1"
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendada"
      case "completed":
        return "Concluída"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
  }

  return (
    <PageContainer>
      <PageHeader
        title="Reuniões"
        description="Gerencie todas as suas reuniões e compromissos"
        actions={[
          {
            label: "Nova Reunião",
            icon: Plus,
            onClick: () => console.log("Agendar nova reunião")
          }
        ]}
        badge={{
          label: `${meetings.filter(m => m.status === "scheduled").length} agendadas`,
          variant: "secondary"
        }}
      />

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar reuniões..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="meeting">Reuniões</SelectItem>
              <SelectItem value="recurring">Recorrentes</SelectItem>
              <SelectItem value="one-on-one">1:1</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="scheduled">Agendadas</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Reuniões */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <Badge variant={getTypeColor(meeting.type)}>
                      {getTypeLabel(meeting.type)}
                    </Badge>
                    <Badge variant={getStatusColor(meeting.status)}>
                      {getStatusLabel(meeting.status)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {meeting.description}
                  </CardDescription>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {new Date(`${meeting.date}T${meeting.time}`).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {meeting.time} • {formatDuration(meeting.duration)}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Localização */}
                <div className="flex items-center text-sm text-muted-foreground">
                  {meeting.isOnline ? (
                    <Video className="h-4 w-4 mr-2" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  {meeting.location}
                </div>

                {/* Organizador */}
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground mr-2">Organizador:</span>
                  <span className="font-medium">{meeting.organizer}</span>
                </div>

                {/* Participantes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {meeting.attendees.length} participante{meeting.attendees.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex -space-x-2">
                      {meeting.attendees.slice(0, 3).map((attendee, index) => (
                        <Avatar key={index} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback className="text-xs">
                            {attendee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {meeting.attendees.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs font-medium">
                            +{meeting.attendees.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {meeting.isOnline && (
                      <Button variant="outline" size="sm">
                        <Video className="h-3 w-3 mr-1" />
                        Entrar
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    {meeting.status === "scheduled" && (
                      <Button size="sm">
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhuma reunião encontrada</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || typeFilter !== "all" || statusFilter !== "all"
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Comece agendando sua primeira reunião."}
          </p>
        </div>
      )}
    </PageContainer>
  )
}
