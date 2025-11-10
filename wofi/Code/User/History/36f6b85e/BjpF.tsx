"use client"

import { useState } from "react"
import { 
  Calendar, 
  MessageSquare, 
  FileText, 
  Download, 
  Star, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados mock do portal do cliente
const clientData = {
  name: "TechCorp Solutions",
  contactPerson: "Maria Silva",
  avatar: "/avatars/techcorp.jpg"
}

const projects = [
  {
    id: 1,
    name: "Sistema de CRM",
    description: "Desenvolvimento de sistema completo de gestão de relacionamento com cliente",
    status: "in-progress",
    progress: 75,
    startDate: "2024-01-01",
    endDate: "2024-03-15",
    budget: 80000,
    spent: 60000,
    milestones: [
      { id: 1, name: "Análise de Requisitos", completed: true, date: "2024-01-15" },
      { id: 2, name: "Prototipagem", completed: true, date: "2024-02-01" },
      { id: 3, name: "Desenvolvimento Backend", completed: true, date: "2024-02-20" },
      { id: 4, name: "Desenvolvimento Frontend", completed: false, date: "2024-03-05" },
      { id: 5, name: "Testes e Deploy", completed: false, date: "2024-03-15" }
    ]
  },
  {
    id: 2,
    name: "App Mobile",
    description: "Aplicativo móvel para Android e iOS",
    status: "planning",
    progress: 15,
    startDate: "2024-02-15",
    endDate: "2024-05-30",
    budget: 120000,
    spent: 18000,
    milestones: [
      { id: 1, name: "Descoberta e UX", completed: true, date: "2024-02-28" },
      { id: 2, name: "Design UI", completed: false, date: "2024-03-15" },
      { id: 3, name: "Desenvolvimento", completed: false, date: "2024-04-30" },
      { id: 4, name: "Testes e Publicação", completed: false, date: "2024-05-30" }
    ]
  }
]

const tickets = [
  {
    id: 1,
    title: "Problema no login do CRM",
    description: "Usuários relatam dificuldade para fazer login após atualização",
    status: "open",
    priority: "high",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20"
  },
  {
    id: 2,
    title: "Solicitação de nova funcionalidade",
    description: "Adicionar relatório de vendas por período customizado",
    status: "in-review",
    priority: "medium",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-19"
  },
  {
    id: 3,
    title: "Bug no módulo de relatórios",
    description: "Relatórios não carregam dados corretamente",
    status: "resolved",
    priority: "high",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-17"
  }
]

const deliverables = [
  {
    id: 1,
    name: "Especificação Técnica CRM",
    type: "document",
    date: "2024-01-15",
    projectId: 1,
    fileSize: "2.5 MB",
    downloadUrl: "#"
  },
  {
    id: 2,
    name: "Protótipo Interativo",
    type: "prototype",
    date: "2024-02-01",
    projectId: 1,
    fileSize: "15.8 MB",
    downloadUrl: "#"
  },
  {
    id: 3,
    name: "Manual do Usuário",
    type: "document",
    date: "2024-02-20",
    projectId: 1,
    fileSize: "4.2 MB",
    downloadUrl: "#"
  }
]

const statusMap = {
  "in-progress": { label: "Em Andamento", color: "bg-blue-500" },
  "planning": { label: "Planejamento", color: "bg-yellow-500" },
  "completed": { label: "Concluído", color: "bg-green-500" },
  "on-hold": { label: "Pausado", color: "bg-gray-500" }
}

const ticketStatusMap = {
  "open": { label: "Aberto", color: "bg-red-500" },
  "in-review": { label: "Em Análise", color: "bg-yellow-500" },
  "resolved": { label: "Resolvido", color: "bg-green-500" }
}

const priorityMap = {
  "high": { label: "Alta", color: "text-red-600" },
  "medium": { label: "Média", color: "text-yellow-600" },
  "low": { label: "Baixa", color: "text-green-600" }
}

export default function ClientPortalPage() {
  const [newTicket, setNewTicket] = useState("")
  const [feedback, setFeedback] = useState("")

  return (
    <div className="flex-1 space-y-6">
      {/* Header do Cliente */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={clientData.avatar} alt={clientData.name} />
          <AvatarFallback>
            {clientData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{clientData.name}</h1>
          <p className="text-muted-foreground">Portal do Cliente - {clientData.contactPerson}</p>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Abertos</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter(t => t.status !== 'resolved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliverables.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo com Tabs */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="deliverables">Entregas</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* Tab de Projetos */}
        <TabsContent value="projects" className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {project.name}
                      <div className={`h-2 w-2 rounded-full ${statusMap[project.status as keyof typeof statusMap].color}`} />
                      <Badge variant="outline">
                        {statusMap[project.status as keyof typeof statusMap].label}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Início:</span>
                    <div className="font-medium">{new Date(project.startDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Entrega:</span>
                    <div className="font-medium">{new Date(project.endDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Orçamento:</span>
                    <div className="font-medium">R$ {project.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Executado:</span>
                    <div className="font-medium">R$ {project.spent.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Marcos do Projeto</h4>
                  <div className="space-y-2">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-2 text-sm">
                        {milestone.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={milestone.completed ? "text-muted-foreground" : ""}>
                          {milestone.name}
                        </span>
                        <span className="text-muted-foreground ml-auto">
                          {new Date(milestone.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab de Tickets */}
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abrir Novo Ticket</CardTitle>
              <CardDescription>
                Relate problemas, solicite funcionalidades ou tire dúvidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Descreva seu problema ou solicitação..."
                value={newTicket}
                onChange={(e) => setNewTicket(e.target.value)}
              />
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Ticket
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      <CardDescription>{ticket.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {ticketStatusMap[ticket.status as keyof typeof ticketStatusMap].label}
                      </Badge>
                      <Badge variant="secondary" className={priorityMap[ticket.priority as keyof typeof priorityMap].color}>
                        {priorityMap[ticket.priority as keyof typeof priorityMap].label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Criado: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span>Atualizado: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab de Entregas */}
        <TabsContent value="deliverables" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((deliverable) => (
              <Card key={deliverable.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    {deliverable.name}
                  </CardTitle>
                  <CardDescription>
                    {deliverable.type === "document" ? "Documento" : "Protótipo"} • {deliverable.fileSize}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(deliverable.date).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab de Feedback */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avalie Nosso Trabalho</CardTitle>
              <CardDescription>
                Seu feedback é muito importante para melhorarmos nossos serviços
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Avaliação:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Comentários:</label>
                <Textarea
                  placeholder="Compartilhe sua experiência, sugestões ou elogios..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar Feedback
              </Button>
            </CardContent>
          </Card>

          {/* Feedback anterior */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Anterior</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">15/01/2024</span>
                  </div>
                  <p className="text-sm">
                    Excelente trabalho na primeira fase do projeto. A equipe foi muito profissional 
                    e entregou tudo dentro do prazo. Estamos muito satisfeitos com a qualidade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
