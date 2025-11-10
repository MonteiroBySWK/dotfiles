import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Users, 
  Calendar, 
  GitBranch,
  Kanban,
  GanttChart,
  FileText,
  Settings
} from "lucide-react"
import { StatCard } from "@/components/common"

// Mock data - em produção viria de uma API
const getProjectData = (projectId: string) => {
  const projects = {
    "alpha": {
      id: "alpha",
      name: "Projeto Alpha",
      description: "Sistema de gestão empresarial completo com módulos financeiro, RH e vendas",
      status: "in-progress",
      team: 8,
      progress: 65,
      deadline: "2025-12-15",
      priority: "high",
      createdAt: "2025-08-01",
      budget: "R$ 250.000",
      client: "Empresa XYZ Ltda"
    },
    "beta": {
      id: "beta", 
      name: "Website Redesign",
      description: "Renovação completa do site institucional com foco em UX/UI",
      status: "planning",
      team: 5,
      progress: 20,
      deadline: "2025-11-30", 
      priority: "medium",
      createdAt: "2025-09-15",
      budget: "R$ 80.000",
      client: "Startup ABC"
    }
  }
  
  return projects[projectId as keyof typeof projects] || null
}

const statusColors = {
  "planning": "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "completed": "bg-green-100 text-green-800",
  "paused": "bg-gray-100 text-gray-800"
}

const priorityColors = {
  "low": "bg-green-100 text-green-800",
  "medium": "bg-yellow-100 text-yellow-800", 
  "high": "bg-orange-100 text-orange-800",
  "critical": "bg-red-100 text-red-800"
}

interface ProjectPageProps {
  params: {
    projectId: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectData(params.projectId)
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Projeto não encontrado</h1>
        <p className="text-gray-600 mt-2">O projeto solicitado não existe ou foi removido.</p>
        <Link href="/dashboard/projects">
          <Button className="mt-4">Voltar para Projetos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header do Projeto */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge className={statusColors[project.status as keyof typeof statusColors]}>
              {project.status}
            </Badge>
            <Badge className={priorityColors[project.priority as keyof typeof priorityColors]}>
              {project.priority}
            </Badge>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.team}</div>
            <p className="text-xs text-muted-foreground">membros ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prazo</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(project.deadline).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short' 
              })}
            </div>
            <p className="text-xs text-muted-foreground">deadline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.budget}</div>
            <p className="text-xs text-muted-foreground">total aprovado</p>
          </CardContent>
        </Card>
      </div>

      {/* Navegação por Ferramentas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href={`/dashboard/projects/${project.id}/kanban`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Kanban className="h-8 w-8 mx-auto text-blue-600" />
              <CardTitle className="text-lg">Kanban</CardTitle>
              <CardDescription>Gerencie tarefas em quadros</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/dashboard/projects/${project.id}/gantt`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <GanttChart className="h-8 w-8 mx-auto text-green-600" />
              <CardTitle className="text-lg">Gantt</CardTitle>
              <CardDescription>Timeline do projeto</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/dashboard/projects/${project.id}/backlog`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <GitBranch className="h-8 w-8 mx-auto text-purple-600" />
              <CardTitle className="text-lg">Backlog</CardTitle>
              <CardDescription>Gerencie sprints e itens</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/dashboard/projects/${project.id}/requirements`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <FileText className="h-8 w-8 mx-auto text-orange-600" />
              <CardTitle className="text-lg">Requisitos</CardTitle>
              <CardDescription>Documentação e specs</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Informações Detalhadas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span>{project.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Criado em:</span>
                  <span>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                    {project.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progresso:</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Membros:</span>
                  <span>{project.team} pessoas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prioridade:</span>
                  <Badge className={priorityColors[project.priority as keyof typeof priorityColors]}>
                    {project.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
