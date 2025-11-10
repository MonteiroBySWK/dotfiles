"use client"

import { useState } from "react"
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
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Send
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

type FeedbackItem = {
  id: string
  taskId: string
  taskTitle: string
  clientName: string
  clientAvatar: string
  rating: number
  feedback: string
  status: "pending" | "reviewed" | "responded"
  category: "quality" | "timeline" | "communication" | "scope"
  createdAt: string
  responses?: {
    author: string
    message: string
    timestamp: string
  }[]
}

const mockFeedbacks: FeedbackItem[] = [
  {
    id: "1",
    taskId: "T-001",
    taskTitle: "Desenvolvimento do Sistema de Login",
    clientName: "João Silva",
    clientAvatar: "/avatars/joao.jpg",
    rating: 5,
    feedback: "Excelente trabalho! O sistema foi entregue dentro do prazo e funciona perfeitamente. A equipe foi muito comunicativa durante todo o processo.",
    status: "responded",
    category: "quality",
    createdAt: "2024-01-15T10:30:00Z",
    responses: [
      {
        author: "Carlos Oliveira",
        message: "Obrigado pelo feedback positivo! Ficamos felizes em saber que atendemos suas expectativas.",
        timestamp: "2024-01-15T14:20:00Z"
      }
    ]
  },
  {
    id: "2",
    taskId: "T-002",
    taskTitle: "Design da Interface Mobile",
    clientName: "Maria Santos",
    clientAvatar: "/avatars/maria.jpg",
    rating: 4,
    feedback: "O design ficou muito bom, mas gostaria de algumas pequenas modificações nas cores. No geral, estou satisfeita com o resultado.",
    status: "pending",
    category: "scope",
    createdAt: "2024-01-14T16:45:00Z"
  },
  {
    id: "3",
    taskId: "T-003",
    taskTitle: "Integração com API de Pagamentos",
    clientName: "Pedro Costa",
    clientAvatar: "/avatars/pedro.jpg",
    rating: 3,
    feedback: "A integração funcionou, mas houve alguns problemas de comunicação durante o desenvolvimento. Alguns requisitos não ficaram claros.",
    status: "reviewed",
    category: "communication",
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    id: "4",
    taskId: "T-004",
    taskTitle: "Otimização de Performance",
    clientName: "Ana Ferreira",
    clientAvatar: "/avatars/ana.jpg",
    rating: 5,
    feedback: "Performance melhorou significativamente! Site carrega muito mais rápido agora. Parabéns pela eficiência da equipe.",
    status: "responded",
    category: "quality",
    createdAt: "2024-01-12T11:20:00Z",
    responses: [
      {
        author: "Roberto Silva",
        message: "Fico muito feliz que tenha notado a melhoria! Continuaremos monitorando a performance.",
        timestamp: "2024-01-12T15:30:00Z"
      }
    ]
  }
]

const getRatingStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
      }`}
    />
  ))
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "reviewed": return "bg-blue-100 text-blue-800"
    case "responded": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "quality": return "bg-green-100 text-green-800"
    case "timeline": return "bg-blue-100 text-blue-800"
    case "communication": return "bg-orange-100 text-orange-800"
    case "scope": return "bg-purple-100 text-purple-800"
    default: return "bg-gray-100 text-gray-800"
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

export default function TaskFeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [responseMessage, setResponseMessage] = useState("")

  const filteredFeedbacks = mockFeedbacks.filter(feedback => {
    const matchesSearch = feedback.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.feedback.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter
    const matchesCategory = categoryFilter === "all" || feedback.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: mockFeedbacks.length,
    averageRating: mockFeedbacks.reduce((sum, f) => sum + f.rating, 0) / mockFeedbacks.length,
    pending: mockFeedbacks.filter(f => f.status === "pending").length,
    positive: mockFeedbacks.filter(f => f.rating >= 4).length
  }

  const sendResponse = () => {
    if (selectedFeedback && responseMessage.trim()) {
      // Aqui você enviaria a resposta para o backend
      console.log("Sending response:", responseMessage)
      setResponseMessage("")
      setSelectedFeedback(null)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Feedback de Tarefas"
        description="Gerencie e responda aos feedbacks dos clientes sobre as tarefas executadas"
      />

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">feedbacks recebidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex items-center space-x-1 mt-1">
              {getRatingStars(Math.round(stats.averageRating))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">aguardando resposta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((stats.positive / stats.total) * 100)}%</div>
            <p className="text-xs text-muted-foreground">avaliações positivas</p>
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
                placeholder="Buscar feedbacks..."
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
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="reviewed">Revisado</SelectItem>
                <SelectItem value="responded">Respondido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="quality">Qualidade</SelectItem>
                <SelectItem value="timeline">Prazo</SelectItem>
                <SelectItem value="communication">Comunicação</SelectItem>
                <SelectItem value="scope">Escopo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Feedbacks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lista */}
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedFeedback(feedback)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={feedback.clientAvatar} alt={feedback.clientName} />
                      <AvatarFallback>
                        {feedback.clientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{feedback.clientName}</h4>
                      <p className="text-sm text-muted-foreground">{feedback.taskTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(feedback.status)}>
                      {feedback.status === "pending" ? "Pendente" : 
                       feedback.status === "reviewed" ? "Revisado" : "Respondido"}
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(feedback.category)}>
                      {feedback.category === "quality" ? "Qualidade" :
                       feedback.category === "timeline" ? "Prazo" :
                       feedback.category === "communication" ? "Comunicação" : "Escopo"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  {getRatingStars(feedback.rating)}
                  <span className="text-sm text-muted-foreground">
                    {formatDate(feedback.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {feedback.feedback}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detalhe do Feedback */}
        <div className="lg:sticky lg:top-6">
          {selectedFeedback ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detalhes do Feedback</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedFeedback(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedFeedback.clientAvatar} alt={selectedFeedback.clientName} />
                    <AvatarFallback>
                      {selectedFeedback.clientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{selectedFeedback.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{selectedFeedback.taskTitle}</p>
                    <p className="text-xs text-muted-foreground">ID: {selectedFeedback.taskId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {getRatingStars(selectedFeedback.rating)}
                    <span className="text-sm font-medium ml-2">{selectedFeedback.rating}/5</span>
                  </div>
                  <Badge className={getStatusColor(selectedFeedback.status)}>
                    {selectedFeedback.status === "pending" ? "Pendente" : 
                     selectedFeedback.status === "reviewed" ? "Revisado" : "Respondido"}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Feedback</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedFeedback.feedback}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground">
                  Recebido em {formatDate(selectedFeedback.createdAt)}
                </div>

                {selectedFeedback.responses && selectedFeedback.responses.length > 0 && (
                  <div>
                    <Separator className="my-4" />
                    <Label className="text-sm font-medium">Respostas</Label>
                    <div className="space-y-3 mt-2">
                      {selectedFeedback.responses.map((response, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium">{response.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(response.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFeedback.status === "pending" && (
                  <div>
                    <Separator className="my-4" />
                    <Label className="text-sm font-medium">Responder</Label>
                    <Textarea
                      placeholder="Digite sua resposta..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                    <Button 
                      onClick={sendResponse} 
                      className="mt-2 w-full"
                      disabled={!responseMessage.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Resposta
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um feedback para ver os detalhes</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
