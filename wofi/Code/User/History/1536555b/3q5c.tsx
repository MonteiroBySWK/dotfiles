"use client""use client"



import { useState, useEffect } from "react"import { useState, useEffect } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"import { Input } from "@/components/ui/input"

import { Badge } from "@/components/ui/badge"import { Badge } from "@/components/ui/badge"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {import {

  Select,  Select,

  SelectContent,  SelectContent,

  SelectItem,  SelectItem,

  SelectTrigger,  SelectTrigger,

  SelectValue,  SelectValue,

} from "@/components/ui/select"} from "@/components/ui/select"

import {import {

  Dialog,  Dialog,

  DialogContent,  DialogContent,

  DialogDescription,  DialogDescription,

  DialogFooter,  DialogFooter,

  DialogHeader,  DialogHeader,

  DialogTitle,  DialogTitle,

  DialogTrigger,  DialogTrigger,

} from "@/components/ui/dialog"} from "@/components/ui/dialog"

import { import { 

  Ticket,  Ticket,

  Plus,  Plus,

  Filter,  Filter,

  Search,  Search,

  Clock,  Clock,

  AlertTriangle,  AlertTriangle,

  CheckCircle,  CheckCircle,

  XCircle,  XCircle,

  MessageSquare,  MessageSquare,

  User,  User,

  Flag,  Flag,

  Eye  Eye

} from "lucide-react"} from "lucide-react"

import { useTicketStore } from "@/stores"import { useTicketStore } from "@/stores"

import { StatCard } from "@/components/common"import { StatCard } from "@/components/common"



// Status and priority configurations// Status and priority configurations

const statusConfig = {const statusConfig = {

  open: { label: "Aberto", color: "bg-blue-500", variant: "default" as const },  open: { label: "Aberto", color: "bg-blue-500", variant: "default" as const },

  "in-progress": { label: "Em Andamento", color: "bg-yellow-500", variant: "secondary" as const },  "in-progress": { label: "Em Andamento", color: "bg-yellow-500", variant: "secondary" as const },

  resolved: { label: "Resolvido", color: "bg-green-500", variant: "default" as const },  resolved: { label: "Resolvido", color: "bg-green-500", variant: "default" as const },

  closed: { label: "Fechado", color: "bg-gray-500", variant: "outline" as const }  closed: { label: "Fechado", color: "bg-gray-500", variant: "outline" as const }

}}



const priorityConfig = {const priorityConfig = {

  low: { label: "Baixa", color: "text-gray-500" },  low: { label: "Baixa", color: "text-gray-500" },

  medium: { label: "Média", color: "text-blue-500" },  medium: { label: "Média", color: "text-blue-500" },

  high: { label: "Alta", color: "text-orange-500" },  high: { label: "Alta", color: "text-orange-500" },

  urgent: { label: "Urgente", color: "text-red-500" }  urgent: { label: "Urgente", color: "text-red-500" }

}}



const categoryConfig = {const categoryConfig = {

  bug: { label: "Bug", color: "bg-red-100 text-red-800" },  bug: { label: "Bug", color: "bg-red-100 text-red-800" },

  feature: { label: "Feature", color: "bg-blue-100 text-blue-800" },  feature: { label: "Feature", color: "bg-blue-100 text-blue-800" },

  support: { label: "Suporte", color: "bg-green-100 text-green-800" },  support: { label: "Suporte", color: "bg-green-100 text-green-800" },

  question: { label: "Pergunta", color: "bg-purple-100 text-purple-800" }  question: { label: "Pergunta", color: "bg-purple-100 text-purple-800" }

}}



const formatDate = (date: Date | string) => {const formatDate = (date: Date | string) => {

  const dateObj = typeof date === 'string' ? new Date(date) : date  const dateObj = typeof date === 'string' ? new Date(date) : date

  return dateObj.toLocaleDateString("pt-BR", {  return dateObj.toLocaleDateString("pt-BR", {

    day: "2-digit",    day: "2-digit",

    month: "2-digit",     month: "2-digit", 

    year: "numeric",    year: "numeric",

    hour: "2-digit",    hour: "2-digit",

    minute: "2-digit"    minute: "2-digit"

  })  })

}}



export default function TaskTicketsPage() {export default function TaskTicketsPage() {

  const [searchQuery, setSearchQuery] = useState("")  const [searchQuery, setSearchQuery] = useState("")

  const [statusFilter, setStatusFilter] = useState("all")  const [statusFilter, setStatusFilter] = useState("all")

  const [priorityFilter, setPriorityFilter] = useState("all")  const [priorityFilter, setPriorityFilter] = useState("all")

  const [categoryFilter, setCategoryFilter] = useState("all")  const [categoryFilter, setCategoryFilter] = useState("all")

  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)



  // Get tickets from Firebase store  // Get tickets from Firebase store

  const { tickets, loading, fetchTickets } = useTicketStore()  const { tickets, loading, fetchTickets } = useTicketStore()



  // Load tickets on component mount  // Load tickets on component mount

  useEffect(() => {  useEffect(() => {

    fetchTickets()    fetchTickets()

  }, [fetchTickets])  }, [fetchTickets])



  // Calculate ticket statistics  // Calculate ticket statistics

  const ticketStats = {  const ticketStats = {

    total: tickets.length,    total: tickets.length,

    open: tickets.filter(t => t.status === "open").length,    open: tickets.filter(t => t.status === "open").length,

    inProgress: tickets.filter(t => t.status === "in-progress").length,    inProgress: tickets.filter(t => t.status === "in-progress").length,

    urgent: tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length    urgent: tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length

  }  }



  // Filter tickets  // Filter tickets

  const filteredTickets = tickets.filter(ticket => {  const filteredTickets = tickets.filter(ticket => {

    const matchesSearch = !searchQuery ||     const matchesSearch = !searchQuery || 

      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||

      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())

        

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter

        

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory    return matchesSearch && matchesStatus && matchesPriority && matchesCategory

  })  })



  if (loading) {  if (loading) {

    return (    return (

      <div className="flex-1 space-y-6 p-6">      <div className="flex-1 space-y-6 p-6">

        <div className="animate-pulse space-y-4">        <div className="animate-pulse space-y-4">

          <div className="h-8 bg-gray-200 rounded w-64"></div>          <div className="h-8 bg-gray-200 rounded w-64"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {Array.from({ length: 4 }).map((_, i) => (            {Array.from({ length: 4 }).map((_, i) => (

              <div key={i} className="h-32 bg-gray-200 rounded"></div>              <div key={i} className="h-32 bg-gray-200 rounded"></div>

            ))}            ))}

          </div>          </div>

        </div>        </div>

      </div>      </div>

    )    )

  }  }



  return (  return (

    <div className="flex-1 space-y-6 p-6">    <div className="flex-1 space-y-6 p-6">

      {/* Header */}      {/* Header */}

      <div className="flex items-center justify-between">      <div className="flex items-center justify-between">

        <div>        <div>

          <h1 className="text-3xl font-bold tracking-tight">Tickets de Suporte</h1>          <h1 className="text-3xl font-bold tracking-tight">Tickets de Suporte</h1>

          <p className="text-muted-foreground">          <p className="text-muted-foreground">

            Gerencie tickets e solicitações de suporte            Gerencie tickets e solicitações de suporte

          </p>          </p>

        </div>        </div>

        <div className="flex gap-2">        <div className="flex gap-2">

          <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>          <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>

            <DialogTrigger asChild>            <DialogTrigger asChild>

              <Button>              <Button>

                <Plus className="mr-2 h-4 w-4" />                <Plus className="mr-2 h-4 w-4" />

                Novo Ticket                Novo Ticket

              </Button>              </Button>

            </DialogTrigger>            </DialogTrigger>

            <DialogContent>            <DialogContent>

              <DialogHeader>              <DialogHeader>

                <DialogTitle>Criar Novo Ticket</DialogTitle>                <DialogTitle>Criar Novo Ticket</DialogTitle>

                <DialogDescription>                <DialogDescription>

                  Preencha as informações do novo ticket de suporte                  Preencha as informações do novo ticket de suporte

                </DialogDescription>                </DialogDescription>

              </DialogHeader>              </DialogHeader>

              <div className="space-y-4">              <div className="space-y-4">

                <p className="text-sm text-gray-500">                <p className="text-sm text-gray-500">

                  Funcionalidade de criação de tickets será implementada em breve.                  Funcionalidade de criação de tickets será implementada em breve.

                </p>                </p>

              </div>              </div>

              <DialogFooter>              <DialogFooter>

                <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>                <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>

                  Cancelar                  Cancelar

                </Button>                </Button>

                <Button onClick={() => setShowNewTicketDialog(false)}>                <Button onClick={() => setShowNewTicketDialog(false)}>

                  Criar Ticket                  Criar Ticket

                </Button>                </Button>

              </DialogFooter>              </DialogFooter>

            </DialogContent>            </DialogContent>

          </Dialog>          </Dialog>

        </div>        </div>

      </div>      </div>



      {/* Statistics */}      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard        <StatCard

          title="Total de Tickets"          title="Total de Tickets"

          value={ticketStats.total.toString()}          value={ticketStats.total.toString()}

          description="Todos os tickets"          description="Todos os tickets"

          icon={Ticket}          icon={Ticket}

        />        />



        <StatCard        <StatCard

          title="Tickets Abertos"          title="Tickets Abertos"

          value={ticketStats.open.toString()}          value={ticketStats.open.toString()}

          description="Aguardando atendimento"          description="Aguardando atendimento"

          icon={Clock}          icon={Clock}

          iconColor="text-blue-500"          iconColor="text-blue-500"

        />        />



        <StatCard        <StatCard

          title="Em Andamento"          title="Em Andamento"

          value={ticketStats.inProgress.toString()}          value={ticketStats.inProgress.toString()}

          description="Sendo processados"          description="Sendo processados"

          icon={CheckCircle}          icon={CheckCircle}

          iconColor="text-yellow-500"          iconColor="text-yellow-500"

        />        />



        <StatCard        <StatCard

          title="Urgentes"          title="Urgentes"

          value={ticketStats.urgent.toString()}          value={ticketStats.urgent.toString()}

          description="Prioridade alta"          description="Prioridade alta"

          icon={AlertTriangle}          icon={AlertTriangle}

          iconColor="text-red-500"          iconColor="text-red-500"

        />        />

      </div>      </div>



      {/* Filters */}      {/* Filters */}

      <div className="flex flex-col sm:flex-row gap-4">      <div className="flex flex-col sm:flex-row gap-4">

        <div className="relative flex-1">        <div className="relative flex-1">

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

          <Input          <Input

            placeholder="Buscar tickets..."            placeholder="Buscar tickets..."

            value={searchQuery}            value={searchQuery}

            onChange={(e) => setSearchQuery(e.target.value)}            onChange={(e) => setSearchQuery(e.target.value)}

            className="pl-10"            className="pl-10"

          />          />

        </div>        </div>



        <Select value={statusFilter} onValueChange={setStatusFilter}>        <Select value={statusFilter} onValueChange={setStatusFilter}>

          <SelectTrigger className="w-40">          <SelectTrigger className="w-40">

            <SelectValue placeholder="Status" />            <SelectValue placeholder="Status" />

          </SelectTrigger>          </SelectTrigger>

          <SelectContent>          <SelectContent>

            <SelectItem value="all">Todos Status</SelectItem>            <SelectItem value="all">Todos Status</SelectItem>

            <SelectItem value="open">Aberto</SelectItem>            <SelectItem value="open">Aberto</SelectItem>

            <SelectItem value="in-progress">Em Andamento</SelectItem>            <SelectItem value="in-progress">Em Andamento</SelectItem>

            <SelectItem value="resolved">Resolvido</SelectItem>            <SelectItem value="resolved">Resolvido</SelectItem>

            <SelectItem value="closed">Fechado</SelectItem>            <SelectItem value="closed">Fechado</SelectItem>

          </SelectContent>          </SelectContent>

        </Select>        </Select>



        <Select value={priorityFilter} onValueChange={setPriorityFilter}>        <Select value={priorityFilter} onValueChange={setPriorityFilter}>

          <SelectTrigger className="w-40">          <SelectTrigger className="w-40">

            <SelectValue placeholder="Prioridade" />            <SelectValue placeholder="Prioridade" />

          </SelectTrigger>          </SelectTrigger>

          <SelectContent>          <SelectContent>

            <SelectItem value="all">Todas</SelectItem>            <SelectItem value="all">Todas</SelectItem>

            <SelectItem value="low">Baixa</SelectItem>            <SelectItem value="low">Baixa</SelectItem>

            <SelectItem value="medium">Média</SelectItem>            <SelectItem value="medium">Média</SelectItem>

            <SelectItem value="high">Alta</SelectItem>            <SelectItem value="high">Alta</SelectItem>

            <SelectItem value="urgent">Urgente</SelectItem>            <SelectItem value="urgent">Urgente</SelectItem>

          </SelectContent>          </SelectContent>

        </Select>        </Select>



        <Select value={categoryFilter} onValueChange={setCategoryFilter}>        <Select value={categoryFilter} onValueChange={setCategoryFilter}>

          <SelectTrigger className="w-40">          <SelectTrigger className="w-40">

            <SelectValue placeholder="Categoria" />            <SelectValue placeholder="Categoria" />

          </SelectTrigger>          </SelectTrigger>

          <SelectContent>          <SelectContent>

            <SelectItem value="all">Todas</SelectItem>            <SelectItem value="all">Todas</SelectItem>

            <SelectItem value="bug">Bug</SelectItem>            <SelectItem value="bug">Bug</SelectItem>

            <SelectItem value="feature">Feature</SelectItem>            <SelectItem value="feature">Feature</SelectItem>

            <SelectItem value="support">Suporte</SelectItem>            <SelectItem value="support">Suporte</SelectItem>

            <SelectItem value="question">Pergunta</SelectItem>            <SelectItem value="question">Pergunta</SelectItem>

          </SelectContent>          </SelectContent>

        </Select>        </Select>



        <Button variant="outline" size="icon">        <Button variant="outline" size="icon">

          <Filter className="h-4 w-4" />          <Filter className="h-4 w-4" />

        </Button>        </Button>

      </div>      </div>



      {/* Tickets List */}      {/* Tickets List */}

      <div className="space-y-4">      <div className="space-y-4">

        {filteredTickets.length === 0 ? (        {filteredTickets.length === 0 ? (

          <Card>          <Card>

            <CardContent className="flex flex-col items-center py-8">            <CardContent className="flex flex-col items-center py-8">

              <Ticket className="h-12 w-12 text-gray-400 mb-4" />              <Ticket className="h-12 w-12 text-gray-400 mb-4" />

              <p className="text-gray-500">Nenhum ticket encontrado</p>              <p className="text-gray-500">Nenhum ticket encontrado</p>

            </CardContent>            </CardContent>

          </Card>          </Card>

        ) : (        ) : (

          filteredTickets.map((ticket) => (          filteredTickets.map((ticket) => (

            <Card key={ticket.id} className="hover:shadow-md transition-shadow">            <Card key={ticket.id} className="hover:shadow-md transition-shadow">

              <CardHeader>              <CardHeader>

                <div className="flex items-start justify-between">                <div className="flex items-start justify-between">

                  <div className="space-y-1">                  <div className="space-y-1">

                    <div className="flex items-center gap-2">                    <div className="flex items-center gap-2">

                      <CardTitle className="text-lg">{ticket.title}</CardTitle>                      <CardTitle className="text-lg">{ticket.title}</CardTitle>

                      <Badge variant={statusConfig[ticket.status]?.variant || "default"}>                      <Badge variant={statusConfig[ticket.status]?.variant || "default"}>

                        {statusConfig[ticket.status]?.label || ticket.status}                        {statusConfig[ticket.status]?.label || ticket.status}

                      </Badge>                      </Badge>

                      <Badge variant="outline" className={categoryConfig[ticket.category]?.color}>                      <Badge variant="outline" className={categoryConfig[ticket.category]?.color}>

                        {categoryConfig[ticket.category]?.label || ticket.category}                        {categoryConfig[ticket.category]?.label || ticket.category}

                      </Badge>                      </Badge>

                    </div>                    </div>

                    <CardDescription className="max-w-2xl">                    <CardDescription className="max-w-2xl">

                      {ticket.description}                      {ticket.description}

                    </CardDescription>                    </CardDescription>

                  </div>                  </div>

                  <div className="flex items-center gap-2">                  <div className="flex items-center gap-2">

                    <span className={`text-sm font-medium ${priorityConfig[ticket.priority]?.color}`}>                    <span className={`text-sm font-medium ${priorityConfig[ticket.priority]?.color}`}>

                      <Flag className="inline h-3 w-3 mr-1" />                      <Flag className="inline h-3 w-3 mr-1" />

                      {priorityConfig[ticket.priority]?.label || ticket.priority}                      {priorityConfig[ticket.priority]?.label || ticket.priority}

                    </span>                    </span>

                  </div>                  </div>

                </div>                </div>

              </CardHeader>              </CardHeader>

              <CardContent>              <CardContent>

                <div className="flex items-center justify-between">                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4 text-sm text-gray-500">                  <div className="flex items-center gap-4 text-sm text-gray-500">

                    <span>Criado: {formatDate(ticket.createdAt)}</span>                    <span>Criado: {formatDate(ticket.createdAt)}</span>

                    <span>Atualizado: {formatDate(ticket.updatedAt)}</span>                    <span>Atualizado: {formatDate(ticket.updatedAt)}</span>

                    {ticket.assigneeId && (                    {ticket.assigneeId && (

                      <span>Responsável: {ticket.assigneeId}</span>                      <span>Responsável: {ticket.assigneeId}</span>

                    )}                    )}

                  </div>                  </div>

                  <div className="flex gap-2">                  <div className="flex gap-2">

                    <Button variant="outline" size="sm">                    <Button variant="outline" size="sm">

                      <Eye className="mr-2 h-4 w-4" />                      <Eye className="mr-2 h-4 w-4" />

                      Ver Detalhes                      Ver Detalhes

                    </Button>                    </Button>

                    <Button variant="outline" size="sm">                    <Button variant="outline" size="sm">

                      <MessageSquare className="mr-2 h-4 w-4" />                      <MessageSquare className="mr-2 h-4 w-4" />

                      Comentar                      Comentar

                    </Button>                    </Button>

                  </div>                  </div>

                </div>                </div>

              </CardContent>              </CardContent>

            </Card>            </Card>

          ))          ))

        )}        )}

      </div>      </div>

    </div>    </div>

  )  )

}}