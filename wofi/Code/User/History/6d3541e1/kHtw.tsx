"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import {  } from "@/components/layout/page-container"

// Dados mockados de prazos
const deadlines = [
  {
    id: "1",
    title: "Entrega Final - Projeto Alpha",
    description: "Entrega completa do sistema de gestão",
    dueDate: "2025-12-15",
    status: "pending",
    priority: "high",
    project: "Projeto Alpha",
    assignedTo: "Equipe Dev"
  },
  {
    id: "2", 
    title: "Apresentação Cliente Beta",
    description: "Apresentação do protótipo para cliente",
    dueDate: "2025-11-30",
    status: "pending",
    priority: "medium",
    project: "Website Redesign",
    assignedTo: "Ana Silva"
  },
  {
    id: "3",
    title: "Review de Código",
    description: "Revisão final do código antes do deploy",
    dueDate: "2025-10-25",
    status: "completed",
    priority: "high",
    project: "App Mobile",
    assignedTo: "Carlos Santos"
  },
  {
    id: "4",
    title: "Documentação API",
    description: "Finalizar documentação da API Gateway",
    dueDate: "2025-11-20",
    status: "overdue",
    priority: "medium",
    project: "API Gateway",
    assignedTo: "Tech Team"
  }
]

export default function DeadlinesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredDeadlines = deadlines.filter(deadline => {
    const matchesSearch = deadline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deadline.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deadline.project.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || deadline.status === statusFilter
    const matchesPriority = priorityFilter === "all" || deadline.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "secondary"
      case "pending":
        return "default"
      case "overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "pending":
        return "Pendente"
      case "overdue":
        return "Atrasado"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  const getDaysUntilDeadline = (dueDate: string) => {
    const today = new Date()
    const deadline = new Date(dueDate)
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <>
      <PageHeader
        title="Prazos e Deadlines"
        description="Acompanhe todos os prazos importantes dos seus projetos"
        actions={[
          {
            label: "Novo Prazo",
            icon: Plus,
            onClick: () => console.log("Adicionar novo prazo")
          }
        ]}
        badge={{
          label: `${deadlines.filter(d => d.status === "pending").length} pendentes`,
          variant: "secondary"
        }}
      />

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar prazos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="overdue">Atrasados</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Prazos */}
      <div className="space-y-4">
        {filteredDeadlines.map((deadline) => {
          const daysUntil = getDaysUntilDeadline(deadline.dueDate)
          
          return (
            <Card key={deadline.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{deadline.title}</CardTitle>
                      <Badge variant={getStatusColor(deadline.status)}>
                        {getStatusLabel(deadline.status)}
                      </Badge>
                      <Badge variant={getPriorityColor(deadline.priority)}>
                        {getPriorityLabel(deadline.priority)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {deadline.description}
                    </CardDescription>
                  </div>
                  
                  <div className="text-right">
                    {deadline.status === "overdue" ? (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {Math.abs(daysUntil)} dias atrasado
                        </span>
                      </div>
                    ) : deadline.status === "completed" ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Concluído</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {daysUntil > 0 ? `${daysUntil} dias restantes` : "Vence hoje"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(deadline.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <strong>Projeto:</strong> {deadline.project}
                    </div>
                    <div>
                      <strong>Responsável:</strong> {deadline.assignedTo}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    {deadline.status === "pending" && (
                      <Button size="sm">
                        Marcar como Concluído
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredDeadlines.length === 0 && (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum prazo encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Comece adicionando prazos aos seus projetos."}
          </p>
        </div>
      )}
    </>
  )
}
