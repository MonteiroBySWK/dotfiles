"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Users,
  UserPlus,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Award,
  MessageSquare,
  Target,
  TrendingUp,
  Download,
  Edit,
  Eye
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import {  } from "@/components/layout/page-container"
import { StatCard } from "@/components/common"

// Dados mockados para onboarding
const onboardingStats = {
  totalNewHires: 5,
  activeOnboarding: 3,
  completedThisMonth: 8,
  averageCompletionTime: 14, // dias
  completionRate: 92,
  tasksCompleted: 156,
  totalTasks: 170
}

const newHires = [
  {
    id: "1",
    name: "João Silva",
    position: "Desenvolvedor Frontend",
    department: "Tecnologia",
    startDate: "2024-09-15",
    mentor: "Ana Costa",
    progress: 75,
    status: "in-progress",
    tasksCompleted: 12,
    totalTasks: 16,
    nextTask: "Configurar ambiente de desenvolvimento",
    avatar: "/avatars/joao.jpg",
    initials: "JS"
  },
  {
    id: "2", 
    name: "Maria Santos",
    position: "Designer UX/UI",
    department: "Design",
    startDate: "2024-09-10",
    mentor: "Carlos Oliveira",
    progress: 90,
    status: "almost-complete",
    tasksCompleted: 14,
    totalTasks: 15,
    nextTask: "Apresentação final do projeto",
    avatar: "/avatars/maria.jpg",
    initials: "MS"
  },
  {
    id: "3",
    name: "Pedro Costa",
    position: "Analista de Marketing",
    department: "Marketing",
    startDate: "2024-09-20",
    mentor: "Laura Lima",
    progress: 45,
    status: "in-progress",
    tasksCompleted: 7,
    totalTasks: 16,
    nextTask: "Conhecer ferramentas de análise",
    avatar: "/avatars/pedro.jpg",
    initials: "PC"
  },
  {
    id: "4",
    name: "Ana Oliveira",
    position: "Consultora de Vendas",
    department: "Comercial",
    startDate: "2024-09-05",
    mentor: "Roberto Silva",
    progress: 100,
    status: "completed",
    tasksCompleted: 18,
    totalTasks: 18,
    nextTask: "Integração completa!",
    avatar: "/avatars/ana-o.jpg",
    initials: "AO"
  },
  {
    id: "5",
    name: "Lucas Ferreira",
    position: "Analista Financeiro",
    department: "Financeiro",
    startDate: "2024-09-18",
    mentor: "Sandra Mendes",
    progress: 30,
    status: "in-progress",
    tasksCompleted: 5,
    totalTasks: 17,
    nextTask: "Treinamento em sistemas financeiros",
    avatar: "/avatars/lucas.jpg",
    initials: "LF"
  }
]

const onboardingTemplates = [
  {
    id: "dev-frontend",
    name: "Desenvolvedor Frontend", 
    department: "Tecnologia",
    duration: "2 semanas",
    tasks: 16,
    modules: [
      "Apresentação da empresa",
      "Configuração do ambiente",
      "Treinamentos técnicos",
      "Projeto piloto",
      "Avaliação final"
    ],
    usageCount: 8
  },
  {
    id: "designer",
    name: "Designer UX/UI",
    department: "Design", 
    duration: "10 dias",
    tasks: 15,
    modules: [
      "Cultura organizacional",
      "Ferramentas de design",
      "Processo criativo",
      "Portfolio de projetos",
      "Integração com equipe"
    ],
    usageCount: 5
  },
  {
    id: "vendas",
    name: "Consultor de Vendas",
    department: "Comercial",
    duration: "3 semanas", 
    tasks: 18,
    modules: [
      "Produtos e serviços",
      "Metodologia de vendas",
      "CRM e ferramentas",
      "Acompanhamento prático",
      "Certificação interna"
    ],
    usageCount: 12
  },
  {
    id: "marketing",
    name: "Analista de Marketing",
    department: "Marketing",
    duration: "2 semanas",
    tasks: 16,
    modules: [
      "Estratégia de marketing",
      "Ferramentas de análise",
      "Campanhas ativas",
      "Métricas e KPIs",
      "Planejamento"
    ],
    usageCount: 6
  }
]

const recentActivities = [
  {
    id: "1",
    type: "completion",
    message: "Ana Oliveira completou o onboarding",
    timestamp: "2024-09-21T14:30:00Z",
    user: "Ana Oliveira"
  },
  {
    id: "2",
    type: "start",
    message: "Pedro Costa iniciou o módulo de ferramentas",
    timestamp: "2024-09-21T10:15:00Z",
    user: "Pedro Costa"
  },
  {
    id: "3",
    type: "feedback",
    message: "João Silva enviou feedback sobre treinamento",
    timestamp: "2024-09-21T09:45:00Z",
    user: "João Silva"
  },
  {
    id: "4",
    type: "milestone",
    message: "Maria Santos atingiu 90% de progresso",
    timestamp: "2024-09-20T16:20:00Z",
    user: "Maria Santos"
  }
]

export default function OnboardingPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredEmployees = newHires.filter(employee => 
    filterStatus === "all" || employee.status === filterStatus
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "almost-complete":
        return "secondary"
      case "in-progress":
        return "outline"
      case "delayed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "almost-complete":
        return "Quase Pronto"
      case "in-progress":
        return "Em Andamento"
      case "delayed":
        return "Atrasado"
      default:
        return "Pendente"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completion":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "start":
        return <UserPlus className="h-4 w-4 text-blue-600" />
      case "feedback":
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      case "milestone":
        return <Award className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const handleCreateOnboarding = () => {
    console.log("Criar novo onboarding")
  }

  const handleViewEmployee = (employeeId: string) => {
    setSelectedEmployee(employeeId)
  }

  const handleEditTemplate = (templateId: string) => {
    console.log(`Editar template: ${templateId}`)
  }

  return (
    <>
      <PageHeader
        title="Onboarding"
        description="Acompanhe a integração de novos funcionários"
        actions={[
          {
            label: "Novo Onboarding",
            icon: UserPlus,
            onClick: handleCreateOnboarding
          }
        ]}
        badge={{
          label: `${onboardingStats.activeOnboarding} ativos`,
          variant: "secondary"
        }}
      />

      {/* Estatísticas Principais - Using new StatCard component with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Novos Funcionários"
          value={onboardingStats.totalNewHires.toString()}
          description={`${onboardingStats.activeOnboarding} em andamento`}
          icon={Users}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Taxa de Conclusão"
          value={`${onboardingStats.completionRate}%`}
          icon={Target}
          iconColor="text-green-600"
        />
        <StatCard
          title="Tempo Médio"
          value={`${onboardingStats.averageCompletionTime} dias`}
          description="Para completar"
          icon={Clock}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Concluídos"
          value={onboardingStats.completedThisMonth.toString()}
          description="Este mês"
          icon={CheckCircle}
          iconColor="text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Funcionários em Onboarding */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Funcionários em Onboarding</CardTitle>
                  <CardDescription>
                    Acompanhe o progresso de cada novo funcionário
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  {[
                    { key: "all", label: "Todos" },
                    { key: "in-progress", label: "Em Andamento" },
                    { key: "almost-complete", label: "Quase Pronto" },
                    { key: "completed", label: "Concluído" }
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
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{employee.initials}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Início: {new Date(employee.startDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Mentor: {employee.mentor}
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
                        <span className="text-sm font-medium">{employee.progress}%</span>
                      </div>
                      <Progress value={employee.progress} className="w-24 mt-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {employee.tasksCompleted}/{employee.totalTasks} tarefas
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleViewEmployee(employee.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Templates de Onboarding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Templates de Onboarding
              </CardTitle>
              <CardDescription>
                Modelos pré-configurados por área
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {onboardingTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.department}</p>
                      </div>
                      <Badge variant="outline">{template.usageCount} usos</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Duração:</span>
                        <span className="font-medium">{template.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tarefas:</span>
                        <span className="font-medium">{template.tasks}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      {template.modules.slice(0, 3).map((module, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {module}
                        </div>
                      ))}
                      {template.modules.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          + {template.modules.length - 3} módulos
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Usar Template
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Atividades e Resumo */}
        <div className="space-y-4">
          {/* Próximas Tarefas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Próximas Tarefas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {newHires.filter(e => e.status !== "completed").map((employee) => (
                <div key={employee.id} className="flex items-center space-x-3 p-2 border rounded">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">{employee.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{employee.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {employee.nextTask}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Progresso Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tarefas Concluídas</span>
                  <span>{onboardingStats.tasksCompleted}/{onboardingStats.totalTasks}</span>
                </div>
                <Progress value={(onboardingStats.tasksCompleted / onboardingStats.totalTasks) * 100} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-700">92%</div>
                  <div className="text-xs text-green-600">Taxa Sucesso</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-700">14d</div>
                  <div className="text-xs text-blue-600">Tempo Médio</div>
                </div>
              </div>
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
                Relatório de Onboarding
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Template
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
            Ajuste os filtros ou inicie um novo onboarding.
          </p>
        </div>
      )}
    </>
  )
}
