"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
  Calendar,
  Flag,
  Send,
  Paperclip,
  Eye
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { useTicketStore } from "@/stores"
import { Ticket as TicketType } from "@/types"

type TicketItem = {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: "bug" | "feature" | "support" | "question"
  assignee?: {
    name: string
    avatar: string
  }
  reporter: {
    name: string
    avatar: string
    email: string
  }
  createdAt: string
  updatedAt: string
  dueDate?: string
  tags: string[]
  comments: {
    id: string
    author: string
    message: string
    timestamp: string
    attachments?: string[]
  }[]
}

const mockTickets: TicketItem[] = [
  {
    id: "TIC-001",
    title: "Bug no sistema de autenticação",
    description: "Usuários relatam problema para fazer login após a última atualização. O erro aparece intermitentemente e afeta principalmente usuários do Chrome.",
    status: "in-progress",
    priority: "high",
    category: "bug",
    assignee: {
      name: "Carlos Oliveira",
      avatar: "/avatars/carlos.jpg"
    },
    reporter: {
      name: "João Silva",
      avatar: "/avatars/joao.jpg",
      email: "joao@empresa.com"
    },
    createdAt: "2024-01-15T09:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    dueDate: "2024-01-16T18:00:00Z",
    tags: ["autenticação", "browser", "urgente"],
    comments: [
      {
        id: "1",
        author: "João Silva",
        message: "O problema está acontecendo principalmente no horário de pico, entre 9h e 11h.",
        timestamp: "2024-01-15T10:15:00Z"
      },
      {
        id: "2",
        author: "Carlos Oliveira",
        message: "Identifiquei a causa. Há um conflito com a nova versão do JWT. Trabalhando na correção.",
        timestamp: "2024-01-15T14:20:00Z"
      }
    ]
  },
  {
    id: "TIC-002",
    title: "Solicitação de nova funcionalidade no dashboard",
    description: "Cliente solicita a adição de filtros avançados no dashboard de relatórios para melhorar a análise de dados.",
    status: "open",
    priority: "medium",
    category: "feature",
    reporter: {
      name: "Maria Santos",
      avatar: "/avatars/maria.jpg",
      email: "maria@cliente.com"
    },
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    tags: ["dashboard", "filtros", "relatórios"],
    comments: [
      {
        id: "1",
        author: "Maria Santos",
        message: "Anexo mockup com as especificações detalhadas da funcionalidade solicitada.",
        timestamp: "2024-01-14T16:50:00Z",
        attachments: ["mockup-filtros.pdf"]
      }
    ]
  },
  {
    id: "TIC-003",
    title: "Dúvida sobre integração com API externa",
    description: "Como configurar corretamente a integração com a API de pagamentos? Documentação atual não está clara.",
    status: "waiting",
    priority: "low",
    category: "question",
    assignee: {
      name: "Ana Costa",
      avatar: "/avatars/ana.jpg"
    },
    reporter: {
      name: "Pedro Costa",
      avatar: "/avatars/pedro.jpg",
      email: "pedro@dev.com"
    },
    createdAt: "2024-01-13T11:20:00Z",
    updatedAt: "2024-01-13T15:30:00Z",
    tags: ["api", "pagamentos", "documentação"],
    comments: [
      {
        id: "1",
        author: "Ana Costa",
        message: "Você já seguiu os passos do guia de configuração inicial? Qual erro específico está recebendo?",
        timestamp: "2024-01-13T15:30:00Z"
      }
    ]
  },
  {
    id: "TIC-004",
    title: "Performance lenta no carregamento de dados",
    description: "Relatórios grandes demoram mais de 30 segundos para carregar. Precisa de otimização urgente.",
    status: "resolved",
    priority: "high",
    category: "support",
    assignee: {
      name: "Roberto Silva",
      avatar: "/avatars/roberto.jpg"
    },
    reporter: {
      name: "Ana Ferreira",
      avatar: "/avatars/ana.jpg",
      email: "ana@empresa.com"
    },
    createdAt: "2024-01-10T08:15:00Z",
    updatedAt: "2024-01-12T17:45:00Z",
    tags: ["performance", "relatórios", "otimização"],
    comments: [
      {
        id: "1",
        author: "Roberto Silva",
        message: "Implementei cache e paginação. Performance melhorou em 80%. Favor testar.",
        timestamp: "2024-01-12T17:45:00Z"
      }
    ]
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-blue-100 text-blue-800"
    case "in-progress": return "bg-yellow-100 text-yellow-800"
    case "waiting": return "bg-orange-100 text-orange-800"
    case "resolved": return "bg-green-100 text-green-800"
    case "closed": return "bg-gray-100 text-gray-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low": return "bg-green-100 text-green-800"
    case "medium": return "bg-yellow-100 text-yellow-800"
    case "high": return "bg-orange-100 text-orange-800"
    case "urgent": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "bug": return AlertTriangle
    case "feature": return Plus
    case "support": return User
    case "question": return MessageSquare
    default: return Ticket
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
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
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null)
  const [newComment, setNewComment] = useState("")
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)
  const { tickets, loading, fetchTickets } = useTicketStore()

  // Load tickets on mount
  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])
  
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "question"
  })

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const stats = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === "open").length,
    inProgress: mockTickets.filter(t => t.status === "in-progress").length,
    urgent: mockTickets.filter(t => t.priority === "urgent" && t.status !== "closed").length
  }

  const addComment = () => {
    if (selectedTicket && newComment.trim()) {
      // Aqui você enviaria o comentário para o backend
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

  const createTicket = () => {
    if (newTicket.title.trim() && newTicket.description.trim()) {
      // Aqui você criaria o ticket no backend
      console.log("Creating ticket:", newTicket)
      setShowNewTicketDialog(false)
      setNewTicket({ title: "", description: "", priority: "medium", category: "question" })
    }
  }

  return (
    <>
      <PageHeader
        title="Tickets de Suporte"
        description="Gerencie tickets de suporte, bugs e solicitações da equipe"
        actions={[
          {
            label: "Novo Ticket",
            icon: Plus,
            onClick: () => setShowNewTicketDialog(true)
          }
        ]}
      />

      {/* Dialog para criar novo ticket */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Ticket</DialogTitle>
            <DialogDescription>
              Preencha as informações do ticket de suporte
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                placeholder="Descreva brevemente o problema..."
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                placeholder="Descreva detalhadamente o problema ou solicitação..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prioridade</Label>
                <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({...newTicket, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Nova Funcionalidade</SelectItem>
                    <SelectItem value="support">Suporte</SelectItem>
                    <SelectItem value="question">Dúvida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={createTicket} disabled={!newTicket.title.trim() || !newTicket.description.trim()}>
              Criar Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">tickets registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
            <p className="text-xs text-muted-foreground">aguardando atendimento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">sendo processados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <Flag className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">prioridade alta</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="waiting">Aguardando</SelectItem>
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
                <SelectItem value="feature">Funcionalidade</SelectItem>
                <SelectItem value="support">Suporte</SelectItem>
                <SelectItem value="question">Dúvida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tickets */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lista */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const CategoryIcon = getCategoryIcon(ticket.category)
            return (
              <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTicket(ticket)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <CategoryIcon className="h-5 w-5 text-muted-foreground mt-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium truncate">{ticket.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {ticket.id}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status === "open" ? "Aberto" :
                         ticket.status === "in-progress" ? "Em Andamento" :
                         ticket.status === "waiting" ? "Aguardando" :
                         ticket.status === "resolved" ? "Resolvido" : "Fechado"}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority === "low" ? "Baixa" :
                         ticket.priority === "medium" ? "Média" :
                         ticket.priority === "high" ? "Alta" : "Urgente"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={ticket.reporter.avatar} alt={ticket.reporter.name} />
                        <AvatarFallback>
                          {ticket.reporter.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {/* Detalhe do Ticket */}
        <div className="lg:sticky lg:top-6">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>Ticket {selectedTicket.id}</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>
                    ✕
                  </Button>
                </div>
                <CardDescription>{selectedTicket.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status === "open" ? "Aberto" :
                       selectedTicket.status === "in-progress" ? "Em Andamento" :
                       selectedTicket.status === "waiting" ? "Aguardando" :
                       selectedTicket.status === "resolved" ? "Resolvido" : "Fechado"}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority === "low" ? "Baixa" :
                       selectedTicket.priority === "medium" ? "Média" :
                       selectedTicket.priority === "high" ? "Alta" : "Urgente"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTicket.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Reporter</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedTicket.reporter.avatar} alt={selectedTicket.reporter.name} />
                        <AvatarFallback>
                          {selectedTicket.reporter.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{selectedTicket.reporter.name}</span>
                    </div>
                  </div>
                  {selectedTicket.assignee && (
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Responsável</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedTicket.assignee.avatar} alt={selectedTicket.assignee.name} />
                          <AvatarFallback>
                            {selectedTicket.assignee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedTicket.assignee.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Criado: {formatDate(selectedTicket.createdAt)}</span>
                  <span>Atualizado: {formatDate(selectedTicket.updatedAt)}</span>
                </div>

                {selectedTicket.tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTicket.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Comentários ({selectedTicket.comments.length})</Label>
                  <div className="space-y-3 mt-2 max-h-64 overflow-y-auto">
                    {selectedTicket.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.message}</p>
                        {comment.attachments && comment.attachments.length > 0 && (
                          <div className="mt-2">
                            {comment.attachments.map((attachment, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Adicionar Comentário</Label>
                  <Textarea
                    placeholder="Digite seu comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                  <Button 
                    onClick={addComment} 
                    className="mt-2 w-full"
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Comentário
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um ticket para ver os detalhes</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
