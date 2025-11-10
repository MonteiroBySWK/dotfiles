"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Search,
  Calendar,
  Target,
  Award
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import {  } from "@/components/layout/page-container"

// Dados mockados de avaliações da equipe
const teamReviews = [
  {
    id: "1",
    employee: {
      name: "Ana Silva",
      role: "Product Manager",
      department: "Produto",
      avatar: "/avatars/ana.jpg"
    },
    reviewer: "João Manager",
    period: "Q3 2024",
    reviewDate: "2024-09-15",
    status: "completed",
    overallRating: 4.5,
    categories: {
      technical: 4.0,
      communication: 5.0,
      leadership: 4.5,
      collaboration: 4.0,
      innovation: 5.0
    },
    goals: [
      { description: "Implementar novo sistema de feedback", status: "completed", weight: 30 },
      { description: "Aumentar satisfação do cliente em 15%", status: "in_progress", weight: 40 },
      { description: "Mentorear 2 novos PMs", status: "completed", weight: 30 }
    ],
    strengths: [
      "Excelente visão estratégica",
      "Comunicação clara e objetiva",
      "Forte liderança de produto"
    ],
    improvements: [
      "Delegar mais responsabilidades",
      "Aprofundar conhecimentos técnicos"
    ],
    nextGoals: [
      "Liderar iniciativa de inovação",
      "Expandir expertise em dados"
    ]
  },
  {
    id: "2",
    employee: {
      name: "Carlos Santos",
      role: "Tech Lead",
      department: "Desenvolvimento",
      avatar: "/avatars/carlos.jpg"
    },
    reviewer: "João Manager",
    period: "Q3 2024",
    reviewDate: "2024-09-10",
    status: "completed",
    overallRating: 4.2,
    categories: {
      technical: 5.0,
      communication: 3.5,
      leadership: 4.0,
      collaboration: 4.5,
      innovation: 4.0
    },
    goals: [
      { description: "Refatorar sistema legado", status: "completed", weight: 50 },
      { description: "Implementar CI/CD completo", status: "completed", weight: 30 },
      { description: "Reduzir tempo de deploy em 50%", status: "in_progress", weight: 20 }
    ],
    strengths: [
      "Domínio técnico excepcional",
      "Capacidade de resolver problemas complexos",
      "Mentoria efetiva da equipe"
    ],
    improvements: [
      "Melhorar comunicação com stakeholders",
      "Documentar mais decisões arquiteturais"
    ],
    nextGoals: [
      "Implementar arquitetura de microserviços",
      "Desenvolver programa de treinamento técnico"
    ]
  },
  {
    id: "3",
    employee: {
      name: "Maria Oliveira",
      role: "Desenvolvedor Frontend",
      department: "Desenvolvimento",
      avatar: "/avatars/maria.jpg"
    },
    reviewer: "Carlos Santos",
    period: "Q3 2024",
    reviewDate: "2024-09-12",
    status: "completed",
    overallRating: 4.0,
    categories: {
      technical: 4.0,
      communication: 4.0,
      leadership: 3.5,
      collaboration: 4.5,
      innovation: 4.0
    },
    goals: [
      { description: "Implementar design system", status: "completed", weight: 40 },
      { description: "Melhorar performance em 30%", status: "completed", weight: 35 },
      { description: "Liderar projeto de acessibilidade", status: "in_progress", weight: 25 }
    ],
    strengths: [
      "Código limpo e bem estruturado",
      "Atenção aos detalhes de UX",
      "Proatividade em melhorias"
    ],
    improvements: [
      "Assumir mais responsabilidades de liderança",
      "Participar mais de decisões arquiteturais"
    ],
    nextGoals: [
      "Mentorear desenvolvedor júnior",
      "Especializarse em performance web"
    ]
  },
  {
    id: "4",
    employee: {
      name: "Pedro Lima",
      role: "Desenvolvedor Backend",
      department: "Desenvolvimento",
      avatar: "/avatars/pedro.jpg"
    },
    reviewer: "Carlos Santos",
    period: "Q3 2024",
    reviewDate: "2024-09-08",
    status: "scheduled",
    overallRating: 0,
    categories: {
      technical: 0,
      communication: 0,
      leadership: 0,
      collaboration: 0,
      innovation: 0
    },
    goals: [],
    strengths: [],
    improvements: [],
    nextGoals: []
  }
]

export default function TeamReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")

  const filteredReviews = teamReviews.filter(review => {
    const matchesSearch = review.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || review.employee.department === departmentFilter
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesPeriod = periodFilter === "all" || review.period === periodFilter
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesPeriod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "secondary"
      case "scheduled":
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
        return "Concluída"
      case "scheduled":
        return "Agendada"
      case "overdue":
        return "Atrasada"
      default:
        return status
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    if (rating >= 3.0) return "text-orange-600"
    return "text-red-600"
  }

  const getTrendIcon = (rating: number) => {
    if (rating >= 4.0) return TrendingUp
    if (rating >= 3.5) return Minus
    return TrendingDown
  }

  const getGoalProgress = (goals: Array<{ status: string }>) => {
    if (goals.length === 0) return 0
    const completed = goals.filter(goal => goal.status === "completed").length
    return Math.round((completed / goals.length) * 100)
  }

  return (
    <>
      <PageHeader
        title="Avaliações da Equipe"
        description="Acompanhe avaliações de performance e desenvolvimento"
        actions={[
          {
            label: "Nova Avaliação",
            icon: Plus,
            onClick: () => console.log("Criar nova avaliação")
          }
        ]}
        badge={{
          label: `${teamReviews.filter(r => r.status === "completed").length} concluídas`,
          variant: "secondary"
        }}
      />

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar avaliações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Q3 2024">Q3 2024</SelectItem>
              <SelectItem value="Q2 2024">Q2 2024</SelectItem>
              <SelectItem value="Q1 2024">Q1 2024</SelectItem>
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Produto">Produto</SelectItem>
              <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
              <SelectItem value="scheduled">Agendadas</SelectItem>
              <SelectItem value="overdue">Atrasadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Avaliações */}
      <div className="space-y-6">
        {filteredReviews.map((review) => {
          const TrendIcon = getTrendIcon(review.overallRating)
          const goalProgress = getGoalProgress(review.goals)
          
          return (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.employee.avatar} />
                      <AvatarFallback>
                        {review.employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{review.employee.name}</CardTitle>
                      <CardDescription className="text-base">
                        {review.employee.role} • {review.employee.department}
                      </CardDescription>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {review.period}
                        </div>
                        <div>Avaliador: {review.reviewer}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <Badge variant={getStatusColor(review.status)}>
                      {getStatusLabel(review.status)}
                    </Badge>
                    {review.status === "completed" && (
                      <div className="flex items-center space-x-2">
                        <div className={`text-2xl font-bold ${getRatingColor(review.overallRating)}`}>
                          {review.overallRating.toFixed(1)}
                        </div>
                        <TrendIcon className={`h-5 w-5 ${getRatingColor(review.overallRating)}`} />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {review.status === "completed" && (
                <CardContent className="space-y-6">
                  {/* Categorias de Avaliação */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Avaliação por Categoria</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(review.categories).map(([category, rating]) => (
                        <div key={category} className="text-center">
                          <div className="text-lg font-semibold">{rating.toFixed(1)}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {category === "technical" && "Técnico"}
                            {category === "communication" && "Comunicação"}
                            {category === "leadership" && "Liderança"}
                            {category === "collaboration" && "Colaboração"}
                            {category === "innovation" && "Inovação"}
                          </div>
                          <div className="flex justify-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metas */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Metas do Período</h4>
                      <Badge variant="outline">
                        {goalProgress}% concluído
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {review.goals.map((goal, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center space-x-3">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{goal.description}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{goal.weight}%</span>
                            <Badge variant={goal.status === "completed" ? "secondary" : "outline"}>
                              {goal.status === "completed" ? "Concluída" : "Em andamento"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pontos Fortes e Melhorias */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <Award className="h-4 w-4 mr-2 text-green-600" />
                        Pontos Fortes
                      </h4>
                      <div className="space-y-2">
                        {review.strengths.map((strength, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 mt-2" />
                            {strength}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                        Áreas de Melhoria
                      </h4>
                      <div className="space-y-2">
                        {review.improvements.map((improvement, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 mt-2" />
                            {improvement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Próximas Metas */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Metas para Próximo Período</h4>
                    <div className="space-y-2">
                      {review.nextGoals.map((goal, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}

              {review.status === "scheduled" && (
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Avaliação agendada para {new Date(review.reviewDate).toLocaleDateString('pt-BR')}
                    </p>
                    <Button className="mt-4" size="sm">
                      Iniciar Avaliação
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhuma avaliação encontrada</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || departmentFilter !== "all" || statusFilter !== "all"
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Comece criando a primeira avaliação da equipe."}
          </p>
        </div>
      )}
    </>
  )
}
