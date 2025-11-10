"use client"

import { useState, useMemo } from "react"
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
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Ticket,
  Plus,
  Search,
  Flag,
  Send,
  Paperclip,
  Eye,
  MessageSquare,
  Filter
} from "lucide-react"
import { useTickets } from "@/hooks/useTickets"
import { useUsers } from "@/hooks/useUsers"
import { Ticket as TicketType } from "@/types/ticket"
import { getCategoryIcon, getPriorityColor, getStatusColor, formatDate } from "@/lib/utils"

export default function TaskTicketsPage() {
  const { tickets, loading, createTicket } = useTickets()
  const { findUserById } = useUsers()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null)
  const [newComment, setNewComment] = useState("")
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)
  
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium" as TicketType['priority'],
    category: "question" as TicketType['category']
  })

  const filteredTickets = useMemo(() => tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  }), [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter])

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    urgent: tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length
  }), [tickets])

  const addComment = () => {
    if (selectedTicket && newComment.trim()) {
      // Aqui você enviaria o comentário para o backend
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

  const handleCreateTicket = async () => {
    if (newTicket.title.trim() && newTicket.description.trim()) {
      try {
        // Assuming the current user is the reporter
        // In a real app, you'd get this from auth context
        const reporterId = "mock-user-id"; 
        await createTicket({ ...newTicket, status: 'open', reporterId, createdAt: new Date(), updatedAt: new Date() })
        setShowNewTicketDialog(false)
        setNewTicket({ title: "", description: "", priority: "medium", category: "question" })
      } catch (error) {
        console.error("Failed to create ticket:", error)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando tickets...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets de Suporte</h1>
          <p className="text-muted-foreground">Gerencie tickets de suporte, bugs e solicitações da equipe</p>
        </div>
        <Button onClick={() => setShowNewTicketDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Ticket
        </Button>
      </div>

      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Ticket</DialogTitle>
            <DialogDescription>
              Preencha as informações do ticket de suporte
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({...newTicket, priority: value as TicketType['priority']})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value as TicketType['category']})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
            <Button onClick={handleCreateTicket} disabled={!newTicket.title.trim() || !newTicket.description.trim()}>
              Criar Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertos</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <MessageSquare className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <Flag className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.urgent}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
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
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Prioridade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="support">Suporte</SelectItem>
                <SelectItem value="question">Pergunta</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="w-full sm:w-auto">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const CategoryIcon = getCategoryIcon(ticket.category)
            const reporter = findUserById(ticket.reporterId)
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
                          <Badge variant="outline" className="text-xs">{ticket.id}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      {reporter && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reporter.avatar} alt={reporter.name} />
                          <AvatarFallback>{reporter.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      )}
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="lg:sticky lg:top-6">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>Ticket {selectedTicket.id}</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>✕</Button>
                </div>
                <CardDescription>{selectedTicket.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTicket.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Reporter</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={findUserById(selectedTicket.reporterId)?.avatar} alt={findUserById(selectedTicket.reporterId)?.name} />
                        <AvatarFallback>{findUserById(selectedTicket.reporterId)?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{findUserById(selectedTicket.reporterId)?.name}</span>
                    </div>
                  </div>
                  {selectedTicket.assigneeId && (
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Responsável</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={findUserById(selectedTicket.assigneeId)?.avatar} alt={findUserById(selectedTicket.assigneeId)?.name} />
                          <AvatarFallback>{findUserById(selectedTicket.assigneeId)?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{findUserById(selectedTicket.assigneeId)?.name}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Criado: {formatDate(selectedTicket.createdAt)}</span>
                  <span>Atualizado: {formatDate(selectedTicket.updatedAt)}</span>
                </div>
                {selectedTicket.tags && selectedTicket.tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTicket.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Comentários ({selectedTicket.comments?.length || 0})</Label>
                  <div className="space-y-3 mt-2 max-h-64 overflow-y-auto">
                    {selectedTicket.comments?.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">{findUserById(comment.authorId)?.name}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.message}</p>
                        {comment.attachments && comment.attachments.length > 0 && (
                          <div className="mt-2">
                            {comment.attachments.map((attachment) => (
                              <Badge key={attachment.id} variant="outline" className="text-xs mr-1">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {attachment.name}
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
                  <Button onClick={addComment} className="mt-2 w-full" disabled={!newComment.trim()}>
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
    </div>
  )
}
