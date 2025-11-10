"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Ticket,
  Plus,
  Filter,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Flag,
  Eye
} from "lucide-react"
import { useTicketStore } from "@/stores"
import { StatCard } from "@/components/common"

// Status and priority configurations
const statusConfig = {
  open: { label: "Aberto", color: "bg-blue-500", variant: "default" as const },
  "in-progress": { label: "Em Andamento", color: "bg-yellow-500", variant: "secondary" as const },
  resolved: { label: "Resolvido", color: "bg-green-500", variant: "default" as const },
  closed: { label: "Fechado", color: "bg-gray-500", variant: "outline" as const }
}

const priorityConfig = {
  low: { label: "Baixa", color: "text-gray-500" },
  medium: { label: "Média", color: "text-blue-500" },
  high: { label: "Alta", color: "text-orange-500" },
  urgent: { label: "Urgente", color: "text-red-500" }
}

const categoryConfig = {
  bug: { label: "Bug", color: "bg-red-100 text-red-800" },
  feature: { label: "Feature", color: "bg-blue-100 text-blue-800" },
  support: { label: "Suporte", color: "bg-green-100 text-green-800" },
  question: { label: "Pergunta", color: "bg-purple-100 text-purple-800" }
}

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default function TaskTicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)

  // Get tickets from Firebase store
  const { tickets, isLoading, fetchTickets } = useTicketStore()

  // Load tickets on component mount
  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  // Calculate ticket statistics
  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    urgent: tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length
  }

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchQuery || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets de Suporte</h1>
          <p className="text-muted-foreground">
            Gerencie tickets e solicitações de suporte
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Ticket</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo ticket de suporte
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Funcionalidade de criação de tickets será implementada em breve.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowNewTicketDialog(false)}>
                  Criar Ticket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Tickets"
          value={ticketStats.total.toString()}
          description="Todos os tickets"
          icon={Ticket}
        />

        <StatCard
          title="Tickets Abertos"
          value={ticketStats.open.toString()}
          description="Aguardando atendimento"
          icon={Clock}
          iconColor="text-blue-500"
        />

        <StatCard
          title="Em Andamento"
          value={ticketStats.inProgress.toString()}
          description="Sendo processados"
          icon={CheckCircle}
          iconColor="text-yellow-500"
        />

        <StatCard
          title="Urgentes"
          value={ticketStats.urgent.toString()}
          description="Prioridade alta"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="open">Aberto</SelectItem>
            <SelectItem value="in-progress">Em Andamento</SelectItem>
            <SelectItem value="resolved">Resolvido</SelectItem>
            <SelectItem value="closed">Fechado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="support">Suporte</SelectItem>
            <SelectItem value="question">Pergunta</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <Ticket className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum ticket encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      <Badge variant={statusConfig[ticket.status]?.variant || "default"}>
                        {statusConfig[ticket.status]?.label || ticket.status}
                      </Badge>
                      <Badge variant="outline" className={categoryConfig[ticket.category]?.color}>
                        {categoryConfig[ticket.category]?.label || ticket.category}
                      </Badge>
                    </div>
                    <CardDescription className="max-w-2xl">
                      {ticket.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${priorityConfig[ticket.priority]?.color}`}>
                      <Flag className="inline h-3 w-3 mr-1" />
                      {priorityConfig[ticket.priority]?.label || ticket.priority}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Criado: {formatDate(ticket.createdAt)}</span>
                    <span>Atualizado: {formatDate(ticket.updatedAt)}</span>
                    {ticket.assigneeId && (
                      <span>Responsável: {ticket.assigneeId}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Comentar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}