"use client""use client""use client"



import { useState, useEffect } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"import { useState, useEffect } from "react"import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"

import { Badge } from "@/components/ui/badge"import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {import { Button } from "@/components/ui/button"import { Button } from "@/components/ui/button"

  Select,

  SelectContent,import { Input } from "@/components/ui/input"import { Input } from "@/components/ui/input"

  SelectItem,

  SelectTrigger,import { Badge } from "@/components/ui/badge"import { Badge } from "@/components/ui/badge"

  SelectValue,

} from "@/components/ui/select"import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {

  Dialog,import {import {

  DialogContent,

  DialogDescription,  Select,  Select,

  DialogFooter,

  DialogHeader,  SelectContent,  SelectContent,

  DialogTitle,

  DialogTrigger,  SelectItem,  SelectItem,

} from "@/components/ui/dialog"

import {   SelectTrigger,  SelectTrigger,

  Ticket,

  Plus,  SelectValue,  SelectValue,

  Filter,

  Search,} from "@/components/ui/select"} from "@/components/ui/select"

  Clock,

  AlertTriangle,import {import {

  CheckCircle,

  XCircle,  Dialog,  Dialog,

  MessageSquare,

  User,  DialogContent,  DialogContent,

  Flag,

  Eye  DialogDescription,  DialogDescription,

} from "lucide-react"

import { useTicketStore } from "@/stores"  DialogFooter,  DialogFooter,

import { StatCard } from "@/components/common"

  DialogHeader,  DialogHeader,

// Status and priority configurations

const statusConfig = {  DialogTitle,  DialogTitle,

  open: { label: "Aberto", color: "bg-blue-500", variant: "default" as const },

  "in-progress": { label: "Em Andamento", color: "bg-yellow-500", variant: "secondary" as const },  DialogTrigger,  DialogTrigger,

  resolved: { label: "Resolvido", color: "bg-green-500", variant: "default" as const },

  closed: { label: "Fechado", color: "bg-gray-500", variant: "outline" as const }} from "@/components/ui/dialog"} from "@/components/ui/dialog"

}

import { import { 

const priorityConfig = {

  low: { label: "Baixa", color: "text-gray-500" },  Ticket,  Ticket,

  medium: { label: "Média", color: "text-blue-500" },

  high: { label: "Alta", color: "text-orange-500" },  Plus,  Plus,

  urgent: { label: "Urgente", color: "text-red-500" }

}  Filter,  Filter,



const categoryConfig = {  Search,  Search,

  bug: { label: "Bug", color: "bg-red-100 text-red-800" },

  feature: { label: "Feature", color: "bg-blue-100 text-blue-800" },  Clock,  Clock,

  support: { label: "Suporte", color: "bg-green-100 text-green-800" },

  question: { label: "Pergunta", color: "bg-purple-100 text-purple-800" }  AlertTriangle,  AlertTriangle,

}

  CheckCircle,  CheckCircle,

const formatDate = (date: Date | string) => {

  const dateObj = typeof date === 'string' ? new Date(date) : date  XCircle,  XCircle,

  return dateObj.toLocaleDateString("pt-BR", {

    day: "2-digit",  MessageSquare,  MessageSquare,

    month: "2-digit", 

    year: "numeric",  User,  User,

    hour: "2-digit",

    minute: "2-digit"  Flag,  Flag,

  })

}  Eye  Eye



export default function TaskTicketsPage() {} from "lucide-react"} from "lucide-react"

  const [searchQuery, setSearchQuery] = useState("")

  const [statusFilter, setStatusFilter] = useState("all")import { useTicketStore } from "@/stores"import { useTicketStore } from "@/stores"

  const [priorityFilter, setPriorityFilter] = useState("all")

  const [categoryFilter, setCategoryFilter] = useState("all")import { StatCard } from "@/components/common"import { StatCard } from "@/components/common"

  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)



  // Get tickets from Firebase store

  const { tickets, loading, fetchTickets } = useTicketStore()// Status and priority configurations// Status and priority configurations



  // Load tickets on component mountconst statusConfig = {const statusConfig = {

  useEffect(() => {

    fetchTickets()  open: { label: "Aberto", color: "bg-blue-500", variant: "default" as const },  open: { label: "Aberto", color: "bg-blue-500", variant: "default" as const },

  }, [fetchTickets])

  "in-progress": { label: "Em Andamento", color: "bg-yellow-500", variant: "secondary" as const },  "in-progress": { label: "Em Andamento", color: "bg-yellow-500", variant: "secondary" as const },

  // Calculate ticket statistics

  const ticketStats = {  resolved: { label: "Resolvido", color: "bg-green-500", variant: "default" as const },  resolved: { label: "Resolvido", color: "bg-green-500", variant: "default" as const },

    total: tickets.length,

    open: tickets.filter(t => t.status === "open").length,  closed: { label: "Fechado", color: "bg-gray-500", variant: "outline" as const }  closed: { label: "Fechado", color: "bg-gray-500", variant: "outline" as const }

    inProgress: tickets.filter(t => t.status === "in-progress").length,

    urgent: tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length}}

  }



  // Filter tickets

  const filteredTickets = tickets.filter(ticket => {const priorityConfig = {const priorityConfig = {

    const matchesSearch = !searchQuery || 

      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||  low: { label: "Baixa", color: "text-gray-500" },  low: { label: "Baixa", color: "text-gray-500" },

      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())

      medium: { label: "Média", color: "text-blue-500" },  medium: { label: "Média", color: "text-blue-500" },

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter  high: { label: "Alta", color: "text-orange-500" },  high: { label: "Alta", color: "text-orange-500" },

    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter

      urgent: { label: "Urgente", color: "text-red-500" }  urgent: { label: "Urgente", color: "text-red-500" }

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory

  })}}



  if (loading) {

    return (

      <div className="flex-1 space-y-6 p-6">const categoryConfig = {const categoryConfig = {

        <div className="animate-pulse space-y-4">

          <div className="h-8 bg-gray-200 rounded w-64"></div>  bug: { label: "Bug", color: "bg-red-100 text-red-800" },  bug: { label: "Bug", color: "bg-red-100 text-red-800" },

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {Array.from({ length: 4 }).map((_, i) => (  feature: { label: "Feature", color: "bg-blue-100 text-blue-800" },  feature: { label: "Feature", color: "bg-blue-100 text-blue-800" },

              <div key={i} className="h-32 bg-gray-200 rounded"></div>

            ))}  support: { label: "Suporte", color: "bg-green-100 text-green-800" },  support: { label: "Suporte", color: "bg-green-100 text-green-800" },

          </div>

        </div>  question: { label: "Pergunta", color: "bg-purple-100 text-purple-800" }  question: { label: "Pergunta", color: "bg-purple-100 text-purple-800" }

      </div>

    )}}

  }



  return (

    <div className="flex-1 space-y-6 p-6">const formatDate = (date: Date | string) => {const formatDate = (date: Date | string) => {

      {/* Header */}

      <div className="flex items-center justify-between">  const dateObj = typeof date === 'string' ? new Date(date) : date  const dateObj = typeof date === 'string' ? new Date(date) : date

        <div>

          <h1 className="text-3xl font-bold tracking-tight">Tickets de Suporte</h1>  return dateObj.toLocaleDateString("pt-BR", {  return dateObj.toLocaleDateString("pt-BR", {

          <p className="text-muted-foreground">

            Gerencie tickets e solicitações de suporte    day: "2-digit",    day: "2-digit",

          </p>

        </div>    month: "2-digit",     month: "2-digit", 

        <div className="flex gap-2">

          <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>    year: "numeric",    year: "numeric",

            <DialogTrigger asChild>

              <Button>    hour: "2-digit",    hour: "2-digit",

                <Plus className="mr-2 h-4 w-4" />

                Novo Ticket    minute: "2-digit"    minute: "2-digit"

              </Button>

            </DialogTrigger>  })  })

            <DialogContent>

              <DialogHeader>}}

                <DialogTitle>Criar Novo Ticket</DialogTitle>

                <DialogDescription>

                  Preencha as informações do novo ticket de suporte

                </DialogDescription>export default function TaskTicketsPage() {export default function TaskTicketsPage() {

              </DialogHeader>

              <div className="space-y-4">  const [searchQuery, setSearchQuery] = useState("")  const [searchQuery, setSearchQuery] = useState("")

                <p className="text-sm text-gray-500">

                  Funcionalidade de criação de tickets será implementada em breve.  const [statusFilter, setStatusFilter] = useState("all")  const [statusFilter, setStatusFilter] = useState("all")

                </p>

              </div>  const [priorityFilter, setPriorityFilter] = useState("all")  const [priorityFilter, setPriorityFilter] = useState("all")

              <DialogFooter>

                <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>  const [categoryFilter, setCategoryFilter] = useState("all")  const [categoryFilter, setCategoryFilter] = useState("all")

                  Cancelar

                </Button>  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)

                <Button onClick={() => setShowNewTicketDialog(false)}>

                  Criar Ticket

                </Button>

              </DialogFooter>  // Get tickets from Firebase store  // Get tickets from Firebase store

            </DialogContent>

          </Dialog>  const { tickets, loading, fetchTickets } = useTicketStore()  const { tickets, loading, fetchTickets } = useTicketStore()

        </div>

      </div>



      {/* Statistics */}  // Load tickets on component mount  // Load tickets on component mount

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard  useEffect(() => {  useEffect(() => {

          title="Total de Tickets"

          value={ticketStats.total.toString()}    fetchTickets()    fetchTickets()

          description="Todos os tickets"

          icon={Ticket}  }, [fetchTickets])  }, [fetchTickets])

        />



        <StatCard

          title="Tickets Abertos"  // Calculate ticket statistics  // Calculate ticket statistics

          value={ticketStats.open.toString()}

          description="Aguardando atendimento"  const ticketStats = {  const ticketStats = {

          icon={Clock}

          iconColor="text-blue-500"    total: tickets.length,    total: tickets.length,

        />

    open: tickets.filter(t => t.status === "open").length,    open: tickets.filter(t => t.status === "open").length,

        <StatCard

          title="Em Andamento"    inProgress: tickets.filter(t => t.status === "in-progress").length,    inProgress: tickets.filter(t => t.status === "in-progress").length,

          value={ticketStats.inProgress.toString()}

          description="Sendo processados"    urgent: tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length    urgent: tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length

          icon={CheckCircle}

          iconColor="text-yellow-500"  }  }

        />



        <StatCard

          title="Urgentes"  // Filter tickets  // Filter tickets

          value={ticketStats.urgent.toString()}

          description="Prioridade alta"  const filteredTickets = tickets.filter(ticket => {  const filteredTickets = tickets.filter(ticket => {

          icon={AlertTriangle}

          iconColor="text-red-500"    const matchesSearch = !searchQuery ||     const matchesSearch = !searchQuery || 

        />

      </div>      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||



      {/* Filters */}      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())

      <div className="flex flex-col sm:flex-row gap-4">

        <div className="relative flex-1">        

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

          <Input    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

            placeholder="Buscar tickets..."

            value={searchQuery}    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

            onChange={(e) => setSearchQuery(e.target.value)}

            className="pl-10"    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter

          />

        </div>        



        <Select value={statusFilter} onValueChange={setStatusFilter}>    return matchesSearch && matchesStatus && matchesPriority && matchesCategory    return matchesSearch && matchesStatus && matchesPriority && matchesCategory

          <SelectTrigger className="w-40">

            <SelectValue placeholder="Status" />  })  })

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">Todos Status</SelectItem>

            <SelectItem value="open">Aberto</SelectItem>  if (loading) {  if (loading) {

            <SelectItem value="in-progress">Em Andamento</SelectItem>

            <SelectItem value="resolved">Resolvido</SelectItem>    return (    return (

            <SelectItem value="closed">Fechado</SelectItem>

          </SelectContent>      <div className="flex-1 space-y-6 p-6">      <div className="flex-1 space-y-6 p-6">

        </Select>

        <div className="animate-pulse space-y-4">        <div className="animate-pulse space-y-4">

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>

          <SelectTrigger className="w-40">          <div className="h-8 bg-gray-200 rounded w-64"></div>          <div className="h-8 bg-gray-200 rounded w-64"></div>

            <SelectValue placeholder="Prioridade" />

          </SelectTrigger>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <SelectContent>

            <SelectItem value="all">Todas</SelectItem>            {Array.from({ length: 4 }).map((_, i) => (            {Array.from({ length: 4 }).map((_, i) => (

            <SelectItem value="low">Baixa</SelectItem>

            <SelectItem value="medium">Média</SelectItem>              <div key={i} className="h-32 bg-gray-200 rounded"></div>              <div key={i} className="h-32 bg-gray-200 rounded"></div>

            <SelectItem value="high">Alta</SelectItem>

            <SelectItem value="urgent">Urgente</SelectItem>            ))}            ))}

          </SelectContent>

        </Select>          </div>          </div>



        <Select value={categoryFilter} onValueChange={setCategoryFilter}>        </div>        </div>

          <SelectTrigger className="w-40">

            <SelectValue placeholder="Categoria" />      </div>      </div>

          </SelectTrigger>

          <SelectContent>    )    )

            <SelectItem value="all">Todas</SelectItem>

            <SelectItem value="bug">Bug</SelectItem>  }  }

            <SelectItem value="feature">Feature</SelectItem>

            <SelectItem value="support">Suporte</SelectItem>

            <SelectItem value="question">Pergunta</SelectItem>

          </SelectContent>  return (  return (

        </Select>

    <div className="flex-1 space-y-6 p-6">    <div className="flex-1 space-y-6 p-6">

        <Button variant="outline" size="icon">

          <Filter className="h-4 w-4" />      {/* Header */}      {/* Header */}

        </Button>

      </div>      <div className="flex items-center justify-between">      <div className="flex items-center justify-between">



      {/* Tickets List */}        <div>        <div>

      <div className="space-y-4">

        {filteredTickets.length === 0 ? (          <h1 className="text-3xl font-bold tracking-tight">Tickets de Suporte</h1>          <h1 className="text-3xl font-bold tracking-tight">Tickets de Suporte</h1>

          <Card>

            <CardContent className="flex flex-col items-center py-8">          <p className="text-muted-foreground">          <p className="text-muted-foreground">

              <Ticket className="h-12 w-12 text-gray-400 mb-4" />

              <p className="text-gray-500">Nenhum ticket encontrado</p>            Gerencie tickets e solicitações de suporte            Gerencie tickets e solicitações de suporte

            </CardContent>

          </Card>          </p>          </p>

        ) : (

          filteredTickets.map((ticket) => (        </div>        </div>

            <Card key={ticket.id} className="hover:shadow-md transition-shadow">

              <CardHeader>        <div className="flex gap-2">        <div className="flex gap-2">

                <div className="flex items-start justify-between">

                  <div className="space-y-1">          <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>          <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>

                    <div className="flex items-center gap-2">

                      <CardTitle className="text-lg">{ticket.title}</CardTitle>            <DialogTrigger asChild>            <DialogTrigger asChild>

                      <Badge variant={statusConfig[ticket.status]?.variant || "default"}>

                        {statusConfig[ticket.status]?.label || ticket.status}              <Button>              <Button>

                      </Badge>

                      <Badge variant="outline" className={categoryConfig[ticket.category]?.color}>                <Plus className="mr-2 h-4 w-4" />                <Plus className="mr-2 h-4 w-4" />

                        {categoryConfig[ticket.category]?.label || ticket.category}

                      </Badge>                Novo Ticket                Novo Ticket

                    </div>

                    <CardDescription className="max-w-2xl">              </Button>              </Button>

                      {ticket.description}

                    </CardDescription>            </DialogTrigger>            </DialogTrigger>

                  </div>

                  <div className="flex items-center gap-2">            <DialogContent>            <DialogContent>

                    <span className={`text-sm font-medium ${priorityConfig[ticket.priority]?.color}`}>

                      <Flag className="inline h-3 w-3 mr-1" />              <DialogHeader>              <DialogHeader>

                      {priorityConfig[ticket.priority]?.label || ticket.priority}

                    </span>                <DialogTitle>Criar Novo Ticket</DialogTitle>                <DialogTitle>Criar Novo Ticket</DialogTitle>

                  </div>

                </div>                <DialogDescription>                <DialogDescription>

              </CardHeader>

              <CardContent>                  Preencha as informações do novo ticket de suporte                  Preencha as informações do novo ticket de suporte

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4 text-sm text-gray-500">                </DialogDescription>                </DialogDescription>

                    <span>Criado: {formatDate(ticket.createdAt)}</span>

                    <span>Atualizado: {formatDate(ticket.updatedAt)}</span>              </DialogHeader>              </DialogHeader>

                    {ticket.assigneeId && (

                      <span>Responsável: {ticket.assigneeId}</span>              <div className="space-y-4">              <div className="space-y-4">

                    )}

                  </div>                <p className="text-sm text-gray-500">                <p className="text-sm text-gray-500">

                  <div className="flex gap-2">

                    <Button variant="outline" size="sm">                  Funcionalidade de criação de tickets será implementada em breve.                  Funcionalidade de criação de tickets será implementada em breve.

                      <Eye className="mr-2 h-4 w-4" />

                      Ver Detalhes                </p>                </p>

                    </Button>

                    <Button variant="outline" size="sm">              </div>              </div>

                      <MessageSquare className="mr-2 h-4 w-4" />

                      Comentar              <DialogFooter>              <DialogFooter>

                    </Button>

                  </div>                <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>                <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>

                </div>

              </CardContent>                  Cancelar                  Cancelar

            </Card>

          ))                </Button>                </Button>

        )}

      </div>                <Button onClick={() => setShowNewTicketDialog(false)}>                <Button onClick={() => setShowNewTicketDialog(false)}>

    </div>

  )                  Criar Ticket                  Criar Ticket

}
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