"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  Calendar,
  FileText,
  Eye,
  Edit,
  MessageSquare,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"

// Dados mockados para performance
const performanceStats = {
  totalEmployees: 25,
  evaluationsCompleted: 18,
  pendingEvaluations: 7,
  averageScore: 4.2,
  topPerformers: 6,
  needsAttention: 3,
  evaluationCycle: "Q3 2024"
}

const employees = [
  {
    id: "1",
    name: "Ana Costa",
    position: "Desenvolvedora Senior",
    department: "Tecnologia",
    manager: "Carlos Oliveira",
    avatar: "/avatars/ana.jpg",
    initials: "AC",
    currentScore: 4.8,
    previousScore: 4.5,
    trend: "up",
    status: "completed",
    lastEvaluation: "2024-09-15",
    nextEvaluation: "2024-12-15",
    goals: {
      completed: 8,
      total: 10,
      percentage: 80
    },
    skills: [
      { name: "Liderança Técnica", score: 4.9, target: 4.5 },
      { name: "Comunicação", score: 4.7, target: 4.0 },
      { name: "Inovação", score: 4.8, target: 4.5 },
      { name: "Colaboração", score: 4.6, target: 4.0 }
    ],
    feedback: {
      strengths: ["Excelente conhecimento técnico", "Ótima mentoria"],
      improvements: ["Gestão de tempo", "Documentação"]
    }
  },
  {
    id: "2", 
    name: "João Silva",
    position: "Analista de Marketing",
    department: "Marketing",
    manager: "Laura Lima",
    avatar: "/avatars/joao.jpg",
    initials: "JS",
    currentScore: 3.9,
    previousScore: 4.1,
    trend: "down",
    status: "pending",
    lastEvaluation: "2024-06-15",
    nextEvaluation: "2024-09-30",
    goals: {
      completed: 6,
      total: 12,
      percentage: 50
    },
    skills: [
      { name: "Análise de Dados", score: 4.2, target: 4.0 },
      { name: "Criatividade", score: 3.8, target: 4.0 },
      { name: "Planejamento", score: 3.6, target: 4.0 },
      { name: "Comunicação", score: 4.0, target: 4.0 }
    ],
    feedback: {
      strengths: ["Bom domínio analítico", "Proativo"],
      improvements: ["Criatividade nas campanhas", "Organização"]
    }
  },
  {
    id: "3",
    name: "Maria Santos",
    position: "Designer UX/UI",
    department: "Design",
    manager: "Roberto Silva",
    avatar: "/avatars/maria.jpg",
    initials: "MS",
    currentScore: 4.5,
    previousScore: 4.2,
    trend: "up",
    status: "completed",
    lastEvaluation: "2024-09-10",
    nextEvaluation: "2024-12-10",
    goals: {
      completed: 9,
      total: 10,
      percentage: 90
    },
    skills: [
      { name: "Design Visual", score: 4.8, target: 4.5 },
      { name: "Pesquisa UX", score: 4.3, target: 4.0 },
      { name: "Prototipagem", score: 4.6, target: 4.5 },
      { name: "Colaboração", score: 4.4, target: 4.0 }
    ],
    feedback: {
      strengths: ["Excelente senso estético", "Pesquisa detalhada"],
      improvements: ["Velocidade de entrega", "Ferramentas avançadas"]
    }
  },
  {
    id: "4",
    name: "Pedro Costa",
    position: "Consultor de Vendas",
    department: "Comercial",
    manager: "Sandra Mendes",
    avatar: "/avatars/pedro.jpg",
    initials: "PC",
    currentScore: 3.2,
    previousScore: 3.8,
    trend: "down",
    status: "needs-attention",
    lastEvaluation: "2024-08-20",
    nextEvaluation: "2024-09-25",
    goals: {
      completed: 3,
      total: 10,
      percentage: 30
    },
    skills: [
      { name: "Vendas", score: 3.5, target: 4.0 },
      { name: "Relacionamento", score: 3.8, target: 4.0 },
      { name: "Negociação", score: 2.9, target: 4.0 },
      { name: "Organização", score: 2.8, target: 3.5 }
    ],
    feedback: {
      strengths: ["Bom relacionamento", "Persistente"],
      improvements: ["Técnicas de fechamento", "Organização pessoal"]
    }
  },
  {
    id: "5",
    name: "Lucas Ferreira",
    position: "Analista Financeiro",
    department: "Financeiro",
    manager: "Helena Costa",
    avatar: "/avatars/lucas.jpg",
    initials: "LF",
    currentScore: 4.1,
    previousScore: 3.9,
    trend: "up",
    status: "completed",
    lastEvaluation: "2024-09-05",
    nextEvaluation: "2024-12-05",
    goals: {
      completed: 7,
      total: 8,
      percentage: 87
    },
    skills: [
      { name: "Análise Financeira", score: 4.3, target: 4.0 },
      { name: "Relatórios", score: 4.2, target: 4.0 },
      { name: "Excel Avançado", score: 4.0, target: 3.8 },
      { name: "Comunicação", score: 3.9, target: 4.0 }
    ],
    feedback: {
      strengths: ["Precisão analítica", "Relatórios detalhados"],
      improvements: ["Apresentações", "Automação de processos"]
    }
  }
]

const evaluationTemplates = [
  {
    id: "annual",
    name: "Avaliação Anual",
    description: "Avaliação completa de desempenho anual",
    duration: "60 min",
    sections: ["Metas", "Competências", "Comportamento", "Desenvolvimento"],
    frequency: "Anual",
    participants: ["Funcionário", "Gestor", "Pares"]
  },
  {
    id: "quarterly",
    name: "Check-in Trimestral", 
    description: "Revisão rápida de progresso e metas",
    duration: "30 min",
    sections: ["Metas", "Desafios", "Suporte"],
    frequency: "Trimestral",
    participants: ["Funcionário", "Gestor"]
  },
  {
    id: "probation",
    name: "Avaliação de Experiência",
    description: "Avaliação ao final do período de experiência",
    duration: "45 min", 
    sections: ["Adaptação", "Performance", "Fit Cultural"],
    frequency: "Única",
    participants: ["Funcionário", "Gestor", "RH"]
  },
  {
    id: "360",
    name: "Feedback 360°",
    description: "Avaliação completa com múltiplas perspectivas",
    duration: "90 min",
    sections: ["Liderança", "Colaboração", "Comunicação", "Resultados"],
    frequency: "Anual",
    participants: ["Funcionário", "Gestor", "Pares", "Subordinados"]
  }
]

export default function PerformancePage() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const filteredEmployees = employees.filter(employee => {
    const matchesStatus = filterStatus === "all" || employee.status === filterStatus
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesStatus && matchesDepartment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary" 
      case "needs-attention":
        return "destructive"
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
      case "pending":
        return "Pendente"
      case "needs-attention":
        return "Atenção"
      case "overdue":
        return "Atrasada"
      default:
        return "Em Análise"
    }
  }

  const getTrendIcon = (trend: string, score: number) => {
    if (trend === "up") {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (trend === "down") {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600"
    if (score >= 4.0) return "text-blue-600"
    if (score >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const handleNewEvaluation = () => {
    console.log("Nova avaliação")
  }

  const handleViewEmployee = (employeeId: string) => {
    setSelectedEmployee(employeeId)
  }

  const handleStartEvaluation = (employeeId: string) => {
    console.log(`Iniciar avaliação: ${employeeId}`)
  }

  return (
    <>
      <PageHeader
        title="Avaliação de Desempenho"
        description="Gerencie o ciclo de avaliações da equipe"
        actions={[
          {
            label: "Nova Avaliação",
            icon: Plus,
            onClick: handleNewEvaluation
          }
        ]}
        badge={{
          label: `Ciclo ${performanceStats.evaluationCycle}`,
          variant: "secondary"
        }}
      />

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Ativos na empresa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.evaluationsCompleted}</div>
            <Progress 
              value={(performanceStats.evaluationsCompleted / performanceStats.totalEmployees) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.averageScore}</div>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= performanceStats.averageScore
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.topPerformers}</div>
            <p className="text-xs text-muted-foreground">
              Score ≥ 4.5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisam Atenção</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{performanceStats.needsAttention}</div>
            <p className="text-xs text-muted-foreground">
              Score &lt; 3.5
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Funcionários */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Funcionários e Avaliações</CardTitle>
                  <CardDescription>
                    Status das avaliações por funcionário
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  {[
                    { key: "all", label: "Todos" },
                    { key: "completed", label: "Concluídas" },
                    { key: "pending", label: "Pendentes" },
                    { key: "needs-attention", label: "Atenção" }
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={filterStatus === filter.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(filter.key)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div 
                  key={employee.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {employee.department}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Gestor: {employee.manager}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(employee.status)}>
                          {getStatusLabel(employee.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className={`text-lg font-bold ${getScoreColor(employee.currentScore)}`}>
                          {employee.currentScore}
                        </span>
                        {getTrendIcon(employee.trend, employee.currentScore)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Metas: {employee.goals.completed}/{employee.goals.total}
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleViewEmployee(employee.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {employee.status === "pending" && (
                        <Button size="sm" onClick={() => handleStartEvaluation(employee.id)}>
                          Avaliar
                        </Button>
                      )}
                      {employee.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Templates de Avaliação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Templates de Avaliação
              </CardTitle>
              <CardDescription>
                Modelos pré-configurados de avaliação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evaluationTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <Badge variant="outline">{template.frequency}</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Duração:</span>
                        <span className="font-medium">{template.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Seções:</span>
                        <span className="font-medium">{template.sections.length}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      <p className="text-xs font-medium text-muted-foreground">Participantes:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.participants.map((participant, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Usar Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Insights e Ações */}
        <div className="space-y-4">
          {/* Próximas Avaliações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Próximas Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {employees
                .filter(e => e.status === "pending")
                .sort((a, b) => new Date(a.nextEvaluation).getTime() - new Date(b.nextEvaluation).getTime())
                .slice(0, 5)
                .map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-3 p-2 border rounded">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="text-xs">{employee.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(employee.nextEvaluation).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {employees
                .filter(e => e.currentScore >= 4.5)
                .sort((a, b) => b.currentScore - a.currentScore)
                .map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-3 p-2 border rounded">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="text-xs">{employee.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.position}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">{employee.currentScore}</div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= employee.currentScore
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Métricas Departamentais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Por Departamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Tecnologia", "Design", "Marketing", "Comercial", "Financeiro"].map((dept) => {
                const deptEmployees = employees.filter(e => e.department === dept)
                const avgScore = deptEmployees.length > 0 
                  ? deptEmployees.reduce((sum, e) => sum + e.currentScore, 0) / deptEmployees.length 
                  : 0

                return (
                  <div key={dept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{dept}</span>
                      <span className="font-medium">{avgScore.toFixed(1)}</span>
                    </div>
                    <Progress value={(avgScore / 5) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {deptEmployees.length} funcionários
                    </p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Relatório de Performance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Avaliações
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback 360°
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Definir Metas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum funcionário encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            Ajuste os filtros ou inicie uma nova avaliação.
          </p>
        </div>
      )}
    </>
  )
}
